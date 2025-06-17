"use strict";

function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
    g.Manyfest = f();
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
      * Fable Service Base
      * @author <steven@velozo.com>
      */
      var FableServiceProviderBase = /*#__PURE__*/function () {
        // The constructor can be used in two ways:
        // 1) With a fable, options object and service hash (the options object and service hash are optional)
        // 2) With an object or nothing as the first parameter, where it will be treated as the options object
        function FableServiceProviderBase(pFable, pOptions, pServiceHash) {
          _classCallCheck(this, FableServiceProviderBase);
          // Check if a fable was passed in; connect it if so
          if (_typeof(pFable) === 'object' && pFable.isFable) {
            this.connectFable(pFable);
          } else {
            this.fable = false;
          }

          // initialize options and UUID based on whether the fable was passed in or not.
          if (this.fable) {
            this.UUID = pFable.getUUID();
            this.options = _typeof(pOptions) === 'object' ? pOptions : {};
          } else {
            // With no fable, check to see if there was an object passed into either of the first two
            // Parameters, and if so, treat it as the options object
            this.options = _typeof(pFable) === 'object' && !pFable.isFable ? pFable : _typeof(pOptions) === 'object' ? pOptions : {};
            this.UUID = "CORE-SVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
          }

          // It's expected that the deriving class will set this
          this.serviceType = "Unknown-".concat(this.UUID);

          // The service hash is used to identify the specific instantiation of the service in the services map
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : !this.fable && typeof pOptions === 'string' ? pOptions : "".concat(this.UUID);
        }
        return _createClass(FableServiceProviderBase, [{
          key: "connectFable",
          value: function connectFable(pFable) {
            if (_typeof(pFable) !== 'object' || !pFable.isFable) {
              var tmpErrorMessage = "Fable Service Provider Base: Cannot connect to Fable, invalid Fable object passed in.  The pFable parameter was a [".concat(_typeof(pFable), "].}");
              console.log(tmpErrorMessage);
              return new Error(tmpErrorMessage);
            }
            if (!this.fable) {
              this.fable = pFable;
            }
            if (!this.log) {
              this.log = this.fable.Logging;
            }
            if (!this.services) {
              this.services = this.fable.services;
            }
            if (!this.servicesMap) {
              this.servicesMap = this.fable.servicesMap;
            }
            return true;
          }
        }]);
      }();
      _defineProperty(FableServiceProviderBase, "isFableService", true);
      module.exports = FableServiceProviderBase;

      // This is left here in case we want to go back to having different code/base class for "core" services
      module.exports.CoreServiceProviderBase = FableServiceProviderBase;
    }, {}],
    2: [function (require, module, exports) {
      // When a boxed property is passed in, it should have quotes of some
      // kind around it.
      //
      // For instance:
      // 		MyValues['Name']
      // 		MyValues["Age"]
      // 		MyValues[`Cost`]
      //
      // This function removes the wrapping quotes.
      //
      // Please note it *DOES NOT PARSE* template literals, so backticks just
      // end up doing the same thing as other quote types.
      //
      // TODO: Should template literals be processed?  If so what state do they have access to?  That should happen here if so.
      // TODO: Make a simple class include library with these
      var cleanWrapCharacters = function cleanWrapCharacters(pCharacter, pString) {
        if (pString.startsWith(pCharacter) && pString.endsWith(pCharacter)) {
          return pString.substring(1, pString.length - 1);
        } else {
          return pString;
        }
      };
      module.exports = cleanWrapCharacters;
    }, {}],
    3: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');

      /**
      * Hash Translation
      *
      * This is a very simple translation table for hashes, which allows the same schema to resolve
      * differently based on a loaded translation table.
      *
      * This is to prevent the requirement for mutating schemas over and over again when we want to
      * reuse the structure but look up data elements by different addresses.
      *
      * One side-effect of this is that a translation table can "override" the built-in hashes, since
      * this is always used to resolve hashes before any of the functionCallByHash(pHash, ...) perform
      * their lookups by hash.
      *
      * @class ManyfestHashTranslation
      */
      var ManyfestHashTranslation = /*#__PURE__*/function () {
        function ManyfestHashTranslation(pInfoLog, pErrorLog) {
          _classCallCheck(this, ManyfestHashTranslation);
          // Wire in logging
          this.logInfo = typeof pInfoLog === 'function' ? pInfoLog : libSimpleLog;
          this.logError = typeof pErrorLog === 'function' ? pErrorLog : libSimpleLog;
          this.translationTable = {};
        }
        return _createClass(ManyfestHashTranslation, [{
          key: "translationCount",
          value: function translationCount() {
            return Object.keys(this.translationTable).length;
          }
        }, {
          key: "addTranslation",
          value: function addTranslation(pTranslation) {
            var _this = this;
            // This adds a translation in the form of:
            // { "SourceHash": "DestinationHash", "SecondSourceHash":"SecondDestinationHash" }
            if (_typeof(pTranslation) != 'object') {
              this.logError("Hash translation addTranslation expected a translation be type object but was passed in ".concat(_typeof(pTranslation)));
              return false;
            }
            var tmpTranslationSources = Object.keys(pTranslation);
            tmpTranslationSources.forEach(function (pTranslationSource) {
              if (typeof pTranslation[pTranslationSource] != 'string') {
                _this.logError("Hash translation addTranslation expected a translation destination hash for [".concat(pTranslationSource, "] to be a string but the referrant was a ").concat(_typeof(pTranslation[pTranslationSource])));
              } else {
                _this.translationTable[pTranslationSource] = pTranslation[pTranslationSource];
              }
            });
          }
        }, {
          key: "removeTranslationHash",
          value: function removeTranslationHash(pTranslationHash) {
            if (pTranslationHash in this.translationTable) {
              delete this.translationTable[pTranslationHash];
            }
          }

          // This removes translations.
          // If passed a string, just removes the single one.
          // If passed an object, it does all the source keys.
        }, {
          key: "removeTranslation",
          value: function removeTranslation(pTranslation) {
            var _this2 = this;
            if (typeof pTranslation == 'string') {
              this.removeTranslationHash(pTranslation);
              return true;
            } else if (_typeof(pTranslation) == 'object') {
              var tmpTranslationSources = Object.keys(pTranslation);
              tmpTranslationSources.forEach(function (pTranslationSource) {
                _this2.removeTranslation(pTranslationSource);
              });
              return true;
            } else {
              this.logError("Hash translation removeTranslation expected either a string or an object but the passed-in translation was type ".concat(_typeof(pTranslation)));
              return false;
            }
          }
        }, {
          key: "clearTranslations",
          value: function clearTranslations() {
            this.translationTable = {};
          }
        }, {
          key: "translate",
          value: function translate(pTranslation) {
            if (pTranslation in this.translationTable) {
              return this.translationTable[pTranslation];
            } else {
              return pTranslation;
            }
          }
        }]);
      }();
      module.exports = ManyfestHashTranslation;
    }, {
      "./Manyfest-LogToConsole.js": 4
    }],
    4: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */

      /**
      * Manyfest simple logging shim (for browser and dependency-free running)
      */

      var logToConsole = function logToConsole(pLogLine, pLogObject) {
        var tmpLogLine = typeof pLogLine === 'string' ? pLogLine : '';
        console.log("[Manyfest] ".concat(tmpLogLine));
        if (pLogObject) console.log(JSON.stringify(pLogObject));
      };
      module.exports = logToConsole;
    }, {}],
    5: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');
      // This is for resolving functions mid-address
      var libGetObjectValue = require('./Manyfest-ObjectAddress-GetValue.js');

      // TODO: Just until this is a fable service.
      var _MockFable = {
        DataFormat: require('./Manyfest-ObjectAddress-Parser.js')
      };

      /**
      * Object Address Resolver
      *
      * IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
      *                 be extremely clear what is going on in the recursion for
      *                 each of the three address resolution functions.
      *
      *                 Although there is some opportunity to repeat ourselves a
      *                 bit less in this codebase (e.g. with detection of arrays
      *                 versus objects versus direct properties), it can make
      *                 debugging.. challenging.  The minified version of the code
      *                 optimizes out almost anything repeated in here.  So please
      *                 be kind and rewind... meaning please keep the codebase less
      *                 terse and more verbose so humans can comprehend it.
      *
      *
      * @class ManyfestObjectAddressResolverCheckAddressExists
      */
      var ManyfestObjectAddressResolverCheckAddressExists = /*#__PURE__*/function () {
        function ManyfestObjectAddressResolverCheckAddressExists() {
          _classCallCheck(this, ManyfestObjectAddressResolverCheckAddressExists);
          this.getObjectValueClass = new libGetObjectValue(libSimpleLog, libSimpleLog);
        }

        // Check if an address exists.
        //
        // This is necessary because the getValueAtAddress function is ambiguous on
        // whether the element/property is actually there or not (it returns
        // undefined whether the property exists or not).  This function checks for
        // existance and returns true or false dependent.
        return _createClass(ManyfestObjectAddressResolverCheckAddressExists, [{
          key: "checkAddressExists",
          value: function checkAddressExists(pObject, pAddress, pRootObject) {
            // TODO: Should these throw an error?
            // Make sure pObject is an object
            if (_typeof(pObject) != 'object') return false;
            // Make sure pAddress is a string
            if (typeof pAddress != 'string') return false;

            // Set the root object to the passed-in object if it isn't set yet.  This is expected to be the root object.
            // NOTE: This was added to support functions mid-stream
            var tmpRootObject = typeof pRootObject == 'undefined' ? pObject : pRootObject;

            // DONE: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
            var tmpAddressPartBeginning = _MockFable.DataFormat.stringGetFirstSegment(pAddress);

            // This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
            if (tmpAddressPartBeginning.length == pAddress.length) {
              // Check if the address refers to a boxed property
              var tmpBracketStartIndex = pAddress.indexOf('[');
              var tmpBracketStopIndex = pAddress.indexOf(']');

              // Check if there is a function somewhere in the address... parenthesis start should only be in a function
              var tmpFunctionStartIndex = pAddress.indexOf('(');

              // NOTE THAT FUNCTIONS MUST RESOLVE FIRST
              // Functions look like this
              // 		MyFunction()
              // 		MyFunction(Some.Address)
              // 		MyFunction(Some.Address,Some.Other.Address)
              // 		MyFunction(Some.Address,Some.Other.Address,Some.Third.Address)
              //
              // This could be enhanced to allow purely numeric and string values to be passed to the function.  For now,
              // To heck with that.  This is a simple function call.
              //
              // The requirements to detect a function are:
              //    1) The start bracket is after character 0
              if (tmpFunctionStartIndex > 0
              //    2) The end bracket is after the start bracket
              && _MockFable.DataFormat.stringCountEnclosures(pAddress) > 0) {
                var tmpFunctionAddress = pAddress.substring(0, tmpFunctionStartIndex).trim();
                if (tmpFunctionAddress in pObject && typeof pObject[tmpFunctionAddress] == 'function') {
                  return true;
                } else {
                  // The address suggests it is a function, but it is not.
                  return false;
                }
              }
              // Boxed elements look like this:
              // 		MyValues[10]
              // 		MyValues['Name']
              // 		MyValues["Age"]
              // 		MyValues[`Cost`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              else if (tmpBracketStartIndex > 0
              //    2) The end bracket has something between them
              && tmpBracketStopIndex > tmpBracketStartIndex
              //    3) There is data
              && tmpBracketStopIndex - tmpBracketStartIndex > 1) {
                // The "Name" of the Object contained too the left of the bracket
                var tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

                // If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
                // This is a rare case where Arrays testing as Objects is useful
                if (_typeof(pObject[tmpBoxedPropertyName]) !== 'object') {
                  return false;
                }

                // The "Reference" to the property within it, either an array element or object property
                var tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex + 1, tmpBracketStopIndex).trim();
                // Attempt to parse the reference as a number, which will be used as an array element
                var tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber)) {
                  return false;
                }

                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to treat it as a dynamic object property.
                if (isNaN(tmpBoxedPropertyNumber)) {
                  // This isn't a number ... let's treat it as a dynamic object property.
                  // We would expect the property to be wrapped in some kind of quotes so strip them
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

                  // Check if the property exists.
                  return tmpBoxedPropertyReference in pObject[tmpBoxedPropertyName];
                } else {
                  // Use the new in operator to see if the element is in the array
                  return tmpBoxedPropertyNumber in pObject[tmpBoxedPropertyName];
                }
              } else {
                // Check if the property exists
                return pAddress in pObject;
              }
            } else {
              var tmpSubObjectName = tmpAddressPartBeginning;
              var tmpNewAddress = pAddress.substring(tmpAddressPartBeginning.length + 1);

              // Test if the tmpNewAddress is an array or object
              // Check if it's a boxed property
              var _tmpBracketStartIndex = tmpSubObjectName.indexOf('[');
              var _tmpBracketStopIndex = tmpSubObjectName.indexOf(']');

              // Check if there is a function somewhere in the address... parenthesis start should only be in a function
              var _tmpFunctionStartIndex = tmpSubObjectName.indexOf('(');

              // NOTE THAT FUNCTIONS MUST RESOLVE FIRST
              // Functions look like this
              // 		MyFunction()
              // 		MyFunction(Some.Address)
              // 		MyFunction(Some.Address,Some.Other.Address)
              // 		MyFunction(Some.Address,Some.Other.Address,Some.Third.Address)
              //
              // This could be enhanced to allow purely numeric and string values to be passed to the function.  For now,
              // To heck with that.  This is a simple function call.
              //
              // The requirements to detect a function are:
              //    1) The start bracket is after character 0
              if (_tmpFunctionStartIndex > 0
              //    2) The end bracket is after the start bracket
              && _MockFable.DataFormat.stringCountEnclosures(tmpSubObjectName) > 0) {
                var _tmpFunctionAddress = tmpSubObjectName.substring(0, _tmpFunctionStartIndex).trim();
                //tmpParentAddress = `${tmpParentAddress}${(tmpParentAddress.length > 0) ? '.' : ''}${tmpSubObjectName}`;

                if (!_typeof(pObject[_tmpFunctionAddress]) == 'function') {
                  // The address suggests it is a function, but it is not.
                  return false;
                }

                // Now see if the function has arguments.
                // Implementation notes: * ARGUMENTS MUST SHARE THE SAME ROOT OBJECT CONTEXT *
                var tmpFunctionArguments = _MockFable.DataFormat.stringGetSegments(_MockFable.DataFormat.stringGetEnclosureValueByIndex(tmpSubObjectName.substring(_tmpFunctionAddress.length), 0), ',');
                if (tmpFunctionArguments.length == 0 || tmpFunctionArguments[0] == '') {
                  // No arguments... just call the function (bound to the scope of the object it is contained withing)
                  if (_tmpFunctionAddress in pObject) {
                    try {
                      return this.checkAddressExists(pObject[_tmpFunctionAddress].apply(pObject), tmpNewAddress, tmpRootObject);
                    } catch (pError) {
                      // The function call failed, so the address doesn't exist
                      libSimpleLog.log("Error calling function ".concat(_tmpFunctionAddress, " (address [").concat(pAddress, "]): ").concat(pError.message));
                      return false;
                    }
                  } else {
                    // The function doesn't exist, so the address doesn't exist
                    libSimpleLog.log("Function ".concat(_tmpFunctionAddress, " does not exist (address [").concat(pAddress, "])"));
                    return false;
                  }
                } else {
                  var tmpArgumentValues = [];
                  var _tmpRootObject = typeof pRootObject == 'undefined' ? pObject : pRootObject;

                  // Now get the value for each argument
                  for (var i = 0; i < tmpFunctionArguments.length; i++) {
                    // Resolve the values for each subsequent entry
                    // NOTE: This is where the resolves get really tricky.  Recursion within recursion.  Programming gom jabbar, yo.
                    tmpArgumentValues.push(this.getObjectValueClass.getValueAtAddress(_tmpRootObject, tmpFunctionArguments[i]));
                  }

                  //return this.checkAddressExists(pObject[tmpFunctionAddress].apply(pObject, tmpArgumentValues), tmpNewAddress, tmpRootObject);
                  if (_tmpFunctionAddress in pObject) {
                    try {
                      return this.checkAddressExists(pObject[_tmpFunctionAddress].apply(pObject, tmpArgumentValues), tmpNewAddress, _tmpRootObject);
                    } catch (pError) {
                      // The function call failed, so the address doesn't exist
                      libSimpleLog.log("Error calling function ".concat(_tmpFunctionAddress, " (address [").concat(pAddress, "]): ").concat(pError.message));
                      return false;
                    }
                  } else {
                    // The function doesn't exist, so the address doesn't exist
                    libSimpleLog.log("Function ".concat(_tmpFunctionAddress, " does not exist (address [").concat(pAddress, "])"));
                    return false;
                  }
                }
              }
              // Boxed elements look like this:
              // 		MyValues[42]
              // 		MyValues['Color']
              // 		MyValues["Weight"]
              // 		MyValues[`Diameter`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              else if (_tmpBracketStartIndex > 0
              //    2) The end bracket has something between them
              && _tmpBracketStopIndex > _tmpBracketStartIndex
              //    3) There is data
              && _tmpBracketStopIndex - _tmpBracketStartIndex > 1) {
                var _tmpBoxedPropertyName = tmpSubObjectName.substring(0, _tmpBracketStartIndex).trim();
                var _tmpBoxedPropertyReference = tmpSubObjectName.substring(_tmpBracketStartIndex + 1, _tmpBracketStopIndex).trim();
                var _tmpBoxedPropertyNumber = parseInt(_tmpBoxedPropertyReference, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students[1].Tardy
                //       BUT
                //         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
                //       BUT
                //         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
                // TODO: Should this be an error or something?  Should we keep a log of failures like this?
                if (Array.isArray(pObject[_tmpBoxedPropertyName]) == isNaN(_tmpBoxedPropertyNumber)) {
                  // Because this is an impossible address, the property doesn't exist
                  // TODO: Should we throw an error in this condition?
                  return false;
                }

                //This is a bracketed value
                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to reat it as a dynamic object property.
                if (isNaN(_tmpBoxedPropertyNumber)) {
                  // This isn't a number ... let's treat it as a dynanmic object property.
                  _tmpBoxedPropertyReference = this.cleanWrapCharacters('"', _tmpBoxedPropertyReference);
                  _tmpBoxedPropertyReference = this.cleanWrapCharacters('`', _tmpBoxedPropertyReference);
                  _tmpBoxedPropertyReference = this.cleanWrapCharacters("'", _tmpBoxedPropertyReference);

                  // Recurse directly into the subobject
                  return this.checkAddressExists(pObject[_tmpBoxedPropertyName][_tmpBoxedPropertyReference], tmpNewAddress, tmpRootObject);
                } else {
                  // We parsed a valid number out of the boxed property name, so recurse into the array
                  return this.checkAddressExists(pObject[_tmpBoxedPropertyName][_tmpBoxedPropertyNumber], tmpNewAddress, tmpRootObject);
                }
              }

              // If there is an object property already named for the sub object, but it isn't an object
              // then the system can't set the value in there.  Error and abort!
              if (tmpSubObjectName in pObject && _typeof(pObject[tmpSubObjectName]) !== 'object') {
                return false;
              } else if (tmpSubObjectName in pObject) {
                // If there is already a subobject pass that to the recursive thingy
                return this.checkAddressExists(pObject[tmpSubObjectName], tmpNewAddress, tmpRootObject);
              } else {
                // Create a subobject and then pass that
                pObject[tmpSubObjectName] = {};
                return this.checkAddressExists(pObject[tmpSubObjectName], tmpNewAddress, tmpRootObject);
              }
            }
          }
        }]);
      }();
      ;
      module.exports = ManyfestObjectAddressResolverCheckAddressExists;
    }, {
      "./Manyfest-LogToConsole.js": 4,
      "./Manyfest-ObjectAddress-GetValue.js": 7,
      "./Manyfest-ObjectAddress-Parser.js": 8
    }],
    6: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');
      var fCleanWrapCharacters = require('./Manyfest-CleanWrapCharacters.js');
      var fParseConditionals = require("../source/Manyfest-ParseConditionals.js");

      /**
      * Object Address Resolver - DeleteValue
      *
      * IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
      *                 be extremely clear what is going on in the recursion for
      *                 each of the three address resolution functions.
      *
      *                 Although there is some opportunity to repeat ourselves a
      *                 bit less in this codebase (e.g. with detection of arrays
      *                 versus objects versus direct properties), it can make
      *                 debugging.. challenging.  The minified version of the code
      *                 optimizes out almost anything repeated in here.  So please
      *                 be kind and rewind... meaning please keep the codebase less
      *                 terse and more verbose so humans can comprehend it.
      *
      * TODO: Once we validate this pattern is good to go, break these out into
      *       three separate modules.
      *
      * @class ManyfestObjectAddressResolverDeleteValue
      */
      var ManyfestObjectAddressResolverDeleteValue = /*#__PURE__*/function () {
        function ManyfestObjectAddressResolverDeleteValue(pInfoLog, pErrorLog) {
          _classCallCheck(this, ManyfestObjectAddressResolverDeleteValue);
          // Wire in logging
          this.logInfo = typeof pInfoLog == 'function' ? pInfoLog : libSimpleLog;
          this.logError = typeof pErrorLog == 'function' ? pErrorLog : libSimpleLog;
          this.cleanWrapCharacters = fCleanWrapCharacters;
        }

        // TODO: Dry me
        return _createClass(ManyfestObjectAddressResolverDeleteValue, [{
          key: "checkRecordFilters",
          value: function checkRecordFilters(pAddress, pRecord) {
            return fParseConditionals(this, pAddress, pRecord);
          }

          // Delete the value of an element at an address
        }, {
          key: "deleteValueAtAddress",
          value: function deleteValueAtAddress(pObject, pAddress, pParentAddress) {
            // Make sure pObject (the object we are meant to be recursing) is an object (which could be an array or object)
            if (_typeof(pObject) != 'object') return undefined;
            // Make sure pAddress (the address we are resolving) is a string
            if (typeof pAddress != 'string') return undefined;
            // Stash the parent address for later resolution
            var tmpParentAddress = "";
            if (typeof pParentAddress == 'string') {
              tmpParentAddress = pParentAddress;
            }

            // TODO: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
            var tmpSeparatorIndex = pAddress.indexOf('.');

            // This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
            if (tmpSeparatorIndex == -1) {
              // Check if the address refers to a boxed property
              var tmpBracketStartIndex = pAddress.indexOf('[');
              var tmpBracketStopIndex = pAddress.indexOf(']');

              // Check for the Object Set Type marker.
              // Note this will not work with a bracket in the same address box set
              var tmpObjectTypeMarkerIndex = pAddress.indexOf('{}');

              // Boxed elements look like this:
              // 		MyValues[10]
              // 		MyValues['Name']
              // 		MyValues["Age"]
              // 		MyValues[`Cost`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              if (tmpBracketStartIndex > 0
              //    2) The end bracket has something between them
              && tmpBracketStopIndex > tmpBracketStartIndex
              //    3) There is data
              && tmpBracketStopIndex - tmpBracketStartIndex > 1) {
                // The "Name" of the Object contained too the left of the bracket
                var tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

                // If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
                // This is a rare case where Arrays testing as Objects is useful
                if (_typeof(pObject[tmpBoxedPropertyName]) !== 'object') {
                  return false;
                }

                // The "Reference" to the property within it, either an array element or object property
                var tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex + 1, tmpBracketStopIndex).trim();
                // Attempt to parse the reference as a number, which will be used as an array element
                var tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber)) {
                  return false;
                }

                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to treat it as a dynamic object property.
                if (isNaN(tmpBoxedPropertyNumber)) {
                  // This isn't a number ... let's treat it as a dynamic object property.
                  // We would expect the property to be wrapped in some kind of quotes so strip them
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

                  // Return the value in the property
                  delete pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference];
                  return true;
                } else {
                  delete pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber];
                  return true;
                }
              }
              // The requirements to detect a boxed set element are:
              //    1) The start bracket is after character 0
              else if (tmpBracketStartIndex > 0
              //    2) The end bracket is after the start bracket
              && tmpBracketStopIndex > tmpBracketStartIndex
              //    3) There is nothing in the brackets
              && tmpBracketStopIndex - tmpBracketStartIndex == 1) {
                var _tmpBoxedPropertyName2 = pAddress.substring(0, tmpBracketStartIndex).trim();
                if (!Array.isArray(pObject[_tmpBoxedPropertyName2])) {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }
                var tmpInputArray = pObject[_tmpBoxedPropertyName2];
                // Count from the end to the beginning so splice doesn't %&%#$ up the array
                for (var i = tmpInputArray.length - 1; i >= 0; i--) {
                  // The filtering is complex but allows config-based metaprogramming directly from schema
                  var tmpKeepRecord = this.checkRecordFilters(pAddress, tmpInputArray[i]);
                  if (tmpKeepRecord) {
                    // Delete elements end to beginning
                    tmpInputArray.splice(i, 1);
                  }
                }
                return true;
              }
              // The object has been flagged as an object set, so treat it as such
              else if (tmpObjectTypeMarkerIndex > 0) {
                var tmpObjectPropertyName = pAddress.substring(0, tmpObjectTypeMarkerIndex).trim();
                if (_typeof(pObject[tmpObjectPropertyName]) != 'object') {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }
                delete pObject[tmpObjectPropertyName];
                return true;
              } else {
                // Now is the point in recursion to return the value in the address
                delete pObject[pAddress];
                return true;
              }
            } else {
              var tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
              var tmpNewAddress = pAddress.substring(tmpSeparatorIndex + 1);

              // BOXED ELEMENTS
              // Test if the tmpNewAddress is an array or object
              // Check if it's a boxed property
              var _tmpBracketStartIndex2 = tmpSubObjectName.indexOf('[');
              var _tmpBracketStopIndex2 = tmpSubObjectName.indexOf(']');
              // Boxed elements look like this:
              // 		MyValues[42]
              // 		MyValues['Color']
              // 		MyValues["Weight"]
              // 		MyValues[`Diameter`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              if (_tmpBracketStartIndex2 > 0
              //    2) The end bracket has something between them
              && _tmpBracketStopIndex2 > _tmpBracketStartIndex2
              //    3) There is data
              && _tmpBracketStopIndex2 - _tmpBracketStartIndex2 > 1) {
                var _tmpBoxedPropertyName3 = tmpSubObjectName.substring(0, _tmpBracketStartIndex2).trim();
                var _tmpBoxedPropertyReference2 = tmpSubObjectName.substring(_tmpBracketStartIndex2 + 1, _tmpBracketStopIndex2).trim();
                var _tmpBoxedPropertyNumber2 = parseInt(_tmpBoxedPropertyReference2, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students[1].Tardy
                //       BUT
                //         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
                //       BUT
                //         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
                // TODO: Should this be an error or something?  Should we keep a log of failures like this?
                if (Array.isArray(pObject[_tmpBoxedPropertyName3]) == isNaN(_tmpBoxedPropertyNumber2)) {
                  return false;
                }
                // Check if the boxed property is an object.
                if (_typeof(pObject[_tmpBoxedPropertyName3]) != 'object') {
                  return false;
                }
                //This is a bracketed value
                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to reat it as a dynamic object property.
                if (isNaN(_tmpBoxedPropertyNumber2)) {
                  // This isn't a number ... let's treat it as a dynanmic object property.
                  _tmpBoxedPropertyReference2 = this.cleanWrapCharacters('"', _tmpBoxedPropertyReference2);
                  _tmpBoxedPropertyReference2 = this.cleanWrapCharacters('`', _tmpBoxedPropertyReference2);
                  _tmpBoxedPropertyReference2 = this.cleanWrapCharacters("'", _tmpBoxedPropertyReference2);

                  // Continue to manage the parent address for recursion
                  tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                  // Recurse directly into the subobject
                  return this.deleteValueAtAddress(pObject[_tmpBoxedPropertyName3][_tmpBoxedPropertyReference2], tmpNewAddress, tmpParentAddress);
                } else {
                  // Continue to manage the parent address for recursion
                  tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                  // We parsed a valid number out of the boxed property name, so recurse into the array
                  return this.deleteValueAtAddress(pObject[_tmpBoxedPropertyName3][_tmpBoxedPropertyNumber2], tmpNewAddress, tmpParentAddress);
                }
              }
              // The requirements to detect a boxed set element are:
              //    1) The start bracket is after character 0
              else if (_tmpBracketStartIndex2 > 0
              //    2) The end bracket is after the start bracket
              && _tmpBracketStopIndex2 > _tmpBracketStartIndex2
              //    3) There is nothing in the brackets
              && _tmpBracketStopIndex2 - _tmpBracketStartIndex2 == 1) {
                var _tmpBoxedPropertyName4 = pAddress.substring(0, _tmpBracketStartIndex2).trim();
                if (!Array.isArray(pObject[_tmpBoxedPropertyName4])) {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }

                // We need to enumerate the array and grab the addresses from there.
                var tmpArrayProperty = pObject[_tmpBoxedPropertyName4];
                // Managing the parent address is a bit more complex here -- the box will be added for each element.
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(_tmpBoxedPropertyName4);
                // The container object is where we have the "Address":SOMEVALUE pairs
                var tmpContainerObject = {};
                for (var _i = 0; _i < tmpArrayProperty.length; _i++) {
                  var tmpPropertyParentAddress = "".concat(tmpParentAddress, "[").concat(_i, "]");
                  var tmpValue = this.deleteValueAtAddress(pObject[_tmpBoxedPropertyName4][_i], tmpNewAddress, tmpPropertyParentAddress);
                  tmpContainerObject["".concat(tmpPropertyParentAddress, ".").concat(tmpNewAddress)] = tmpValue;
                }
                return tmpContainerObject;
              }

              // OBJECT SET
              // Note this will not work with a bracket in the same address box set
              var _tmpObjectTypeMarkerIndex = pAddress.indexOf('{}');
              if (_tmpObjectTypeMarkerIndex > 0) {
                var _tmpObjectPropertyName = pAddress.substring(0, _tmpObjectTypeMarkerIndex).trim();
                if (_typeof(pObject[_tmpObjectPropertyName]) != 'object') {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }

                // We need to enumerate the Object and grab the addresses from there.
                var tmpObjectProperty = pObject[_tmpObjectPropertyName];
                var tmpObjectPropertyKeys = Object.keys(tmpObjectProperty);
                // Managing the parent address is a bit more complex here -- the box will be added for each element.
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(_tmpObjectPropertyName);
                // The container object is where we have the "Address":SOMEVALUE pairs
                var _tmpContainerObject = {};
                for (var _i2 = 0; _i2 < tmpObjectPropertyKeys.length; _i2++) {
                  var _tmpPropertyParentAddress = "".concat(tmpParentAddress, ".").concat(tmpObjectPropertyKeys[_i2]);
                  var _tmpValue = this.deleteValueAtAddress(pObject[_tmpObjectPropertyName][tmpObjectPropertyKeys[_i2]], tmpNewAddress, _tmpPropertyParentAddress);

                  // The filtering is complex but allows config-based metaprogramming directly from schema
                  var _tmpKeepRecord = this.checkRecordFilters(pAddress, _tmpValue);
                  if (_tmpKeepRecord) {
                    _tmpContainerObject["".concat(_tmpPropertyParentAddress, ".").concat(tmpNewAddress)] = _tmpValue;
                  }
                }
                return _tmpContainerObject;
              }

              // If there is an object property already named for the sub object, but it isn't an object
              // then the system can't set the value in there.  Error and abort!
              if (tmpSubObjectName in pObject && _typeof(pObject[tmpSubObjectName]) !== 'object') {
                return undefined;
              } else if (tmpSubObjectName in pObject) {
                // If there is already a subobject pass that to the recursive thingy
                // Continue to manage the parent address for recursion
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                return this.deleteValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress);
              } else {
                // Create a subobject and then pass that
                // Continue to manage the parent address for recursion
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                pObject[tmpSubObjectName] = {};
                return this.deleteValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress);
              }
            }
          }
        }]);
      }();
      ;
      module.exports = ManyfestObjectAddressResolverDeleteValue;
    }, {
      "../source/Manyfest-ParseConditionals.js": 11,
      "./Manyfest-CleanWrapCharacters.js": 2,
      "./Manyfest-LogToConsole.js": 4
    }],
    7: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');
      var fCleanWrapCharacters = require('./Manyfest-CleanWrapCharacters.js');
      var fParseConditionals = require("../source/Manyfest-ParseConditionals.js");
      var _MockFable = {
        DataFormat: require('./Manyfest-ObjectAddress-Parser.js')
      };

      /**
      * Object Address Resolver - GetValue
      *
      * IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
      *                 be extremely clear what is going on in the recursion for
      *                 each of the three address resolution functions.
      *
      *                 Although there is some opportunity to repeat ourselves a
      *                 bit less in this codebase (e.g. with detection of arrays
      *                 versus objects versus direct properties), it can make
      *                 debugging.. challenging.  The minified version of the code
      *                 optimizes out almost anything repeated in here.  So please
      *                 be kind and rewind... meaning please keep the codebase less
      *                 terse and more verbose so humans can comprehend it.
      *
      * TODO: Once we validate this pattern is good to go, break these out into
      *       three separate modules.
      *
      * @class ManyfestObjectAddressResolverGetValue
      */
      var ManyfestObjectAddressResolverGetValue = /*#__PURE__*/function () {
        function ManyfestObjectAddressResolverGetValue(pInfoLog, pErrorLog) {
          _classCallCheck(this, ManyfestObjectAddressResolverGetValue);
          // Wire in logging
          this.logInfo = typeof pInfoLog == 'function' ? pInfoLog : libSimpleLog;
          this.logError = typeof pErrorLog == 'function' ? pErrorLog : libSimpleLog;
          this.cleanWrapCharacters = fCleanWrapCharacters;
        }
        return _createClass(ManyfestObjectAddressResolverGetValue, [{
          key: "checkRecordFilters",
          value: function checkRecordFilters(pAddress, pRecord) {
            return fParseConditionals(this, pAddress, pRecord);
          }

          // Get the value of an element at an address
        }, {
          key: "getValueAtAddress",
          value: function getValueAtAddress(pObject, pAddress, pParentAddress, pRootObject) {
            // Make sure pObject (the object we are meant to be recursing) is an object (which could be an array or object)
            if (_typeof(pObject) != 'object') return undefined;
            // Make sure pAddress (the address we are resolving) is a string
            if (typeof pAddress != 'string') return undefined;
            // Stash the parent address for later resolution
            var tmpParentAddress = "";
            if (typeof pParentAddress == 'string') {
              tmpParentAddress = pParentAddress;
            }

            // Set the root object to the passed-in object if it isn't set yet.  This is expected to be the root object.
            var tmpRootObject = typeof pRootObject == 'undefined' ? pObject : pRootObject;

            // DONE: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
            var tmpAddressPartBeginning = _MockFable.DataFormat.stringGetFirstSegment(pAddress);

            // Adding simple back-navigation in objects
            if (tmpAddressPartBeginning == '') {
              // Given an address of "Bundle.Contract.IDContract...Project.IDProject" the ... would be interpreted as two back-navigations from IDContract.
              // When the address is passed in, though, the first . is already eliminated.  So we can count the dots.
              var tmpParentAddressParts = _MockFable.DataFormat.stringGetSegments(tmpParentAddress);
              var tmpBackNavigationCount = 0;

              // Count the number of dots
              for (var i = 0; i < pAddress.length; i++) {
                if (pAddress.charAt(i) != '.') {
                  break;
                }
                tmpBackNavigationCount++;
              }
              var tmpParentAddressLength = tmpParentAddressParts.length - tmpBackNavigationCount;
              if (tmpParentAddressLength < 0) {
                // We are trying to back navigate more than we can.
                // TODO: Should this be undefined or should we bank out at the bottom and try to go forward?
                // This seems safest for now.
                return undefined;
              } else {
                // We are trying to back navigate to a parent object.
                // Recurse with the back-propagated parent address, and, the new address without the back-navigation dots.
                var tmpRecurseAddress = pAddress.slice(tmpBackNavigationCount);
                if (tmpParentAddressLength > 0) {
                  tmpRecurseAddress = "".concat(tmpParentAddressParts.slice(0, tmpParentAddressLength).join('.'), ".").concat(tmpRecurseAddress);
                }
                this.logInfo("Back-navigation detected.  Recursing back to address [".concat(tmpRecurseAddress, "]"));
                return this.getValueAtAddress(tmpRootObject, tmpRecurseAddress);
              }
            }

            // This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
            if (tmpAddressPartBeginning.length == pAddress.length) {
              // TODO: Optimize this by having these calls only happen when the previous fails.
              // TODO: Alternatively look for all markers in one pass?
              // Check if the address refers to a boxed property
              var tmpBracketStartIndex = pAddress.indexOf('[');
              var tmpBracketStopIndex = pAddress.indexOf(']');

              // Check for the Object Set Type marker.
              // Note this will not work with a bracket in the same address box set
              var tmpObjectTypeMarkerIndex = pAddress.indexOf('{}');

              // Check if there is a function somewhere in the address... parenthesis start should only be in a function
              var tmpFunctionStartIndex = pAddress.indexOf('(');

              // NOTE THAT FUNCTIONS MUST RESOLVE FIRST
              // Functions look like this
              // 		MyFunction()
              // 		MyFunction(Some.Address)
              // 		MyFunction(Some.Address,Some.Other.Address)
              // 		MyFunction(Some.Address,Some.Other.Address,Some.Third.Address)
              //
              // This could be enhanced to allow purely numeric and string values to be passed to the function.  For now,
              // To heck with that.  This is a simple function call.
              //
              // The requirements to detect a function are:
              //    1) The start bracket is after character 0
              if (tmpFunctionStartIndex > 0
              //    2) The end bracket is after the start bracket
              && _MockFable.DataFormat.stringCountEnclosures(pAddress) > 0) {
                var tmpFunctionAddress = pAddress.substring(0, tmpFunctionStartIndex).trim();
                if (!_typeof(pObject[tmpFunctionAddress]) == 'function') {
                  // The address suggests it is a function, but it is not.
                  return false;
                }

                // Now see if the function has arguments.
                // Implementation notes: * ARGUMENTS MUST SHARE THE SAME ROOT OBJECT CONTEXT *
                var tmpFunctionArguments = _MockFable.DataFormat.stringGetSegments(_MockFable.DataFormat.stringGetEnclosureValueByIndex(pAddress.substring(tmpFunctionAddress.length), 0), ',');
                if (tmpFunctionArguments.length == 0 || tmpFunctionArguments[0] == '') {
                  // No arguments... just call the function (bound to the scope of the object it is contained withing)
                  if (tmpFunctionAddress in pObject) {
                    try {
                      return pObject[tmpFunctionAddress].apply(pObject);
                    } catch (pError) {
                      // The function call failed, so the address doesn't exist
                      console.log("Error in getValueAtAddress calling function ".concat(tmpFunctionAddress, " (address [").concat(pAddress, "]): ").concat(pError.message));
                      return false;
                    }
                  } else {
                    // The function doesn't exist, so the address doesn't exist
                    console.log("Function ".concat(tmpFunctionAddress, " does not exist (address [").concat(pAddress, "])"));
                    return false;
                  }
                } else {
                  var tmpArgumentValues = [];
                  var _tmpRootObject2 = typeof pRootObject == 'undefined' ? pObject : pRootObject;

                  // Now get the value for each argument
                  for (var _i3 = 0; _i3 < tmpFunctionArguments.length; _i3++) {
                    // Resolve the values for each subsequent entry
                    // Check if the argument value is a string literal or a reference to an address
                    if (tmpFunctionArguments[_i3].length >= 2 && (tmpFunctionArguments[_i3].charAt(0) == '"' || tmpFunctionArguments[_i3].charAt(0) == "'" || tmpFunctionArguments[_i3].charAt(0) == "`") && (tmpFunctionArguments[_i3].charAt(tmpFunctionArguments[_i3].length - 1) == '"' || tmpFunctionArguments[_i3].charAt(tmpFunctionArguments[_i3].length - 1) == "'" || tmpFunctionArguments[_i3].charAt(tmpFunctionArguments[_i3].length - 1) == "`")) {
                      // This is a string literal
                      tmpArgumentValues.push(tmpFunctionArguments[_i3].substring(1, tmpFunctionArguments[_i3].length - 1));
                    } else {
                      // This is a hash address
                      tmpArgumentValues.push(this.getValueAtAddress(_tmpRootObject2, tmpFunctionArguments[_i3]));
                    }
                  }
                  if (tmpFunctionAddress in pObject) {
                    try {
                      return pObject[tmpFunctionAddress].apply(pObject, tmpArgumentValues);
                    } catch (pError) {
                      // The function call failed, so the address doesn't exist
                      console.log("Error in getValueAtAddress calling function ".concat(tmpFunctionAddress, " (address [").concat(pAddress, "]): ").concat(pError.message));
                      return false;
                    }
                  } else {
                    // The function doesn't exist, so the address doesn't exist
                    console.log("Function ".concat(tmpFunctionAddress, " does not exist (address [").concat(pAddress, "])"));
                    return false;
                  }
                }
              }
              // Boxed elements look like this:
              // 		MyValues[10]
              // 		MyValues['Name']
              // 		MyValues["Age"]
              // 		MyValues[`Cost`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              else if (tmpBracketStartIndex > 0
              //    2) The end bracket has something between them
              && tmpBracketStopIndex > tmpBracketStartIndex
              //    3) There is data
              && tmpBracketStopIndex - tmpBracketStartIndex > 1) {
                // The "Name" of the Object contained too the left of the bracket
                var tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

                // If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
                // This is a rare case where Arrays testing as Objects is useful
                if (_typeof(pObject[tmpBoxedPropertyName]) !== 'object') {
                  return undefined;
                }

                // The "Reference" to the property within it, either an array element or object property
                var tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex + 1, tmpBracketStopIndex).trim();
                // Attempt to parse the reference as a number, which will be used as an array element
                var tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber)) {
                  return undefined;
                }

                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to treat it as a dynamic object property.
                if (isNaN(tmpBoxedPropertyNumber)) {
                  // This isn't a number ... let's treat it as a dynamic object property.
                  // We would expect the property to be wrapped in some kind of quotes so strip them
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

                  // Return the value in the property
                  return pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference];
                } else {
                  return pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber];
                }
              }
              // The requirements to detect a boxed set element are:
              //    1) The start bracket is after character 0
              else if (tmpBracketStartIndex > 0
              //    2) The end bracket is after the start bracket
              && tmpBracketStopIndex > tmpBracketStartIndex
              //    3) There is nothing in the brackets
              && tmpBracketStopIndex - tmpBracketStartIndex == 1) {
                var _tmpBoxedPropertyName5 = pAddress.substring(0, tmpBracketStartIndex).trim();
                if (!Array.isArray(pObject[_tmpBoxedPropertyName5])) {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }
                var tmpInputArray = pObject[_tmpBoxedPropertyName5];
                var tmpOutputArray = [];
                for (var _i4 = 0; _i4 < tmpInputArray.length; _i4++) {
                  // The filtering is complex but allows config-based metaprogramming directly from schema
                  var tmpKeepRecord = this.checkRecordFilters(pAddress, tmpInputArray[_i4]);
                  if (tmpKeepRecord) {
                    tmpOutputArray.push(tmpInputArray[_i4]);
                  }
                }
                return tmpOutputArray;
              }
              // The object has been flagged as an object set, so treat it as such
              else if (tmpObjectTypeMarkerIndex > 0) {
                var tmpObjectPropertyName = pAddress.substring(0, tmpObjectTypeMarkerIndex).trim();
                if (_typeof(pObject[tmpObjectPropertyName]) != 'object') {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }
                return pObject[tmpObjectPropertyName];
              } else {
                // Now is the point in recursion to return the value in the address
                if (_typeof(pObject[pAddress]) != null) {
                  return pObject[pAddress];
                } else {
                  return undefined;
                }
              }
            } else {
              //let tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
              //let tmpNewAddress = pAddress.substring(tmpSeparatorIndex+1);
              var tmpSubObjectName = tmpAddressPartBeginning;
              var tmpNewAddress = pAddress.substring(tmpAddressPartBeginning.length + 1);

              // BOXED ELEMENTS
              // Test if the tmpNewAddress is an array or object
              // Check if it's a boxed property
              var _tmpBracketStartIndex3 = tmpSubObjectName.indexOf('[');
              var _tmpBracketStopIndex3 = tmpSubObjectName.indexOf(']');

              // Check if there is a function somewhere in the address... parenthesis start should only be in a function
              var _tmpFunctionStartIndex2 = tmpSubObjectName.indexOf('(');

              // NOTE THAT FUNCTIONS MUST RESOLVE FIRST
              // Functions look like this
              // 		MyFunction()
              // 		MyFunction(Some.Address)
              // 		MyFunction(Some.Address,Some.Other.Address)
              // 		MyFunction(Some.Address,Some.Other.Address,Some.Third.Address)
              //
              // This could be enhanced to allow purely numeric and string values to be passed to the function.  For now,
              // To heck with that.  This is a simple function call.
              //
              // The requirements to detect a function are:
              //    1) The start bracket is after character 0
              if (_tmpFunctionStartIndex2 > 0
              //    2) The end bracket is after the start bracket
              && _MockFable.DataFormat.stringCountEnclosures(tmpSubObjectName) > 0) {
                var _tmpFunctionAddress2 = tmpSubObjectName.substring(0, _tmpFunctionStartIndex2).trim();
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                if (!_typeof(pObject[_tmpFunctionAddress2]) == 'function') {
                  // The address suggests it is a function, but it is not.
                  return false;
                }

                // Now see if the function has arguments.
                // Implementation notes: * ARGUMENTS MUST SHARE THE SAME ROOT OBJECT CONTEXT *
                var _tmpFunctionArguments = _MockFable.DataFormat.stringGetSegments(_MockFable.DataFormat.stringGetEnclosureValueByIndex(tmpSubObjectName.substring(_tmpFunctionAddress2.length), 0), ',');
                if (_tmpFunctionArguments.length == 0 || _tmpFunctionArguments[0] == '') {
                  // No arguments... just call the function (bound to the scope of the object it is contained withing)
                  if (_tmpFunctionAddress2 in pObject) {
                    try {
                      return this.getValueAtAddress(pObject[_tmpFunctionAddress2].apply(pObject), tmpNewAddress, tmpParentAddress, tmpRootObject);
                    } catch (pError) {
                      // The function call failed, so the address doesn't exist
                      console.log("Error in getValueAtAddress calling function ".concat(_tmpFunctionAddress2, " (address [").concat(pAddress, "]): ").concat(pError.message));
                      return false;
                    }
                  } else {
                    // The function doesn't exist, so the address doesn't exist
                    console.log("Function ".concat(_tmpFunctionAddress2, " does not exist (address [").concat(pAddress, "])"));
                    return false;
                  }
                } else {
                  var _tmpArgumentValues = [];
                  var _tmpRootObject3 = typeof pRootObject == 'undefined' ? pObject : pRootObject;

                  // Now get the value for each argument
                  for (var _i5 = 0; _i5 < _tmpFunctionArguments.length; _i5++) {
                    // Resolve the values for each subsequent entry
                    // Check if the argument value is a string literal or a reference to an address
                    if (_tmpFunctionArguments[_i5].length >= 2 && (_tmpFunctionArguments[_i5].charAt(0) == '"' || _tmpFunctionArguments[_i5].charAt(0) == "'" || _tmpFunctionArguments[_i5].charAt(0) == "`") && (_tmpFunctionArguments[_i5].charAt(_tmpFunctionArguments[_i5].length - 1) == '"' || _tmpFunctionArguments[_i5].charAt(_tmpFunctionArguments[_i5].length - 1) == "'" || _tmpFunctionArguments[_i5].charAt(_tmpFunctionArguments[_i5].length - 1) == "`")) {
                      // This is a string literal
                      _tmpArgumentValues.push(_tmpFunctionArguments[_i5].substring(1, _tmpFunctionArguments[_i5].length - 1));
                    } else {
                      // This is a hash address
                      _tmpArgumentValues.push(this.getValueAtAddress(_tmpRootObject3, _tmpFunctionArguments[_i5]));
                    }
                  }
                  if (_tmpFunctionAddress2 in pObject) {
                    try {
                      return this.getValueAtAddress(pObject[_tmpFunctionAddress2].apply(pObject, _tmpArgumentValues), tmpNewAddress, tmpParentAddress, _tmpRootObject3);
                    } catch (pError) {
                      // The function call failed, so the address doesn't exist
                      console.log("Error in getValueAtAddress calling function ".concat(_tmpFunctionAddress2, " (address [").concat(pAddress, "]): ").concat(pError.message));
                      return false;
                    }
                  } else {
                    // The function doesn't exist, so the address doesn't exist
                    console.log("Function ".concat(_tmpFunctionAddress2, " does not exist (address [").concat(pAddress, "])"));
                    return false;
                  }
                }
              }
              // Boxed elements look like this:
              // 		MyValues[42]
              // 		MyValues['Color']
              // 		MyValues["Weight"]
              // 		MyValues[`Diameter`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              else if (_tmpBracketStartIndex3 > 0
              //    2) The end bracket has something between them
              && _tmpBracketStopIndex3 > _tmpBracketStartIndex3
              //    3) There is data
              && _tmpBracketStopIndex3 - _tmpBracketStartIndex3 > 1) {
                var _tmpBoxedPropertyName6 = tmpSubObjectName.substring(0, _tmpBracketStartIndex3).trim();
                var _tmpBoxedPropertyReference3 = tmpSubObjectName.substring(_tmpBracketStartIndex3 + 1, _tmpBracketStopIndex3).trim();
                var _tmpBoxedPropertyNumber3 = parseInt(_tmpBoxedPropertyReference3, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students[1].Tardy
                //       BUT
                //         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
                //       BUT
                //         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
                // TODO: Should this be an error or something?  Should we keep a log of failures like this?
                if (Array.isArray(pObject[_tmpBoxedPropertyName6]) == isNaN(_tmpBoxedPropertyNumber3)) {
                  return undefined;
                }
                // Check if the boxed property is an object.
                if (_typeof(pObject[_tmpBoxedPropertyName6]) != 'object') {
                  return undefined;
                }

                //This is a bracketed value
                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to reat it as a dynamic object property.
                if (isNaN(_tmpBoxedPropertyNumber3)) {
                  // This isn't a number ... let's treat it as a dynanmic object property.
                  _tmpBoxedPropertyReference3 = this.cleanWrapCharacters('"', _tmpBoxedPropertyReference3);
                  _tmpBoxedPropertyReference3 = this.cleanWrapCharacters('`', _tmpBoxedPropertyReference3);
                  _tmpBoxedPropertyReference3 = this.cleanWrapCharacters("'", _tmpBoxedPropertyReference3);

                  // Continue to manage the parent address for recursion
                  tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                  // Recurse directly into the subobject
                  return this.getValueAtAddress(pObject[_tmpBoxedPropertyName6][_tmpBoxedPropertyReference3], tmpNewAddress, tmpParentAddress, tmpRootObject);
                } else {
                  // Continue to manage the parent address for recursion
                  tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                  // We parsed a valid number out of the boxed property name, so recurse into the array
                  return this.getValueAtAddress(pObject[_tmpBoxedPropertyName6][_tmpBoxedPropertyNumber3], tmpNewAddress, tmpParentAddress, tmpRootObject);
                }
              }
              // The requirements to detect a boxed set element are:
              //    1) The start bracket is after character 0
              else if (_tmpBracketStartIndex3 > 0
              //    2) The end bracket is after the start bracket
              && _tmpBracketStopIndex3 > _tmpBracketStartIndex3
              //    3) There is nothing in the brackets
              && _tmpBracketStopIndex3 - _tmpBracketStartIndex3 == 1) {
                var _tmpBoxedPropertyName7 = pAddress.substring(0, _tmpBracketStartIndex3).trim();
                if (!Array.isArray(pObject[_tmpBoxedPropertyName7])) {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }

                // We need to enumerate the array and grab the addresses from there.
                var tmpArrayProperty = pObject[_tmpBoxedPropertyName7];
                // Managing the parent address is a bit more complex here -- the box will be added for each element.
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(_tmpBoxedPropertyName7);
                // The container object is where we have the "Address":SOMEVALUE pairs
                var tmpContainerObject = {};
                for (var _i6 = 0; _i6 < tmpArrayProperty.length; _i6++) {
                  var tmpPropertyParentAddress = "".concat(tmpParentAddress, "[").concat(_i6, "]");
                  var tmpValue = this.getValueAtAddress(pObject[_tmpBoxedPropertyName7][_i6], tmpNewAddress, tmpPropertyParentAddress, tmpRootObject);
                  tmpContainerObject["".concat(tmpPropertyParentAddress, ".").concat(tmpNewAddress)] = tmpValue;
                }
                return tmpContainerObject;
              }

              // OBJECT SET
              // Note this will not work with a bracket in the same address box set
              var _tmpObjectTypeMarkerIndex2 = pAddress.indexOf('{}');
              if (_tmpObjectTypeMarkerIndex2 > 0) {
                var _tmpObjectPropertyName2 = pAddress.substring(0, _tmpObjectTypeMarkerIndex2).trim();
                if (_typeof(pObject[_tmpObjectPropertyName2]) != 'object') {
                  // We asked for a set from an array but it isnt' an array.
                  return false;
                }

                // We need to enumerate the Object and grab the addresses from there.
                var tmpObjectProperty = pObject[_tmpObjectPropertyName2];
                var tmpObjectPropertyKeys = Object.keys(tmpObjectProperty);
                // Managing the parent address is a bit more complex here -- the box will be added for each element.
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(_tmpObjectPropertyName2);
                // The container object is where we have the "Address":SOMEVALUE pairs
                var _tmpContainerObject2 = {};
                for (var _i7 = 0; _i7 < tmpObjectPropertyKeys.length; _i7++) {
                  var _tmpPropertyParentAddress2 = "".concat(tmpParentAddress, ".").concat(tmpObjectPropertyKeys[_i7]);
                  var _tmpValue2 = this.getValueAtAddress(pObject[_tmpObjectPropertyName2][tmpObjectPropertyKeys[_i7]], tmpNewAddress, _tmpPropertyParentAddress2, tmpRootObject);

                  // The filtering is complex but allows config-based metaprogramming directly from schema
                  var _tmpKeepRecord2 = this.checkRecordFilters(pAddress, _tmpValue2);
                  if (_tmpKeepRecord2) {
                    _tmpContainerObject2["".concat(_tmpPropertyParentAddress2, ".").concat(tmpNewAddress)] = _tmpValue2;
                  }
                }
                return _tmpContainerObject2;
              }

              // If there is an object property already named for the sub object, but it isn't an object
              // then the system can't set the value in there.  Error and abort!
              if (tmpSubObjectName in pObject && _typeof(pObject[tmpSubObjectName]) !== 'object') {
                return undefined;
              } else if (tmpSubObjectName in pObject) {
                // If there is already a subobject pass that to the recursive thingy
                // Continue to manage the parent address for recursion
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                return this.getValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress, tmpRootObject);
              } else {
                // Create a subobject and then pass that
                // Continue to manage the parent address for recursion
                tmpParentAddress = "".concat(tmpParentAddress).concat(tmpParentAddress.length > 0 ? '.' : '').concat(tmpSubObjectName);
                pObject[tmpSubObjectName] = {};
                return this.getValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, tmpParentAddress, tmpRootObject);
              }
            }
          }
        }]);
      }();
      ;
      module.exports = ManyfestObjectAddressResolverGetValue;
    }, {
      "../source/Manyfest-ParseConditionals.js": 11,
      "./Manyfest-CleanWrapCharacters.js": 2,
      "./Manyfest-LogToConsole.js": 4,
      "./Manyfest-ObjectAddress-Parser.js": 8
    }],
    8: [function (require, module, exports) {
      // TODO: This is an inelegant solution to delay the rewrite of Manyfest.

      // Fable 3.0 has a service for data formatting that deals well with nested enclosures.

      // The Manyfest library predates fable 3.0 and the services structure of it, so the functions
      // are more or less pure javascript and as functional as they can be made to be.

      // Until we shift Manyfest to be a fable service, these three functions were pulled out of
      // fable to aid in parsing functions with nested enclosures.

      module.exports = {
        /**
         * Count the number of segments in a string, respecting enclosures
         * 
         * @param {string} pString 
         * @param {string} pSeparator 
         * @param {object} pEnclosureStartSymbolMap 
         * @param {object} pEnclosureEndSymbolMap 
         * @returns the count of segments in the string as a number
         */
        stringCountSegments: function stringCountSegments(pString, pSeparator, pEnclosureStartSymbolMap, pEnclosureEndSymbolMap) {
          var tmpString = typeof pString == 'string' ? pString : '';
          var tmpSeparator = typeof pSeparator == 'string' ? pSeparator : '.';
          var tmpEnclosureStartSymbolMap = _typeof(pEnclosureStartSymbolMap) == 'object' ? pEnclosureStart : {
            '{': 0,
            '[': 1,
            '(': 2
          };
          var tmpEnclosureEndSymbolMap = _typeof(pEnclosureEndSymbolMap) == 'object' ? pEnclosureEnd : {
            '}': 0,
            ']': 1,
            ')': 2
          };
          if (pString.length < 1) {
            return 0;
          }
          var tmpSegmentCount = 1;
          var tmpEnclosureStack = [];
          for (var i = 0; i < tmpString.length; i++) {
            // IF This is the start of a segment
            if (tmpString[i] == tmpSeparator
            // AND we are not in a nested portion of the string
            && tmpEnclosureStack.length == 0) {
              // Increment the segment count
              tmpSegmentCount++;
            }
            // IF This is the start of an enclosure
            else if (tmpString[i] in tmpEnclosureStartSymbolMap) {
              // Add it to the stack!
              tmpEnclosureStack.push(tmpEnclosureStartSymbolMap[tmpString[i]]);
            }
            // IF This is the end of an enclosure
            else if (tmpString[i] in tmpEnclosureEndSymbolMap
            // AND it matches the current nest level symbol
            && tmpEnclosureEndSymbolMap[tmpString[i]] == tmpEnclosureStack[tmpEnclosureStack.length - 1]) {
              // Pop it off the stack!
              tmpEnclosureStack.pop();
            }
          }
          return tmpSegmentCount;
        },
        /**
         * Get the first segment in a string, respecting enclosures
         * 
         * @param {string} pString 
         * @param {string} pSeparator 
         * @param {object} pEnclosureStartSymbolMap 
         * @param {object} pEnclosureEndSymbolMap 
         * @returns the first segment in the string as a string
         */
        stringGetFirstSegment: function stringGetFirstSegment(pString, pSeparator, pEnclosureStartSymbolMap, pEnclosureEndSymbolMap) {
          var tmpString = typeof pString == 'string' ? pString : '';
          var tmpSeparator = typeof pSeparator == 'string' ? pSeparator : '.';
          var tmpEnclosureStartSymbolMap = _typeof(pEnclosureStartSymbolMap) == 'object' ? pEnclosureStart : {
            '{': 0,
            '[': 1,
            '(': 2
          };
          var tmpEnclosureEndSymbolMap = _typeof(pEnclosureEndSymbolMap) == 'object' ? pEnclosureEnd : {
            '}': 0,
            ']': 1,
            ')': 2
          };
          if (pString.length < 1) {
            return 0;
          }
          var tmpEnclosureStack = [];
          for (var i = 0; i < tmpString.length; i++) {
            // IF This is the start of a segment
            if (tmpString[i] == tmpSeparator
            // AND we are not in a nested portion of the string
            && tmpEnclosureStack.length == 0) {
              // Return the segment
              return tmpString.substring(0, i);
            }
            // IF This is the start of an enclosure
            else if (tmpString[i] in tmpEnclosureStartSymbolMap) {
              // Add it to the stack!
              tmpEnclosureStack.push(tmpEnclosureStartSymbolMap[tmpString[i]]);
            }
            // IF This is the end of an enclosure
            else if (tmpString[i] in tmpEnclosureEndSymbolMap
            // AND it matches the current nest level symbol
            && tmpEnclosureEndSymbolMap[tmpString[i]] == tmpEnclosureStack[tmpEnclosureStack.length - 1]) {
              // Pop it off the stack!
              tmpEnclosureStack.pop();
            }
          }
          return tmpString;
        },
        /**
         * Get all segments in a string, respecting enclosures
         * 
         * @param {string} pString 
         * @param {string} pSeparator 
         * @param {object} pEnclosureStartSymbolMap 
         * @param {object} pEnclosureEndSymbolMap 
         * @returns the first segment in the string as a string
         */
        stringGetSegments: function stringGetSegments(pString, pSeparator, pEnclosureStartSymbolMap, pEnclosureEndSymbolMap) {
          var tmpString = typeof pString == 'string' ? pString : '';
          var tmpSeparator = typeof pSeparator == 'string' ? pSeparator : '.';
          var tmpEnclosureStartSymbolMap = _typeof(pEnclosureStartSymbolMap) == 'object' ? pEnclosureStart : {
            '{': 0,
            '[': 1,
            '(': 2
          };
          var tmpEnclosureEndSymbolMap = _typeof(pEnclosureEndSymbolMap) == 'object' ? pEnclosureEnd : {
            '}': 0,
            ']': 1,
            ')': 2
          };
          var tmpCurrentSegmentStart = 0;
          var tmpSegmentList = [];
          if (pString.length < 1) {
            return tmpSegmentList;
          }
          var tmpEnclosureStack = [];
          for (var i = 0; i < tmpString.length; i++) {
            // IF This is the start of a segment
            if (tmpString[i] == tmpSeparator
            // AND we are not in a nested portion of the string
            && tmpEnclosureStack.length == 0) {
              // Return the segment
              tmpSegmentList.push(tmpString.substring(tmpCurrentSegmentStart, i));
              tmpCurrentSegmentStart = i + 1;
            }
            // IF This is the start of an enclosure
            else if (tmpString[i] in tmpEnclosureStartSymbolMap) {
              // Add it to the stack!
              tmpEnclosureStack.push(tmpEnclosureStartSymbolMap[tmpString[i]]);
            }
            // IF This is the end of an enclosure
            else if (tmpString[i] in tmpEnclosureEndSymbolMap
            // AND it matches the current nest level symbol
            && tmpEnclosureEndSymbolMap[tmpString[i]] == tmpEnclosureStack[tmpEnclosureStack.length - 1]) {
              // Pop it off the stack!
              tmpEnclosureStack.pop();
            }
          }
          if (tmpCurrentSegmentStart < tmpString.length) {
            tmpSegmentList.push(tmpString.substring(tmpCurrentSegmentStart));
          }
          return tmpSegmentList;
        },
        /**
         * Count the number of enclosures in a string based on the start and end characters.
         *
         * If no start or end characters are specified, it will default to parentheses.  If the string is not a string, it will return 0.
         *
         * @param {string} pString
         * @param {string} pEnclosureStart
         * @param {string} pEnclosureEnd
         * @returns the count of full in the string
         */
        stringCountEnclosures: function stringCountEnclosures(pString, pEnclosureStart, pEnclosureEnd) {
          var tmpString = typeof pString == 'string' ? pString : '';
          var tmpEnclosureStart = typeof pEnclosureStart == 'string' ? pEnclosureStart : '(';
          var tmpEnclosureEnd = typeof pEnclosureEnd == 'string' ? pEnclosureEnd : ')';
          var tmpEnclosureCount = 0;
          var tmpEnclosureDepth = 0;
          for (var i = 0; i < tmpString.length; i++) {
            // This is the start of an enclosure
            if (tmpString[i] == tmpEnclosureStart) {
              if (tmpEnclosureDepth == 0) {
                tmpEnclosureCount++;
              }
              tmpEnclosureDepth++;
            } else if (tmpString[i] == tmpEnclosureEnd) {
              tmpEnclosureDepth--;
            }
          }
          return tmpEnclosureCount;
        },
        /**
         * Get the value of the enclosure at the specified index.
         *
         * If the index is not a number, it will default to 0.  If the string is not a string, it will return an empty string.  If the enclosure is not found, it will return an empty string.  If the enclosure
         *
         * @param {string} pString
         * @param {number} pEnclosureIndexToGet
         * @param {string} pEnclosureStart
         * @param {string}} pEnclosureEnd
         * @returns {string}
         */
        stringGetEnclosureValueByIndex: function stringGetEnclosureValueByIndex(pString, pEnclosureIndexToGet, pEnclosureStart, pEnclosureEnd) {
          var tmpString = typeof pString == 'string' ? pString : '';
          var tmpEnclosureIndexToGet = typeof pEnclosureIndexToGet == 'number' ? pEnclosureIndexToGet : 0;
          var tmpEnclosureStart = typeof pEnclosureStart == 'string' ? pEnclosureStart : '(';
          var tmpEnclosureEnd = typeof pEnclosureEnd == 'string' ? pEnclosureEnd : ')';
          var tmpEnclosureCount = 0;
          var tmpEnclosureDepth = 0;
          var tmpMatchedEnclosureIndex = false;
          var tmpEnclosedValueStartIndex = 0;
          var tmpEnclosedValueEndIndex = 0;
          for (var i = 0; i < tmpString.length; i++) {
            // This is the start of an enclosure
            if (tmpString[i] == tmpEnclosureStart) {
              tmpEnclosureDepth++;

              // Only count enclosures at depth 1, but still this parses both pairs of all of them.
              if (tmpEnclosureDepth == 1) {
                tmpEnclosureCount++;
                if (tmpEnclosureIndexToGet == tmpEnclosureCount - 1) {
                  // This is the start of *the* enclosure
                  tmpMatchedEnclosureIndex = true;
                  tmpEnclosedValueStartIndex = i;
                }
              }
            }
            // This is the end of an enclosure
            else if (tmpString[i] == tmpEnclosureEnd) {
              tmpEnclosureDepth--;

              // Again, only count enclosures at depth 1, but still this parses both pairs of all of them.
              if (tmpEnclosureDepth == 0 && tmpMatchedEnclosureIndex && tmpEnclosedValueEndIndex <= tmpEnclosedValueStartIndex) {
                tmpEnclosedValueEndIndex = i;
                tmpMatchedEnclosureIndex = false;
              }
            }
          }
          if (tmpEnclosureCount <= tmpEnclosureIndexToGet) {
            // Return an empty string if the enclosure is not found
            return '';
          }
          if (tmpEnclosedValueEndIndex > 0 && tmpEnclosedValueEndIndex > tmpEnclosedValueStartIndex) {
            return tmpString.substring(tmpEnclosedValueStartIndex + 1, tmpEnclosedValueEndIndex);
          } else {
            return tmpString.substring(tmpEnclosedValueStartIndex + 1);
          }
        }
      };
    }, {}],
    9: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');
      var fCleanWrapCharacters = require('./Manyfest-CleanWrapCharacters.js');

      /**
      * Object Address Resolver - SetValue
      *
      * IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
      *                 be extremely clear what is going on in the recursion for
      *                 each of the three address resolution functions.
      *
      *                 Although there is some opportunity to repeat ourselves a
      *                 bit less in this codebase (e.g. with detection of arrays
      *                 versus objects versus direct properties), it can make
      *                 debugging.. challenging.  The minified version of the code
      *                 optimizes out almost anything repeated in here.  So please
      *                 be kind and rewind... meaning please keep the codebase less
      *                 terse and more verbose so humans can comprehend it.
      *
      *
      * @class ManyfestObjectAddressSetValue
      */
      var ManyfestObjectAddressSetValue = /*#__PURE__*/function () {
        function ManyfestObjectAddressSetValue(pInfoLog, pErrorLog) {
          _classCallCheck(this, ManyfestObjectAddressSetValue);
          // Wire in logging
          this.logInfo = typeof pInfoLog == 'function' ? pInfoLog : libSimpleLog;
          this.logError = typeof pErrorLog == 'function' ? pErrorLog : libSimpleLog;
          this.cleanWrapCharacters = fCleanWrapCharacters;
        }

        // Set the value of an element at an address
        return _createClass(ManyfestObjectAddressSetValue, [{
          key: "setValueAtAddress",
          value: function setValueAtAddress(pObject, pAddress, pValue) {
            // Make sure pObject is an object
            if (_typeof(pObject) != 'object') return false;
            // Make sure pAddress is a string
            if (typeof pAddress != 'string') return false;
            var tmpSeparatorIndex = pAddress.indexOf('.');
            if (tmpSeparatorIndex == -1) {
              // Check if it's a boxed property
              var tmpBracketStartIndex = pAddress.indexOf('[');
              var tmpBracketStopIndex = pAddress.indexOf(']');
              // Boxed elements look like this:
              // 		MyValues[10]
              // 		MyValues['Name']
              // 		MyValues["Age"]
              // 		MyValues[`Cost`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              if (tmpBracketStartIndex > 0
              //    2) The end bracket has something between them
              && tmpBracketStopIndex > tmpBracketStartIndex
              //    3) There is data
              && tmpBracketStopIndex - tmpBracketStartIndex > 1) {
                // The "Name" of the Object contained too the left of the bracket
                var tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

                // If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
                // This is a rare case where Arrays testing as Objects is useful
                if (_typeof(pObject[tmpBoxedPropertyName]) !== 'object') {
                  return false;
                }

                // The "Reference" to the property within it, either an array element or object property
                var tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex + 1, tmpBracketStopIndex).trim();
                // Attempt to parse the reference as a number, which will be used as an array element
                var tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber)) {
                  return false;
                }

                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to treat it as a dynamic object property.
                if (isNaN(tmpBoxedPropertyNumber)) {
                  // This isn't a number ... let's treat it as a dynamic object property.
                  // We would expect the property to be wrapped in some kind of quotes so strip them
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
                  tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

                  // Return the value in the property
                  pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference] = pValue;
                  return true;
                } else {
                  pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber] = pValue;
                  return true;
                }
              } else {
                // Now is the time in recursion to set the value in the object
                pObject[pAddress] = pValue;
                return true;
              }
            } else {
              var tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
              var tmpNewAddress = pAddress.substring(tmpSeparatorIndex + 1);

              // Test if the tmpNewAddress is an array or object
              // Check if it's a boxed property
              var _tmpBracketStartIndex4 = tmpSubObjectName.indexOf('[');
              var _tmpBracketStopIndex4 = tmpSubObjectName.indexOf(']');
              // Boxed elements look like this:
              // 		MyValues[42]
              // 		MyValues['Color']
              // 		MyValues["Weight"]
              // 		MyValues[`Diameter`]
              //
              // When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
              // The requirements to detect a boxed element are:
              //    1) The start bracket is after character 0
              if (_tmpBracketStartIndex4 > 0
              //    2) The end bracket has something between them
              && _tmpBracketStopIndex4 > _tmpBracketStartIndex4
              //    3) There is data
              && _tmpBracketStopIndex4 - _tmpBracketStartIndex4 > 1) {
                var _tmpBoxedPropertyName8 = tmpSubObjectName.substring(0, _tmpBracketStartIndex4).trim();
                var _tmpBoxedPropertyReference4 = tmpSubObjectName.substring(_tmpBracketStartIndex4 + 1, _tmpBracketStopIndex4).trim();
                var _tmpBoxedPropertyNumber4 = parseInt(_tmpBoxedPropertyReference4, 10);

                // Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
                //        This seems confusing to me at first read, so explaination:
                //        Is the Boxed Object an Array?  TRUE
                //        And is the Reference inside the boxed Object not a number? TRUE
                //        -->  So when these are in agreement, it's an impossible access state
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students[1].Tardy
                //       BUT
                //         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
                // This could be a failure in the recursion chain because they passed something like this in:
                //    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
                //       BUT
                //         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
                // TODO: Should this be an error or something?  Should we keep a log of failures like this?
                if (Array.isArray(pObject[_tmpBoxedPropertyName8]) == isNaN(_tmpBoxedPropertyNumber4)) {
                  return false;
                }

                //This is a bracketed value
                //    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
                //       otherwise we will try to reat it as a dynamic object property.
                if (isNaN(_tmpBoxedPropertyNumber4)) {
                  // This isn't a number ... let's treat it as a dynanmic object property.
                  _tmpBoxedPropertyReference4 = this.cleanWrapCharacters('"', _tmpBoxedPropertyReference4);
                  _tmpBoxedPropertyReference4 = this.cleanWrapCharacters('`', _tmpBoxedPropertyReference4);
                  _tmpBoxedPropertyReference4 = this.cleanWrapCharacters("'", _tmpBoxedPropertyReference4);

                  // Recurse directly into the subobject
                  return this.setValueAtAddress(pObject[_tmpBoxedPropertyName8][_tmpBoxedPropertyReference4], tmpNewAddress, pValue);
                } else {
                  // We parsed a valid number out of the boxed property name, so recurse into the array
                  return this.setValueAtAddress(pObject[_tmpBoxedPropertyName8][_tmpBoxedPropertyNumber4], tmpNewAddress, pValue);
                }
              }

              // If there is an object property already named for the sub object, but it isn't an object
              // then the system can't set the value in there.  Error and abort!
              if (tmpSubObjectName in pObject && _typeof(pObject[tmpSubObjectName]) !== 'object') {
                if (!('__ERROR' in pObject)) pObject['__ERROR'] = {};
                // Put it in an error object so data isn't lost
                pObject['__ERROR'][pAddress] = pValue;
                return false;
              } else if (tmpSubObjectName in pObject) {
                // If there is already a subobject pass that to the recursive thingy
                return this.setValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, pValue);
              } else {
                // Create a subobject and then pass that
                pObject[tmpSubObjectName] = {};
                return this.setValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, pValue);
              }
            }
          }
        }]);
      }();
      ;
      module.exports = ManyfestObjectAddressSetValue;
    }, {
      "./Manyfest-CleanWrapCharacters.js": 2,
      "./Manyfest-LogToConsole.js": 4
    }],
    10: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');

      /**
      * Object Address Generation
      *
      * Automagically generate addresses and properties based on a passed-in object,
      * to be used for easy creation of schemas.  Meant to simplify the lives of
      * developers wanting to create schemas without typing a bunch of stuff.
      *
      * IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
      *                 be extremely clear what is going on in the recursion for
      *                 each of the three address resolution functions.
      *
      *                 Although there is some opportunity to repeat ourselves a
      *                 bit less in this codebase (e.g. with detection of arrays
      *                 versus objects versus direct properties), it can make
      *                 debugging.. challenging.  The minified version of the code
      *                 optimizes out almost anything repeated in here.  So please
      *                 be kind and rewind... meaning please keep the codebase less
      *                 terse and more verbose so humans can comprehend it.
      *
      *
      * @class ManyfestObjectAddressGeneration
      */
      var ManyfestObjectAddressGeneration = /*#__PURE__*/function () {
        function ManyfestObjectAddressGeneration(pInfoLog, pErrorLog) {
          _classCallCheck(this, ManyfestObjectAddressGeneration);
          // Wire in logging
          this.logInfo = typeof pInfoLog == 'function' ? pInfoLog : libSimpleLog;
          this.logError = typeof pErrorLog == 'function' ? pErrorLog : libSimpleLog;
        }

        // generateAddressses
        //
        // This flattens an object into a set of key:value pairs for *EVERY SINGLE
        // POSSIBLE ADDRESS* in the object.  It can get ... really insane really
        // quickly.  This is not meant to be used directly to generate schemas, but
        // instead as a starting point for scripts or UIs.
        //
        // This will return a mega set of key:value pairs with all possible schema
        // permutations and default values (when not an object) and everything else.
        return _createClass(ManyfestObjectAddressGeneration, [{
          key: "generateAddressses",
          value: function generateAddressses(pObject, pBaseAddress, pSchema) {
            var tmpBaseAddress = typeof pBaseAddress == 'string' ? pBaseAddress : '';
            var tmpSchema = _typeof(pSchema) == 'object' ? pSchema : {};
            var tmpObjectType = _typeof(pObject);
            var tmpSchemaObjectEntry = {
              Address: tmpBaseAddress,
              Hash: tmpBaseAddress,
              Name: tmpBaseAddress,
              // This is so scripts and UI controls can force a developer to opt-in.
              InSchema: false
            };
            if (tmpObjectType == 'object' && pObject == null) {
              tmpObjectType = 'null';
            }
            switch (tmpObjectType) {
              case 'string':
                tmpSchemaObjectEntry.DataType = 'String';
                tmpSchemaObjectEntry.Default = pObject;
                tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
                break;
              case 'number':
              case 'bigint':
                tmpSchemaObjectEntry.DataType = 'Number';
                tmpSchemaObjectEntry.Default = pObject;
                tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
                break;
              case 'undefined':
              case 'null':
                tmpSchemaObjectEntry.DataType = 'Any';
                tmpSchemaObjectEntry.Default = pObject;
                tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
                break;
              case 'object':
                if (Array.isArray(pObject)) {
                  tmpSchemaObjectEntry.DataType = 'Array';
                  if (tmpBaseAddress != '') {
                    tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
                  }
                  for (var i = 0; i < pObject.length; i++) {
                    this.generateAddressses(pObject[i], "".concat(tmpBaseAddress, "[").concat(i, "]"), tmpSchema);
                  }
                } else {
                  tmpSchemaObjectEntry.DataType = 'Object';
                  if (tmpBaseAddress != '') {
                    tmpSchema[tmpBaseAddress] = tmpSchemaObjectEntry;
                    tmpBaseAddress += '.';
                  }
                  var tmpObjectProperties = Object.keys(pObject);
                  for (var _i8 = 0; _i8 < tmpObjectProperties.length; _i8++) {
                    this.generateAddressses(pObject[tmpObjectProperties[_i8]], "".concat(tmpBaseAddress).concat(tmpObjectProperties[_i8]), tmpSchema);
                  }
                }
                break;
              case 'symbol':
              case 'function':
                // Symbols and functions neither recurse nor get added to the schema
                break;
            }
            return tmpSchema;
          }
        }]);
      }();
      ;
      module.exports = ManyfestObjectAddressGeneration;
    }, {
      "./Manyfest-LogToConsole.js": 4
    }],
    11: [function (require, module, exports) {
      // Given a string, parse out any conditional expressions and set whether or not to keep the record.
      //
      // For instance:
      // 		'files[]<<~?format,==,Thumbnail?~>>'
      //      'files[]<<~?format,==,Metadata?~>>'
      //      'files[]<<~?size,>,4000?~>>'
      //
      // The wrapping parts are the <<~? and ?~>> megabrackets.
      //
      // The function does not need to alter the string -- just check the conditionals within.

      // TODO: Consider making this an es6 class

      // Let's use indexOf since it is apparently the fastest.
      var _ConditionalStanzaStart = '<<~?';
      var _ConditionalStanzaStartLength = _ConditionalStanzaStart.length;
      var _ConditionalStanzaEnd = '?~>>';
      var _ConditionalStanzaEndLength = _ConditionalStanzaEnd.length;

      // Ugh dependency injection.  Can't wait to make these all fable services.
      //let libObjectAddressCheckAddressExists = new (require('./Manyfest-ObjectAddress-CheckAddressExists.js'))();

      // Test the condition of a value in a record
      var testCondition = function testCondition(pManyfest, pRecord, pSearchAddress, pSearchComparator, pValue) {
        switch (pSearchComparator) {
          case 'TRUE':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) === true;
            break;
          case 'FALSE':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) === false;
            break;
          case 'LNGT':
          case 'LENGTH_GREATER_THAN':
            switch (_typeof(pManyfest.getValueAtAddress(pRecord, pSearchAddress))) {
              case 'string':
                return pManyfest.getValueAtAddress(pRecord, pSearchAddress).length > pValue;
                break;
              case 'object':
                return pManyfest.getValueAtAddress(pRecord, pSearchAddress).length > pValue;
                break;
              default:
                return false;
                break;
            }
            break;
          case 'LNLT':
          case 'LENGTH_LESS_THAN':
            switch (_typeof(pManyfest.getValueAtAddress(pRecord, pSearchAddress))) {
              case 'string':
                return pManyfest.getValueAtAddress(pRecord, pSearchAddress).length < pValue;
                break;
              case 'object':
                return pManyfest.getValueAtAddress(pRecord, pSearchAddress).length < pValue;
                break;
              default:
                return false;
                break;
            }
            break;
          // TODO: Welcome to dependency hell.  This fixes itself when we move to fable services.
          // case 'EX':
          // case 'EXISTS':
          // 	return libObjectAddressCheckAddressExists.checkAddressExists(pRecord, pSearchAddress);
          // 	break;
          // case 'DNEX':
          // case 'DOES_NOT_EXIST':
          // 	return !libObjectAddressCheckAddressExists.checkAddressExists(pRecord, pSearchAddress);
          // 	break;
          case '!=':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) != pValue;
            break;
          case '<':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) < pValue;
            break;
          case '>':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) > pValue;
            break;
          case '<=':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) <= pValue;
            break;
          case '>=':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) >= pValue;
            break;
          case '===':
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) === pValue;
            break;
          case '==':
          default:
            return pManyfest.getValueAtAddress(pRecord, pSearchAddress) == pValue;
            break;
        }
      };
      var parseConditionals = function parseConditionals(pManyfest, pAddress, pRecord) {
        var tmpKeepRecord = true;

        /*
        	Algorithm is simple:
        		1.  Enuerate start points
        	2.  Find stop points within each start point
        	3. Check the conditional
        */
        var tmpStartIndex = pAddress.indexOf(_ConditionalStanzaStart);
        while (tmpStartIndex != -1) {
          var tmpStopIndex = pAddress.indexOf(_ConditionalStanzaEnd, tmpStartIndex + _ConditionalStanzaStartLength);
          if (tmpStopIndex != -1) {
            var tmpMagicComparisonPatternSet = pAddress.substring(tmpStartIndex + _ConditionalStanzaStartLength, tmpStopIndex).split(',');

            // The address to search for
            var tmpSearchAddress = tmpMagicComparisonPatternSet[0];

            // The copmparison expression (EXISTS as default)
            var tmpSearchComparator = 'EXISTS';
            if (tmpMagicComparisonPatternSet.length > 1) {
              tmpSearchComparator = tmpMagicComparisonPatternSet[1];
            }

            // The value to search for
            var tmpSearchValue = false;
            if (tmpMagicComparisonPatternSet.length > 2) {
              tmpSearchValue = tmpMagicComparisonPatternSet[2];
            }

            // Process the piece
            tmpKeepRecord = tmpKeepRecord && testCondition(pManyfest, pRecord, tmpSearchAddress, tmpSearchComparator, tmpSearchValue);
            tmpStartIndex = pAddress.indexOf(_ConditionalStanzaStart, tmpStopIndex + _ConditionalStanzaEndLength);
          } else {
            tmpStartIndex = -1;
          }
        }
        return tmpKeepRecord;
      };
      module.exports = parseConditionals;
    }, {}],
    12: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libSimpleLog = require('./Manyfest-LogToConsole.js');

      /**
      * Schema Manipulation Functions
      *
      * @class ManyfestSchemaManipulation
      */
      var ManyfestSchemaManipulation = /*#__PURE__*/function () {
        function ManyfestSchemaManipulation(pInfoLog, pErrorLog) {
          _classCallCheck(this, ManyfestSchemaManipulation);
          // Wire in logging
          this.logInfo = typeof pInfoLog === 'function' ? pInfoLog : libSimpleLog;
          this.logError = typeof pErrorLog === 'function' ? pErrorLog : libSimpleLog;
        }

        // This translates the default address mappings to something different.
        //
        // For instance you can pass in manyfest schema descriptor object:
        // 	{
        //	  "Address.Of.a": { "Hash": "a", "Type": "Number" },
        //	  "Address.Of.b": { "Hash": "b", "Type": "Number" }
        //  }
        //
        //
        // And then an address mapping (basically a Hash->Address map)
        //  {
        //    "a": "New.Address.Of.a",
        //    "b": "New.Address.Of.b"
        //  }
        //
        // NOTE: This mutates the schema object permanently, altering the base hash.
        //       If there is a collision with an existing address, it can lead to overwrites.
        // TODO: Discuss what should happen on collisions.
        return _createClass(ManyfestSchemaManipulation, [{
          key: "resolveAddressMappings",
          value: function resolveAddressMappings(pManyfestSchemaDescriptors, pAddressMapping) {
            if (_typeof(pManyfestSchemaDescriptors) != 'object') {
              this.logError("Attempted to resolve address mapping but the descriptor was not an object.");
              return false;
            }
            if (_typeof(pAddressMapping) != 'object') {
              // No mappings were passed in
              return true;
            }

            // Get the arrays of both the schema definition and the hash mapping
            var tmpManyfestAddresses = Object.keys(pManyfestSchemaDescriptors);
            var tmpHashMapping = {};
            tmpManyfestAddresses.forEach(function (pAddress) {
              if ('Hash' in pManyfestSchemaDescriptors[pAddress]) {
                tmpHashMapping[pManyfestSchemaDescriptors[pAddress].Hash] = pAddress;
              }
            });
            var tmpAddressMappingSet = Object.keys(pAddressMapping);
            tmpAddressMappingSet.forEach(function (pInputAddress) {
              var tmpNewDescriptorAddress = pAddressMapping[pInputAddress];
              var tmpOldDescriptorAddress = false;
              var tmpDescriptor = false;

              // See if there is a matching descriptor either by Address directly or Hash
              if (pInputAddress in pManyfestSchemaDescriptors) {
                tmpOldDescriptorAddress = pInputAddress;
              } else if (pInputAddress in tmpHashMapping) {
                tmpOldDescriptorAddress = tmpHashMapping[pInputAddress];
              }

              // If there was a matching descriptor in the manifest, store it in the temporary descriptor
              if (tmpOldDescriptorAddress) {
                tmpDescriptor = pManyfestSchemaDescriptors[tmpOldDescriptorAddress];
                delete pManyfestSchemaDescriptors[tmpOldDescriptorAddress];
              } else {
                // Create a new descriptor!  Map it to the input address.
                tmpDescriptor = {
                  Hash: pInputAddress
                };
              }

              // Now re-add the descriptor to the manyfest schema
              pManyfestSchemaDescriptors[tmpNewDescriptorAddress] = tmpDescriptor;
            });
            return true;
          }
        }, {
          key: "safeResolveAddressMappings",
          value: function safeResolveAddressMappings(pManyfestSchemaDescriptors, pAddressMapping) {
            // This returns the descriptors as a new object, safely remapping without mutating the original schema Descriptors
            var tmpManyfestSchemaDescriptors = JSON.parse(JSON.stringify(pManyfestSchemaDescriptors));
            this.resolveAddressMappings(tmpManyfestSchemaDescriptors, pAddressMapping);
            return tmpManyfestSchemaDescriptors;
          }
        }, {
          key: "mergeAddressMappings",
          value: function mergeAddressMappings(pManyfestSchemaDescriptorsDestination, pManyfestSchemaDescriptorsSource) {
            if (_typeof(pManyfestSchemaDescriptorsSource) != 'object' || _typeof(pManyfestSchemaDescriptorsDestination) != 'object') {
              this.logError("Attempted to merge two schema descriptors but both were not objects.");
              return false;
            }
            var tmpSource = JSON.parse(JSON.stringify(pManyfestSchemaDescriptorsSource));
            var tmpNewManyfestSchemaDescriptors = JSON.parse(JSON.stringify(pManyfestSchemaDescriptorsDestination));

            // The first passed-in set of descriptors takes precedence.
            var tmpDescriptorAddresses = Object.keys(tmpSource);
            tmpDescriptorAddresses.forEach(function (pDescriptorAddress) {
              if (!(pDescriptorAddress in tmpNewManyfestSchemaDescriptors)) {
                tmpNewManyfestSchemaDescriptors[pDescriptorAddress] = tmpSource[pDescriptorAddress];
              }
            });
            return tmpNewManyfestSchemaDescriptors;
          }
        }]);
      }();
      module.exports = ManyfestSchemaManipulation;
    }, {
      "./Manyfest-LogToConsole.js": 4
    }],
    13: [function (require, module, exports) {
      /**
      * @author <steven@velozo.com>
      */
      var libFableServiceProviderBase = require('fable-serviceproviderbase');
      var libSimpleLog = require('./Manyfest-LogToConsole.js');
      var libHashTranslation = require('./Manyfest-HashTranslation.js');
      var libObjectAddressCheckAddressExists = require('./Manyfest-ObjectAddress-CheckAddressExists.js');
      var libObjectAddressGetValue = require('./Manyfest-ObjectAddress-GetValue.js');
      var libObjectAddressSetValue = require('./Manyfest-ObjectAddress-SetValue.js');
      var libObjectAddressDeleteValue = require('./Manyfest-ObjectAddress-DeleteValue.js');
      var libObjectAddressGeneration = require('./Manyfest-ObjectAddressGeneration.js');
      var libSchemaManipulation = require('./Manyfest-SchemaManipulation.js');
      var _DefaultConfiguration = {
        Scope: 'DEFAULT',
        Descriptors: {}
      };

      /**
      * Manyfest object address-based descriptions and manipulations.
      *
      * @class Manyfest
      */
      var Manyfest = /*#__PURE__*/function (_libFableServiceProvi) {
        function Manyfest(pFable, pManifest, pServiceHash) {
          var _this3;
          _classCallCheck(this, Manyfest);
          if (pFable === undefined) {
            _this3 = _callSuper(this, Manyfest, [{}]);
          } else {
            _this3 = _callSuper(this, Manyfest, [pFable, pManifest, pServiceHash]);
          }
          _this3.serviceType = 'Manifest';

          // Wire in logging
          _this3.logInfo = libSimpleLog;
          _this3.logError = libSimpleLog;

          // Create an object address resolver and map in the functions
          _this3.objectAddressCheckAddressExists = new libObjectAddressCheckAddressExists(_this3.logInfo, _this3.logError);
          _this3.objectAddressGetValue = new libObjectAddressGetValue(_this3.logInfo, _this3.logError);
          _this3.objectAddressSetValue = new libObjectAddressSetValue(_this3.logInfo, _this3.logError);
          _this3.objectAddressDeleteValue = new libObjectAddressDeleteValue(_this3.logInfo, _this3.logError);
          if (!('defaultValues' in _this3.options)) {
            _this3.options.defaultValues = {
              "String": "",
              "Number": 0,
              "Float": 0.0,
              "Integer": 0,
              "PreciseNumber": "0.0",
              "Boolean": false,
              "Binary": 0,
              "DateTime": 0,
              "Array": [],
              "Object": {},
              "Null": null
            };
          }
          if (!('strict' in _this3.options)) {
            _this3.options.strict = false;
          }
          _this3.scope = undefined;
          _this3.elementAddresses = undefined;
          _this3.elementHashes = undefined;
          _this3.elementDescriptors = undefined;
          _this3.reset();
          if (_typeof(_this3.options) === 'object') {
            _this3.loadManifest(_this3.options);
          }
          _this3.schemaManipulations = new libSchemaManipulation(_this3.logInfo, _this3.logError);
          _this3.objectAddressGeneration = new libObjectAddressGeneration(_this3.logInfo, _this3.logError);
          _this3.hashTranslations = new libHashTranslation(_this3.logInfo, _this3.logError);
          _this3.numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
          return _assertThisInitialized(_this3);
        }

        /*************************************************************************
         * Schema Manifest Loading, Reading, Manipulation and Serialization Functions
         */

        // Reset critical manifest properties
        _inherits(Manyfest, _libFableServiceProvi);
        return _createClass(Manyfest, [{
          key: "reset",
          value: function reset() {
            this.scope = 'DEFAULT';
            this.elementAddresses = [];
            this.elementHashes = {};
            this.elementDescriptors = {};
          }
        }, {
          key: "clone",
          value: function clone() {
            // Make a copy of the options in-place
            var tmpNewOptions = JSON.parse(JSON.stringify(this.options));
            var tmpNewManyfest = new Manyfest(this.getManifest(), this.logInfo, this.logError, tmpNewOptions);

            // Import the hash translations
            tmpNewManyfest.hashTranslations.addTranslation(this.hashTranslations.translationTable);
            return tmpNewManyfest;
          }

          // Deserialize a Manifest from a string
        }, {
          key: "deserialize",
          value: function deserialize(pManifestString) {
            // TODO: Add guards for bad manifest string
            return this.loadManifest(JSON.parse(pManifestString));
          }

          // Load a manifest from an object
        }, {
          key: "loadManifest",
          value: function loadManifest(pManifest) {
            if (_typeof(pManifest) !== 'object') {
              this.logError("(".concat(this.scope, ") Error loading manifest; expecting an object but parameter was type ").concat(_typeof(pManifest), "."));
            }
            var tmpManifest = _typeof(pManifest) == 'object' ? pManifest : {};
            var tmpDescriptorKeys = Object.keys(_DefaultConfiguration);
            for (var i = 0; i < tmpDescriptorKeys.length; i++) {
              if (!(tmpDescriptorKeys[i] in tmpManifest)) {
                tmpManifest[tmpDescriptorKeys[i]] = JSON.parse(JSON.stringify(_DefaultConfiguration[tmpDescriptorKeys[i]]));
              }
            }
            if ('Scope' in tmpManifest) {
              if (typeof tmpManifest.Scope === 'string') {
                this.scope = tmpManifest.Scope;
              } else {
                this.logError("(".concat(this.scope, ") Error loading scope from manifest; expecting a string but property was type ").concat(_typeof(tmpManifest.Scope), "."), tmpManifest);
              }
            } else {
              this.logError("(".concat(this.scope, ") Error loading scope from manifest object.  Property \"Scope\" does not exist in the root of the object."), tmpManifest);
            }
            if ('Descriptors' in tmpManifest) {
              if (_typeof(tmpManifest.Descriptors) === 'object') {
                var tmpDescriptionAddresses = Object.keys(tmpManifest.Descriptors);
                for (var _i9 = 0; _i9 < tmpDescriptionAddresses.length; _i9++) {
                  this.addDescriptor(tmpDescriptionAddresses[_i9], tmpManifest.Descriptors[tmpDescriptionAddresses[_i9]]);
                }
              } else {
                this.logError("(".concat(this.scope, ") Error loading description object from manifest object.  Expecting an object in 'Manifest.Descriptors' but the property was type ").concat(_typeof(tmpManifest.Descriptors), "."), tmpManifest);
              }
            } else {
              this.logError("(".concat(this.scope, ") Error loading object description from manifest object.  Property \"Descriptors\" does not exist in the root of the Manifest object."), tmpManifest);
            }
            if ('HashTranslations' in tmpManifest) {
              if (_typeof(tmpManifest.HashTranslations) === 'object') {
                for (var _i10 = 0; _i10 < tmpManifest.HashTranslations.length; _i10++) {
                  // Each translation is 
                }
              }
            }
          }

          // Serialize the Manifest to a string
        }, {
          key: "serialize",
          value: function serialize() {
            return JSON.stringify(this.getManifest());
          }
        }, {
          key: "getManifest",
          value: function getManifest() {
            return {
              Scope: this.scope,
              Descriptors: JSON.parse(JSON.stringify(this.elementDescriptors)),
              HashTranslations: JSON.parse(JSON.stringify(this.hashTranslations.translationTable))
            };
          }

          // Add a descriptor to the manifest
        }, {
          key: "addDescriptor",
          value: function addDescriptor(pAddress, pDescriptor) {
            if (_typeof(pDescriptor) === 'object') {
              // Add the Address into the Descriptor if it doesn't exist:
              if (!('Address' in pDescriptor)) {
                pDescriptor.Address = pAddress;
              }
              if (!(pAddress in this.elementDescriptors)) {
                this.elementAddresses.push(pAddress);
              }

              // Add the element descriptor to the schema
              this.elementDescriptors[pAddress] = pDescriptor;

              // Always add the address as a hash
              this.elementHashes[pAddress] = pAddress;
              if ('Hash' in pDescriptor) {
                // TODO: Check if this is a good idea or not..
                //       Collisions are bound to happen with both representations of the address/hash in here and developers being able to create their own hashes.
                this.elementHashes[pDescriptor.Hash] = pAddress;
              } else {
                pDescriptor.Hash = pAddress;
              }
              return true;
            } else {
              this.logError("(".concat(this.scope, ") Error loading object descriptor for address '").concat(pAddress, "' from manifest object.  Expecting an object but property was type ").concat(_typeof(pDescriptor), "."));
              return false;
            }
          }
        }, {
          key: "getDescriptorByHash",
          value: function getDescriptorByHash(pHash) {
            return this.getDescriptor(this.resolveHashAddress(pHash));
          }
        }, {
          key: "getDescriptor",
          value: function getDescriptor(pAddress) {
            return this.elementDescriptors[pAddress];
          }

          // execute an action function for each descriptor
        }, {
          key: "eachDescriptor",
          value: function eachDescriptor(fAction) {
            var tmpDescriptorAddresses = Object.keys(this.elementDescriptors);
            for (var i = 0; i < tmpDescriptorAddresses.length; i++) {
              fAction(this.elementDescriptors[tmpDescriptorAddresses[i]]);
            }
          }

          /*************************************************************************
           * Beginning of Object Manipulation (read & write) Functions
           */
          // Check if an element exists by its hash
        }, {
          key: "checkAddressExistsByHash",
          value: function checkAddressExistsByHash(pObject, pHash) {
            return this.checkAddressExists(pObject, this.resolveHashAddress(pHash));
          }

          // Check if an element exists at an address
        }, {
          key: "checkAddressExists",
          value: function checkAddressExists(pObject, pAddress) {
            return this.objectAddressCheckAddressExists.checkAddressExists(pObject, pAddress);
          }

          // Turn a hash into an address, factoring in the translation table.
        }, {
          key: "resolveHashAddress",
          value: function resolveHashAddress(pHash) {
            var tmpAddress = undefined;
            var tmpInElementHashTable = (pHash in this.elementHashes);
            var tmpInTranslationTable = (pHash in this.hashTranslations.translationTable);

            // The most straightforward: the hash exists, no translations.
            if (tmpInElementHashTable && !tmpInTranslationTable) {
              tmpAddress = this.elementHashes[pHash];
            }
            // There is a translation from one hash to another, and, the elementHashes contains the pointer end
            else if (tmpInTranslationTable && this.hashTranslations.translate(pHash) in this.elementHashes) {
              tmpAddress = this.elementHashes[this.hashTranslations.translate(pHash)];
            }
            // Use the level of indirection only in the Translation Table
            else if (tmpInTranslationTable) {
              tmpAddress = this.hashTranslations.translate(pHash);
            }
            // Just treat the hash as an address.
            // TODO: Discuss this ... it is magic but controversial
            else {
              tmpAddress = pHash;
            }
            return tmpAddress;
          }

          // Get the value of an element by its hash
        }, {
          key: "getValueByHash",
          value: function getValueByHash(pObject, pHash) {
            var tmpValue = this.getValueAtAddress(pObject, this.resolveHashAddress(pHash));
            if (typeof tmpValue == 'undefined') {
              // Try to get a default if it exists
              tmpValue = this.getDefaultValue(this.getDescriptorByHash(pHash));
            }
            return tmpValue;
          }

          // Get the value of an element at an address
        }, {
          key: "getValueAtAddress",
          value: function getValueAtAddress(pObject, pAddress) {
            var tmpLintedAddress = pAddress.trim();
            if (tmpLintedAddress == '') {
              this.logError("(".concat(this.scope, ") Error getting value at address; address is an empty string."), pObject);
              return undefined;
            }
            var tmpValue = this.objectAddressGetValue.getValueAtAddress(pObject, pAddress);
            if (typeof tmpValue == 'undefined') {
              // Try to get a default if it exists
              tmpValue = this.getDefaultValue(this.getDescriptor(pAddress));
            }
            return tmpValue;
          }

          // Set the value of an element by its hash
        }, {
          key: "setValueByHash",
          value: function setValueByHash(pObject, pHash, pValue) {
            return this.setValueAtAddress(pObject, this.resolveHashAddress(pHash), pValue);
          }

          // Set the value of an element at an address
        }, {
          key: "setValueAtAddress",
          value: function setValueAtAddress(pObject, pAddress, pValue) {
            return this.objectAddressSetValue.setValueAtAddress(pObject, pAddress, pValue);
          }

          // Delete the value of an element by its hash
        }, {
          key: "deleteValueByHash",
          value: function deleteValueByHash(pObject, pHash, pValue) {
            return this.deleteValueAtAddress(pObject, this.resolveHashAddress(pHash), pValue);
          }

          // Delete the value of an element at an address
        }, {
          key: "deleteValueAtAddress",
          value: function deleteValueAtAddress(pObject, pAddress, pValue) {
            return this.objectAddressDeleteValue.deleteValueAtAddress(pObject, pAddress, pValue);
          }

          // Validate the consistency of an object against the schema
        }, {
          key: "validate",
          value: function validate(pObject) {
            var tmpValidationData = {
              Error: null,
              Errors: [],
              MissingElements: []
            };
            if (_typeof(pObject) !== 'object') {
              tmpValidationData.Error = true;
              tmpValidationData.Errors.push("Expected passed in object to be type object but was passed in ".concat(_typeof(pObject)));
            }
            var addValidationError = function addValidationError(pAddress, pErrorMessage) {
              tmpValidationData.Error = true;
              tmpValidationData.Errors.push("Element at address \"".concat(pAddress, "\" ").concat(pErrorMessage, "."));
            };

            // Now enumerate through the values and check for anomalies based on the schema
            for (var i = 0; i < this.elementAddresses.length; i++) {
              var tmpDescriptor = this.getDescriptor(this.elementAddresses[i]);
              var tmpValueExists = this.checkAddressExists(pObject, tmpDescriptor.Address);
              var tmpValue = this.getValueAtAddress(pObject, tmpDescriptor.Address);
              if (typeof tmpValue == 'undefined' || !tmpValueExists) {
                // This will technically mean that `Object.Some.Value = undefined` will end up showing as "missing"
                // TODO: Do we want to do a different message based on if the property exists but is undefined?
                tmpValidationData.MissingElements.push(tmpDescriptor.Address);
                if (tmpDescriptor.Required || this.options.strict) {
                  addValidationError(tmpDescriptor.Address, 'is flagged REQUIRED but is not set in the object');
                }
              }

              // Now see if there is a data type specified for this element
              if (tmpDescriptor.DataType) {
                var tmpElementType = _typeof(tmpValue);
                switch (tmpDescriptor.DataType.toString().trim().toLowerCase()) {
                  case 'string':
                    if (tmpElementType != 'string') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is of the type ").concat(tmpElementType));
                    }
                    break;
                  case "precisenumber":
                    if (tmpElementType != 'string') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is of the type ").concat(tmpElementType));
                    } else if (!this.numberRegex.test(tmpValue)) {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is not a valid number"));
                    }
                    break;
                  case 'number':
                    if (tmpElementType != 'number') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is of the type ").concat(tmpElementType));
                    }
                    break;
                  case 'integer':
                    if (tmpElementType != 'number') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is of the type ").concat(tmpElementType));
                    } else {
                      var tmpValueString = tmpValue.toString();
                      if (tmpValueString.indexOf('.') > -1) {
                        // TODO: Is this an error?
                        addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but has a decimal point in the number."));
                      }
                    }
                    break;
                  case 'float':
                    if (tmpElementType != 'number') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is of the type ").concat(tmpElementType));
                    }
                    break;
                  case 'datetime':
                    var tmpValueDate = new Date(tmpValue);
                    if (tmpValueDate.toString() == 'Invalid Date') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " but is not parsable as a Date by Javascript"));
                    }
                  default:
                    // Check if this is a string, in the default case
                    // Note this is only when a DataType is specified and it is an unrecognized data type.
                    if (tmpElementType != 'string') {
                      addValidationError(tmpDescriptor.Address, "has a DataType ".concat(tmpDescriptor.DataType, " (which auto-converted to String because it was unrecognized) but is of the type ").concat(tmpElementType));
                    }
                    break;
                }
              }
            }
            return tmpValidationData;
          }

          // Returns a default value, or, the default value for the data type (which is overridable with configuration)
        }, {
          key: "getDefaultValue",
          value: function getDefaultValue(pDescriptor) {
            if (_typeof(pDescriptor) != 'object') {
              return undefined;
            }
            if ('Default' in pDescriptor) {
              return pDescriptor.Default;
            } else {
              // Default to a null if it doesn't have a type specified.
              // This will ensure a placeholder is created but isn't misinterpreted.
              var tmpDataType = 'DataType' in pDescriptor ? pDescriptor.DataType : 'String';
              if (tmpDataType in this.options.defaultValues) {
                return this.options.defaultValues[tmpDataType];
              } else {
                // give up and return null
                return null;
              }
            }
          }

          // Enumerate through the schema and populate default values if they don't exist.
        }, {
          key: "populateDefaults",
          value: function populateDefaults(pObject, pOverwriteProperties) {
            return this.populateObject(pObject, pOverwriteProperties,
            // This just sets up a simple filter to see if there is a default set.
            function (pDescriptor) {
              return 'Default' in pDescriptor;
            });
          }

          // Forcefully populate all values even if they don't have defaults.
          // Based on type, this can do unexpected things.
        }, {
          key: "populateObject",
          value: function populateObject(pObject, pOverwriteProperties, fFilter) {
            var _this4 = this;
            // Automatically create an object if one isn't passed in.
            var tmpObject = _typeof(pObject) === 'object' ? pObject : {};
            // Default to *NOT OVERWRITING* properties
            var tmpOverwriteProperties = typeof pOverwriteProperties == 'undefined' ? false : pOverwriteProperties;
            // This is a filter function, which is passed the schema and allows complex filtering of population
            // The default filter function just returns true, populating everything.
            var tmpFilterFunction = typeof fFilter == 'function' ? fFilter : function (pDescriptor) {
              return true;
            };
            this.elementAddresses.forEach(function (pAddress) {
              var tmpDescriptor = _this4.getDescriptor(pAddress);
              // Check the filter function to see if this is an address we want to set the value for.
              if (tmpFilterFunction(tmpDescriptor)) {
                // If we are overwriting properties OR the property does not exist
                if (tmpOverwriteProperties || !_this4.checkAddressExists(tmpObject, pAddress)) {
                  _this4.setValueAtAddress(tmpObject, pAddress, _this4.getDefaultValue(tmpDescriptor));
                }
              }
            });
            return tmpObject;
          }
        }]);
      }(libFableServiceProviderBase);
      ;
      module.exports = Manyfest;
    }, {
      "./Manyfest-HashTranslation.js": 3,
      "./Manyfest-LogToConsole.js": 4,
      "./Manyfest-ObjectAddress-CheckAddressExists.js": 5,
      "./Manyfest-ObjectAddress-DeleteValue.js": 6,
      "./Manyfest-ObjectAddress-GetValue.js": 7,
      "./Manyfest-ObjectAddress-SetValue.js": 9,
      "./Manyfest-ObjectAddressGeneration.js": 10,
      "./Manyfest-SchemaManipulation.js": 12,
      "fable-serviceproviderbase": 1
    }]
  }, {}, [13])(13);
});