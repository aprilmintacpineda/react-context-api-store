'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StoreContext = _react2.default.createContext();

var connect = function connect(wantedState, wantedMutators) {
  return function (WrappedComponent) {
    return function (_React$Component) {
      _inherits(Connect, _React$Component);

      function Connect() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Connect);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Connect.__proto__ || Object.getPrototypeOf(Connect)).call.apply(_ref, [this].concat(args))), _this), _this.dispatcher = function (updateStore, storeState, action) {
          return function () {
            for (var _len2 = arguments.length, payload = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              payload[_key2] = arguments[_key2];
            }

            return action.apply(undefined, [{
              state: _extends({}, storeState),
              updateStore: updateStore
            }].concat(payload));
          };
        }, _this.mapStateToProps = function (storeState) {
          return wantedState ? wantedState(_extends({}, storeState)) : {};
        }, _this.mapActionsToProps = function (updateState, storeState) {
          return wantedMutators ? Object.keys(wantedMutators).reduce(function (accumulatedMutators, mutator) {
            return _extends({}, accumulatedMutators, _defineProperty({}, mutator, _this.dispatcher(updateState, storeState, wantedMutators[mutator])));
          }, {}) : {};
        }, _this.render = function () {
          return _react2.default.createElement(
            StoreContext.Consumer,
            null,
            function (context) {
              return _react2.default.createElement(WrappedComponent, _extends({}, _this.mapStateToProps(context.state), _this.mapActionsToProps(context.updateState, context.state), _this.props));
            }
          );
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      return Connect;
    }(_react2.default.Component);
  };
};

var Provider = function (_React$Component2) {
  _inherits(Provider, _React$Component2);

  function Provider() {
    var _ref2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Provider);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = Provider.__proto__ || Object.getPrototypeOf(Provider)).call.apply(_ref2, [this].concat(args))), _this2), _this2.state = _extends({}, _this2.props.store), _this2.persisted = false, _this2.updateState = function (updatedState) {
      var newState = _extends({}, _this2.state, updatedState);

      _this2.setState(newState);

      if (_this2.props.persist !== false) {
        _this2.props.persist.storage.removeItem(_this2.props.persist.key || 'react-context-api-store');
        _this2.props.persist.storage.setItem(_this2.props.persist.key || 'react-context-api-store', JSON.stringify(newState));
      }
    }, _this2.render = function () {
      return _react2.default.createElement(
        StoreContext.Provider,
        { value: {
            state: _extends({}, _this2.state),
            updateState: _this2.updateState
          } },
        _this2.props.children
      );
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Provider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.persist !== false && !this.persisted) {
        this.persisted = true;
        var savedStore = this.props.persist.storage.getItem(this.props.persist.key || 'react-context-api-store');

        this.updateState(savedStore ? this.props.persist.statesToPersist(JSON.parse(savedStore)) : {});
      }
    }
  }]);

  return Provider;
}(_react2.default.Component);

;

Provider.propTypes = {
  children: _propTypes2.default.element.isRequired,
  store: _propTypes2.default.object.isRequired,
  persist: _propTypes2.default.oneOfType([_propTypes2.default.shape({
    storage: _propTypes2.default.object.isRequired,
    statesToPersist: _propTypes2.default.func.isRequired,
    saveInitialState: _propTypes2.default.bool,
    key: _propTypes2.default.string
  }), _propTypes2.default.oneOf([false])])
};

Provider.defaultProps = {
  persist: false
};

exports.connect = connect;
exports.default = Provider;