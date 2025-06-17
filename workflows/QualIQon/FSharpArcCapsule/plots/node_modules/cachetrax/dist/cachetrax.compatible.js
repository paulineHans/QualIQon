"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.Cachetrax = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      /**
      * Fable Core Pre-initialization Service Base
      *
      * For a couple services, we need to be able to instantiate them before the Fable object is fully initialized.
      * This is a base class for those services.
      *
      * @author <steven@velozo.com>
      */
      var FableCoreServiceProviderBase = /*#__PURE__*/function () {
        function FableCoreServiceProviderBase(pOptions, pServiceHash) {
          _classCallCheck(this, FableCoreServiceProviderBase);
          this.fable = false;
          this.options = _typeof(pOptions) === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';

          // The hash will be a non-standard UUID ... the UUID service uses this base class!
          this.UUID = "CORESVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : "".concat(this.UUID);
        }
        _createClass(FableCoreServiceProviderBase, [{
          key: "connectFable",
          value:
          // After fable is initialized, it would be expected to be wired in as a normal service.
          function connectFable(pFable) {
            this.fable = pFable;
            return true;
          }
        }]);
        return FableCoreServiceProviderBase;
      }();
      _defineProperty(FableCoreServiceProviderBase, "isFableService", true);
      module.exports = FableCoreServiceProviderBase;
    }, {}],
    2: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @author <steven@velozo.com>
      */
      var FableServiceProviderBase = /*#__PURE__*/_createClass(function FableServiceProviderBase(pFable, pOptions, pServiceHash) {
        _classCallCheck(this, FableServiceProviderBase);
        this.fable = pFable;
        this.options = _typeof(pOptions) === 'object' ? pOptions : _typeof(pFable) === 'object' && !pFable.isFable ? pFable : {};
        this.serviceType = 'Unknown';
        if (typeof pFable.getUUID == 'function') {
          this.UUID = pFable.getUUID();
        } else {
          this.UUID = "NoFABLESVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
        }
        this.Hash = typeof pServiceHash === 'string' ? pServiceHash : "".concat(this.UUID);

        // Pull back a few things
        this.log = this.fable.log;
        this.servicesMap = this.fable.serviceMap;
        this.services = this.fable.services;
      });
      _defineProperty(FableServiceProviderBase, "isFableService", true);
      module.exports = FableServiceProviderBase;
      module.exports.CoreServiceProviderBase = require('./Fable-ServiceProviderBase-Preinit.js');
    }, {
      "./Fable-ServiceProviderBase-Preinit.js": 1
    }],
    3: [function (require, module, exports) {
      /**
      * Cache data structure with:
      *  - enumerable items
      *  - unique hash item access (if none is passed in, one is generated)
      *  - size (length) expiration
      *  - controllable expiration (e.g. keep in cache longer if older/less likely to change)
      *  - time-based expiration
      *  - custom expiration based on passed-in function
      *
      * Also:
      *  - built to work well with browserify
      *  - no dependencies at all
      *  - pet friendly
      *
      * @author Steven Velozo <steven@velozo.com>
      */
      var libFableServiceProviderBase = require('fable-serviceproviderbase');
      var libLinkedList = require("./LinkedList.js");
      var CashMoney = /*#__PURE__*/function (_libFableServiceProvi) {
        _inherits(CashMoney, _libFableServiceProvi);
        var _super = _createSuper(CashMoney);
        function CashMoney(pFable, pManifest, pServiceHash) {
          var _this;
          _classCallCheck(this, CashMoney);
          if (pFable === undefined) {
            _this = _super.call(this, {});
          } else {
            _this = _super.call(this, pFable, pManifest, pServiceHash);
          }
          _this.serviceType = 'ObjectCache';

          // The map of node objects by hash because Reasons.
          _this._HashMap = {};
          _this._RecordMap = {};
          _this._List = new libLinkedList();

          // If the list gets over maxLength, we will automatically remove nodes on insertion.
          _this.maxLength = 0;

          // If cache entries get over this age, they are removed with prune
          _this.maxAge = 0;
          return _possibleConstructorReturn(_this);
        }
        _createClass(CashMoney, [{
          key: "RecordMap",
          get: function get() {
            return this._RecordMap;
          }

          // Add (or update) a node in the cache
        }, {
          key: "put",
          value: function put(pData, pHash) {
            // If the hash of the record exists
            if (this._HashMap.hasOwnProperty(pHash)) {
              // Just update the hashed records datum
              this._HashMap[pHash].Datum = pData;
              this._RecordMap[pHash] = pData;
              return this._HashMap[pHash].Datum;
            }
            var tmpNode = this._List.push(pData, pHash);
            this._HashMap[tmpNode.Hash] = tmpNode;
            this._RecordMap[pHash] = pData;

            // Automatically prune if over length, but only prune this nodes worth.
            if (this.maxLength > 0 && this._List.length > this.maxLength) {
              // Pop it off the head of the list
              tmpNode = this._List.pop();
              // Also remove it from the hashmap
              delete this._RecordMap[tmpNode.Hash];
              delete this._HashMap[tmpNode.Hash];
            }

            // Now some expiration properties on the node metadata... namely the birthdate in ms of the node
            tmpNode.Metadata.Created = +new Date();
            return tmpNode.Datum;
          }

          // Read a datum by hash from the cache
        }, {
          key: "read",
          value: function read(pHash) {
            if (!this._HashMap.hasOwnProperty(pHash)) {
              return false;
            }
            return this._HashMap[pHash].Datum;
          }

          // Reinvigorate a node based on hash, updating the timestamp and moving it to the head of the list (also removes custom metadata)
        }, {
          key: "touch",
          value: function touch(pHash) {
            if (!this._HashMap.hasOwnProperty(pHash)) {
              return false;
            }

            // Get the old node out of the list
            var tmpNode = this._List.remove(this._HashMap[pHash]);
            // Remove it from the hash map
            delete this._RecordMap[pHash];
            delete this._HashMap[pHash];

            // Now put it back, fresh.
            return this.put(tmpNode.Datum, tmpNode.Hash);
          }

          // Expire a cached record based on hash
        }, {
          key: "expire",
          value: function expire(pHash) {
            if (!this._HashMap.hasOwnProperty(pHash)) {
              return false;
            }
            var tmpNode = this._HashMap[pHash];

            // Remove it from the list of cached records
            tmpNode = this._List.remove(tmpNode);
            // Also remove it from the hashmap
            delete this._RecordMap[tmpNode.Hash];
            delete this._HashMap[tmpNode.Hash];

            // Return it in case the consumer wants to do anything with it
            return tmpNode;
          }

          // Prune records from the cached set based on maxAge
        }, {
          key: "pruneBasedOnExpiration",
          value: function pruneBasedOnExpiration(fComplete, pRemovedRecords) {
            var tmpRemovedRecords = typeof pRemovedRecords === 'undefined' ? [] : pRemovedRecords;
            if (this.maxAge < 1) {
              return fComplete(tmpRemovedRecords);
            }

            // Now enumerate each record and remove any that are expired
            var tmpNow = +new Date();
            var tmpKeys = Object.keys(this._HashMap);
            for (var i = 0; i < tmpKeys.length; i++) {
              // Expire the node if it is older than max age milliseconds
              if (tmpNow - this._HashMap[tmpKeys[i]].Metadata.Created >= this.maxAge) {
                tmpRemovedRecords.push(this.expire(tmpKeys[i]));
              }
            }
            fComplete(tmpRemovedRecords);
          }

          // Prune records from the cached set based on maxLength
        }, {
          key: "pruneBasedOnLength",
          value: function pruneBasedOnLength(fComplete, pRemovedRecords) {
            var tmpRemovedRecords = typeof pRemovedRecords === 'undefined' ? [] : pRemovedRecords;

            // Pop records off until we have reached maxLength unless it's 0
            if (this.maxLength > 0) {
              while (this._List.length > this.maxLength) {
                tmpRemovedRecords.push(this._List.pop());
              }
            }
            return fComplete(tmpRemovedRecords);
          }

          // Prune records from the cached set based on passed in pPruneFunction(pDatum, pHash, pNode) -- returning true expires it
        }, {
          key: "pruneCustom",
          value: function pruneCustom(fComplete, fPruneFunction, pRemovedRecords) {
            var tmpRemovedRecords = typeof pRemovedRecords === 'undefined' ? [] : pRemovedRecords;
            var tmpKeys = Object.keys(this._HashMap);
            for (var i = 0; i < tmpKeys.length; i++) {
              var tmpNode = this._HashMap[tmpKeys[i]];
              // Expire the node if the passed in function returns true
              if (fPruneFunction(tmpNode.Datum, tmpNode.Hash, tmpNode)) {
                tmpRemovedRecords.push(this.expire(tmpKeys[i]));
              }
            }
            fComplete(tmpRemovedRecords);
          }

          // Prune the list down to the asserted rules (max age then max length if still too long)
        }, {
          key: "prune",
          value: function prune(fComplete) {
            var _this2 = this;
            var tmpRemovedRecords = [];

            // If there are no cached records, we are done.
            if (this._List.length < 1) {
              return fComplete(tmpRemovedRecords);
            }

            // Now prune based on expiration time
            this.pruneBasedOnExpiration(function (fExpirationPruneComplete) {
              // Now prune based on length, then return the removed records in the callback.
              _this2.pruneBasedOnLength(fComplete, tmpRemovedRecords);
            }, tmpRemovedRecords);
          }

          // Get a low level node (including metadata statistics) by hash from the cache
        }, {
          key: "getNode",
          value: function getNode(pHash) {
            if (!this._HashMap.hasOwnProperty(pHash)) return false;
            return this._HashMap[pHash];
          }
        }]);
        return CashMoney;
      }(libFableServiceProviderBase);
      module.exports = CashMoney;
    }, {
      "./LinkedList.js": 5,
      "fable-serviceproviderbase": 2
    }],
    4: [function (require, module, exports) {
      /**
      * Double Linked List Node
      *
      * @author Steven Velozo <steven@velozo.com>
      * @module CashMoney
      */
      /**
      * Linked List Node Prototype
      *
      * @class LinkedListNode
      * @constructor
      */
      var LinkedListNode = /*#__PURE__*/_createClass(function LinkedListNode() {
        _classCallCheck(this, LinkedListNode);
        this.Hash = false;
        this.Datum = false;

        // This is where expiration and other elements are stored;
        this.Metadata = {};
        this.LeftNode = false;
        this.RightNode = false;

        // To allow safe specialty operations on nodes
        this.__ISNODE = true;
      });
      module.exports = LinkedListNode;
    }, {}],
    5: [function (require, module, exports) {
      "use strict";

      /**
      * Simple double linked list to hold the cache entries in, in order.
      *
      * @author Steven Velozo <steven@velozo.com>
      * @module FeeFiFo
      */
      var libLinkedListNode = require('./LinkedList-Node.js');

      /**
      * Quality Cache Goodness
      *
      * @class CashMoney
      * @constructor
      */
      var LinkedList = /*#__PURE__*/function () {
        function LinkedList() {
          _classCallCheck(this, LinkedList);
          // Total number of nodes ever processed by this ADT
          this.totalNodes = 0;

          // The length of the set of nodes currently in the list
          this.length = 0;
          this.head = false;
          this.tail = false;
        }

        // Create a node object.
        _createClass(LinkedList, [{
          key: "initializeNode",
          value: function initializeNode(pDatum, pHash) {
            // Don't allow undefined to be added to the list because of reasons
            if (typeof pDatum === 'undefined') return false;
            this.totalNodes++;

            // Get (or create) a unique hash
            var tmpHash = typeof pHash != 'undefined' ? pHash : "NODE[".concat(this.totalNodes, "]");
            var tmpNode = new libLinkedListNode();
            tmpNode.Hash = tmpHash;
            tmpNode.Datum = pDatum;
            return tmpNode;
          }

          // Add a node to the end (right of tail) of the list.
        }, {
          key: "append",
          value: function append(pDatum, pHash) {
            // TODO: Should we check if pDatum is actually a node and do the "right" thing?
            var tmpNode = this.initializeNode(pDatum, pHash);
            if (!tmpNode) return false;

            // The list just got longer!
            this.length++;

            // If the list was empty, create a new list from it (it isn't possible to have a tail with no head)
            if (this.length == 1) {
              this.head = tmpNode;
              this.tail = tmpNode;
              return tmpNode;
            }
            this.tail.RightNode = tmpNode;
            tmpNode.LeftNode = this.tail;
            this.tail = tmpNode;
            return tmpNode;
          }

          // Append to tail of list (FIFO)
        }, {
          key: "push",
          value: function push(pDatum, pHash) {
            return this.append(pDatum, pHash);
          }

          // Add a node to the beginning (left of head) of the list.
        }, {
          key: "prepend",
          value: function prepend(pDatum, pHash) {
            // TODO: Should we check if pDatum is actually a node and do the "right" thing?
            var tmpNode = this.initializeNode(pDatum, pHash);
            if (!tmpNode) return false;

            // The list just got longer!
            this.length++;

            // If the list was empty, create a new list from it (it isn't possible to have a tail with no head)
            if (this.length == 1) {
              this.head = tmpNode;
              this.tail = tmpNode;
              return tmpNode;
            }
            this.head.LeftNode = tmpNode;
            tmpNode.RightNode = this.head;
            this.head = tmpNode;
            return tmpNode;
          }

          // Remove a node from the list
        }, {
          key: "remove",
          value: function remove(pNode) {
            if (typeof pNode === 'undefined') return false;
            if (!pNode.__ISNODE) return false;
            this.length--;

            // Last element in list.  Empty it out.
            if (this.length < 1) {
              this.head = false;
              this.tail = false;
              return pNode;
            }

            // It's somewhere in the middle, surgically remove it.
            if (pNode.LeftNode && pNode.RightNode) {
              pNode.LeftNode.RightNode = pNode.RightNode;
              pNode.RightNode.LeftNode = pNode.LeftNode;
              pNode.RightNode = false;
              pNode.LeftNode = false;
              return pNode;
            }

            // It's the tail
            if (pNode.LeftNode) {
              pNode.LeftNode.RightNode = false;
              this.tail = pNode.LeftNode;
              pNode.LeftNode = false;
              return pNode;
            }

            // It must be the head
            pNode.RightNode.LeftNode = false;
            this.head = pNode.RightNode;
            pNode.RightNode = false;
            return pNode;
          }

          // Remove the head of the list (FIFO)
        }, {
          key: "pop",
          value: function pop() {
            return this.remove(this.head);
          }

          // Enumerate over each node IN ORDER, running the function fAction(pDatum, pHash, fCallback) then calling the function fComplete callback when done
        }, {
          key: "each",
          value: function each(fAction, fComplete) {
            var _this3 = this;
            if (this.length < 1) return fComplete();
            var tmpNode = false;
            var fIterator = function fIterator(pError) {
              // If the user passed in a callback with an error, call their callback with the error
              if (pError) return fComplete(pError);

              // If there is no node, this must be the initial run.
              if (!tmpNode) tmpNode = _this3.head;
              // Check if we are at the tail of the list
              else if (!tmpNode.RightNode) return fComplete();
              // Proceed to the next node
              else tmpNode = tmpNode.RightNode;

              // Call the actual action
              // I hate this pattern because long tails eventually cause stack overflows.
              fAction(tmpNode.Datum, tmpNode.Hash, fIterator);
            };

            // Now kick off the iterator
            return fIterator();
          }

          // Seek a specific node, 0 is the index of the first node.
        }, {
          key: "seek",
          value: function seek(pNodeIndex) {
            if (!pNodeIndex) return false;
            if (this.length < 1) return false;
            if (pNodeIndex >= this.length) return false;
            var tmpNode = this.head;
            for (var i = 0; i < pNodeIndex; i++) {
              tmpNode = tmpNode.RightNode;
            }
            return tmpNode;
          }
        }]);
        return LinkedList;
      }();
      module.exports = LinkedList;
    }, {
      "./LinkedList-Node.js": 4
    }]
  }, {}, [3])(3);
});