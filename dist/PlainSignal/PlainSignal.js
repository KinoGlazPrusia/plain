"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlainSignal = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PlainSignal = exports.PlainSignal = /*#__PURE__*/function () {
  function PlainSignal() {
    _classCallCheck(this, PlainSignal);
    this.registered = {};
  }
  return _createClass(PlainSignal, [{
    key: "register",
    value: function register(signal) {
      if (!this.registered[signal]) this.registered[signal] = [];else throw new Error("'".concat(signal, "' signal already exists."));
    }
  }, {
    key: "emit",
    value: function emit(signal) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var connections = this.registered[signal];
      connections.forEach(function (conn) {
        args ? conn.callback(args) : conn.callback();
      });
    }
  }, {
    key: "connect",
    value: function connect(emitter, signal, callback) {
      if (!emitter.signals.registered[signal]) {
        throw new Error("".concat(emitter, ":'").concat(signal, "' signal does not exist."));
      } else {
        emitter.signals.registered[signal].push({
          element: this,
          callback: callback
        });
      }
    }
  }]);
}();