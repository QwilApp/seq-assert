"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertSequence = assertSequence;
exports.matchObject = matchObject;
exports.o = o;
exports.p = p;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function assertSequence(graphFn, seq) {
  try {
    var graph = graphFn();
    var paths = getAllPaths(graph);
    var pathsFlat = paths.reduce(function (res, item) {
      return [].concat(_toConsumableArray(res), _toConsumableArray(item));
    }, []);
    pathsFlat.forEach(function (item) {
      if (!seq.find(function (seqItem) {
        return matchObject(seqItem, item);
      })) {
        throw new Error("Extra item types in graph");
      }
    });
    seq.forEach(function (seqItem) {
      if (!pathsFlat.find(function (item) {
        return matchObject(seqItem, item);
      })) {
        throw new Error("Missing item types in graph");
      }
    });
    var nodes = getNodes(graph);

    if (seq.length > nodes.length) {
      console.log("nodes:", nodes);
      throw new Error("Missing items in graph");
    }

    if (seq.length < nodes.length) {
      console.log("nodes:", nodes);
      throw new Error("Extra items in graph");
    }

    paths.forEach(function (list) {
      var actual = seq.map(function (item) {
        return list.find(function (a) {
          return matchObject(item, a);
        });
      }).filter(function (item) {
        return !!item;
      });

      if (actual.length !== list.length || !!actual.find(function (item, i) {
        return !matchObject(item, list[i]);
      })) {
        console.log("failed path", list);
        throw new Error("Wrong order");
      }
    });
  } catch (e) {
    console.log("seq:", seq);
    throw e;
  }
}

function matchObject(obj, patch) {
  if (_typeof(obj) !== "object") {
    return obj === patch;
  }

  return Object.keys(patch).every(function (key) {
    return matchObject(obj[key], patch[key]);
  });
}

function o() {
  var items = Array.prototype.slice.call(arguments);
  validate(items);
  var res = {
    value: items[0]
  };
  var node = res;

  for (var i = 1; i < items.length; i++) {
    var item = items[i];

    if (typeof item === "function") {
      node.nodes = item();
    } else {
      (function () {
        var newNode = {
          value: item
        };
        getLeafs([node]).forEach(function (n) {
          n.nodes = [newNode];
        });
        node = newNode;
      })();
    }
  }

  return function resultOrdered() {
    return res;
  };

  function validate(items) {
    for (var _i = 0; _i < items.length; _i++) {
      var _item = items[_i];

      if (typeof _item === "function") {
        if (_item.name === "resultOrdered") {
          throw new Error("Can't have ordered block as direct child of ordered block");
        }

        if (_item.name === "resultParallel" && (_i === 0 || typeof items[_i - 1] === "function")) {
          throw new Error("Parallel block should follow after simple item");
        }
      }
    }
  }
}

function p() {
  var items = Array.prototype.slice.call(arguments);
  validate(items);
  return function resultParallel() {
    return items.map(function (item) {
      if (typeof item === "function") {
        return item();
      }

      return {
        value: item
      };
    });
  };

  function validate(items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (typeof item === "function" && item.name === "resultParallel") {
        throw new Error("Can't have parallel block as direct child of parallel block");
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

  var result = [];
  iter(Array.isArray(object) ? {
    nodes: object
  } : {
    nodes: [object]
  }, []);
  return result;
}

function getLeafs(nodes) {
  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  for (var i = 0; i < nodes.length; i++) {
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

  function iter(nodes) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    for (var i = 0; i < nodes.length; i++) {
      if (!result.includes(nodes[i])) {
        result.push(nodes[i]);
      }

      iter(nodes[i].nodes || [], result);
    }

    return result;
  }
}
