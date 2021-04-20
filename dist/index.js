"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Provider = Provider;
exports.useEventManager = useEventManager;
exports.connectToEventManager = connectToEventManager;
exports.bindListeners = bindListeners;
exports.removeBoundListeners = removeBoundListeners;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventManager = function () {
  function EventManager() {
    _classCallCheck(this, EventManager);
  }

  _createClass(EventManager, [{
    key: "addEventCondition",


    /*
     * Event Conditions
     ********************/
    value: function addEventCondition(event_type, event_condition) {
      if (typeof event_condition != "function") return;

      this.__getEvents(event_type).conditions.push(event_condition);
    }
  }, {
    key: "removeEventCondition",
    value: function removeEventCondition(event_type, event_condition) {
      var index = this.__getEvents(event_type).conditions.indexOf(event_condition);

      if (index >= 0) this.__getEvents(event_type).conditions.splice(index, 1);
    }

    /*
     * Event Listeners
     **********************/

  }, {
    key: "addEventListener",
    value: function addEventListener(event_type, event_listener) {
      if (typeof event_listener != "function") return;

      this.__getEvents(event_type).listeners.push(event_listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event_type, event_listener) {
      var index = this.__getEvents(event_type).listeners.indexOf(event_listener);

      if (index >= 0) this.__getEvents(event_type).listeners.splice(index, 1);
    }

    /*  
     * Call the event listener
     ***************************/

  }, {
    key: "applyEventListeners",
    value: function applyEventListeners(event_type, event_data) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.__getEvents(event_type).conditions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var event_condition = _step.value;

          if (!event_condition(event_data)) return;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.__getEvents(event_type).listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var event_listener = _step2.value;

          event_listener(event_data);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "removeAllEventListeners",
    value: function removeAllEventListeners(event_type) {
      var event = __getEvents(event_type);
      event.conditions.length = 0;
      event.listeners.length = 0;

      delete this.events[event_type];
    }
  }, {
    key: "__getEvents",
    value: function __getEvents(event_type) {
      if (!this.events) this.events = {};

      if (!this.events[event_type]) this.events[event_type] = { conditions: [], listeners: [] };

      return this.events[event_type];
    }
  }]);

  return EventManager;
}();

var EventContext = _react2.default.createContext(new EventManager());

function Provider(props) {
  var events = new EventManager();

  return _react2.default.createElement(EventContext.Provider, { value: events }, props.children);
}

function useEventManager() {
  return _react2.default.useContext(EventContext);
}

function connectToEventManager(Component) {
  return function (props) {
    var children = function children(events) {
      return _react2.default.createElement(Component, Object.assign({ events: events }, props));
    };
    return _react2.default.createElement(EventContext.Consumer, null, children);
  };
}

var METHOD_TYPES = ["conditions", "listeners"];
function ensureBoundObject(listeners) {
  // It can only be a function, an object or an array. Otherwise, it's wrong
  if (!["function", "object"].includes(typeof listeners === "undefined" ? "undefined" : _typeof(listeners))) return { conditions: [], listeners: []

    // If it's a function, we're going to make it an array
  };if (typeof listeners == "function") listeners = [listeners];

  // Now we're going to handle it not being a non-array object. 
  // The onlt other thing it could be is an array. So in that case
  // we'll turn it into an object
  if (Array.isArray(listeners)) listeners = { listeners: listeners

    // Now we are going to ensure the event object properly
  };var event = listeners;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = METHOD_TYPES[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var attr = _step3.value;

      // If the attribute is a function, make it an array
      if (typeof event[attr] == "function") event[attr] = [event[attr]];

      // If the attribute is not an array, then I don't care about it
      if (!Array.isArray(event[attr])) event[attr] = [];

      // Ensure every element inside the array is a function
      event[attr] = event[attr].filter(function (method) {
        return typeof method == "function";
      });
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return event;
}

function bindListeners(event_manager, context, listeners) {
  var bound_listeners = { manager: event_manager };

  for (var event_type in listeners) {
    var event = ensureBoundObject(listeners[event_type]);

    bound_listeners[event_type] = {};
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = METHOD_TYPES[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var method_type = _step4.value;

        bound_listeners[event_type][method_type] = event[method_type].map(function (method) {
          return method.bind(context);
        });
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = bound_listeners[event_type].conditions[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var method = _step5.value;

        event_manager.addEventCondition(event_type, method);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = bound_listeners[event_type].listeners[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _method = _step6.value;

        event_manager.addEventListener(event_type, _method);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }

  return bound_listeners;
}

function removeBoundListeners(bound_listeners) {
  var event_manager = bound_listeners.manager;

  for (var event_type in bound_listeners) {
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = bound_listeners[event_type].conditions[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var event_condition = _step7.value;

        event_manager.removeEventCondition(event_type, event_condition);
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    bound_listeners[event_type].conditions = 0;

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = bound_listeners[event_type].listeners[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var event_listener = _step8.value;

        event_manager.removeEventListener(event_type, event_listener);
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }

    bound_listeners[event_type].listeners = 0;
    delete bound_listeners[event_type];
  }

  delete bound_listeners.manager;
}