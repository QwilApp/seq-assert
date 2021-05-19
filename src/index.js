export function assertSequence(graphFn, seq) {
  try {
    const graph = graphFn();
    const paths = getAllPaths(graph);
    const pathsFlat = paths.reduce((res, item) => [...res, ...item], []);
    pathsFlat.forEach((item) => {
      if (!seq.find((seqItem) => matchObject(seqItem, item))) {
        throw new Error("Extra item types in graph");
      }
    });
    seq.forEach((seqItem) => {
      if (!pathsFlat.find((item) => matchObject(seqItem, item))) {
        throw new Error("Missing item types in graph");
      }
    });
    const nodes = getNodes(graph)
    if (seq.length > nodes.length) {
      console.log("nodes:", nodes);
      throw new Error("Missing items in graph");
    }
    if (seq.length < nodes.length) {
      console.log("nodes:", nodes);
      throw new Error("Extra items in graph");
    }
    paths.forEach((list) => {
      const actual = seq
        .map((item) => list.find((a) => matchObject(item, a)))
        .filter((item) => !!item);
      if (
        actual.length !== list.length ||
        !!actual.find((item, i) => !matchObject(item, list[i]))
      ) {
        console.log("failed path", list);
        throw new Error("Wrong order");
      }
    });
  } catch (e) {
    console.log("seq:", seq);
    throw e;
  }
}

export function matchObject(obj, patch) {
  if (typeof obj !== "object") {
    return obj === patch;
  }
  return Object.keys(patch).every((key) => matchObject(obj[key], patch[key]));
}

export function o() {
  const items = [...arguments];
  validate(items);
  const res = {
    value: items[0],
  };
  let node = res;
  for (let i = 1; i < items.length; i++) {
    const item = items[i];
    if (typeof item === "function") {
      node.nodes = item();
    } else {
      const newNode = { value: item };
      getLeafs([node]).forEach((n) => {
        n.nodes = [newNode];
      });
      node = newNode;
    }
  }
  return function resultOrdered() {
    return res;
  };

  function validate(items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (typeof item === "function") {
        if (item.name === "resultOrdered") {
          throw new Error(
            "Can't have ordered block as direct child of ordered block"
          );
        }
        if (
          item.name === "resultParallel" &&
          (i === 0 || typeof items[i - 1] === "function")
        ) {
          throw new Error("Parallel block should follow after simple item");
        }
      }
    }
  }
}

export function p() {
  const items = [...arguments];
  validate(items);
  return function resultParallel() {
    return items.map((item) => {
      if (typeof item === "function") {
        return item();
      }
      return {
        value: item,
      };
    });
  };

  function validate(items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (typeof item === "function" && item.name === "resultParallel") {
        throw new Error(
          "Can't have parallel block as direct child of parallel block"
        );
      }
    }
  }
}

function getAllPaths(object) {
  function iter(o, p) {
    if (o.nodes && o.nodes.length) {
      return o.nodes.forEach(function (node) {
        iter(node, p.concat(node.value));
      });
    }
    result.push(p);
  }

  const result = [];
  iter(Array.isArray(object) ? { nodes: object } : { nodes: [object] }, []);
  return result;
}

function getLeafs(nodes, result = []) {
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].nodes || nodes[i].nodes.length === 0) {
      result.push(nodes[i]);
    } else {
      result = getLeafs(nodes[i].nodes, result);
    }
  }
  return result;
}

function getNodes(graph) {
  return iter(Array.isArray(graph) ? graph : [graph]);

  function iter(nodes, result = []) {
    for (let i = 0; i < nodes.length; i++) {
      if (!result.includes(nodes[i])) {
        result.push(nodes[i]);
      }
      iter(nodes[i].nodes || [], result);
    }
    return result;
  }
}
