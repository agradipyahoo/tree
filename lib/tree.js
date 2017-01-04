"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SubtreeComponent = exports.ClickActionItemContent = exports.TreeItem = exports.TreeSelectableList = exports.ExpandCollapse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./tree.css");

var _reactStarterComponents = require("react-starter-components");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _selectionManager = require("selection-manager");

var _selectionManager2 = _interopRequireDefault(_selectionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommonComponent = _reactStarterComponents.components.common;
var SelectableList = CommonComponent.SelectableList,
    SelectableItem = CommonComponent.SelectableItem,
    InlinePopupGroup = CommonComponent.InlinePopupGroup;
var InlinePopup = InlinePopupGroup.InlinePopup,
    InlineButton = InlinePopupGroup.InlineButton,
    InlineBody = InlinePopupGroup.InlineBody;

/*
*@description: React View for Expland and collapse
*/

var ExpandCollapse = exports.ExpandCollapse = function ExpandCollapse(props) {
    var clsName = props.expand ? '' : 'collapsed';
    return _react2.default.createElement(
        "a",
        { href: "#expand", onClick: props.toggleExpand },
        _react2.default.createElement("em", { className: 'hitarea  ' + clsName })
    );
};

/**
*@class
*@extends {SelectableList}
*@description: Selectable View for React Tree
*/

var TreeSelectableList = exports.TreeSelectableList = function (_SelectableList) {
    _inherits(TreeSelectableList, _SelectableList);

    function TreeSelectableList() {
        _classCallCheck(this, TreeSelectableList);

        return _possibleConstructorReturn(this, (TreeSelectableList.__proto__ || Object.getPrototypeOf(TreeSelectableList)).apply(this, arguments));
    }

    _createClass(TreeSelectableList, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var selectionManager = this.props.selectionManager;
            var self = this;
            if (selectionManager) {
                this.unsubscribeSelection = selectionManager.on('change', function (selection, prevSelection) {
                    var fullList = _.flatten([selection, prevSelection]);
                    _.each(fullList, function (item) {
                        if (item) {
                            self.refs[item.id] && self.refs[item.id].updateSelectionState();
                        }
                    });
                });
                this.unsubscribePartialSelection = selectionManager.on('partialSelected', function (selection) {
                    self.refs[selection] && self.refs[selection].updatePartialSelection();
                });
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            if (this.unsubscribeSelection) {
                this.unsubscribeSelection();
            }

            if (this.unsubscribePartialSelection) {
                this.unsubscribePartialSelection();
            }
        }
    }]);

    return TreeSelectableList;
}(SelectableList);

/*
*@class
*@extends SelectableItem
*@description: TreeView Item
*/


var TreeItem = exports.TreeItem = function (_SelectableItem) {
    _inherits(TreeItem, _SelectableItem);

    function TreeItem() {
        _classCallCheck(this, TreeItem);

        var _this2 = _possibleConstructorReturn(this, (TreeItem.__proto__ || Object.getPrototypeOf(TreeItem)).apply(this, arguments));

        _this2.getChildrenList = function () {
            var children = _this2.props.itemData.children;
            return new _bluebird2.default(function (resolve) {
                resolve(children);
            });
        };

        var _this2$props = _this2.props,
            itemData = _this2$props.itemData,
            selectionManager = _this2$props.selectionManager;

        _this2.state = {
            selected: selectionManager.isSelected(itemData),
            partialSelected: _this2.isPartialSelected()
        };

        return _this2;
    }

    _createClass(TreeItem, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _props = this.props,
                itemData = _props.itemData,
                selectionManager = _props.selectionManager;

            this.getParentId() && selectionManager.trigger('partialSelected', this.getParentId());
        }
    }, {
        key: "getAllChildren",
        value: function getAllChildren(itemData) {
            return itemData.children;
        }
    }, {
        key: "selectItem",
        value: function selectItem(event) {
            event.preventDefault();
            var _props2 = this.props,
                itemData = _props2.itemData,
                selectionManager = _props2.selectionManager;

            if (selectionManager._multiSelect) {
                selectionManager.toggle(itemData);
                if (this.hasChildren()) {
                    var children = this.getAllChildren(itemData);
                    children.forEach(function (v) {
                        if (selectionManager.isSelected(itemData)) {
                            selectionManager.select(v);
                        } else {
                            selectionManager.deselect(v);
                        }
                    });
                }
                this.getParentId() && selectionManager.trigger('partialSelected', this.getParentId());
            } else {
                selectionManager.select(itemData);
            }
        }
    }, {
        key: "updateSelectionState",
        value: function updateSelectionState() {
            var _props3 = this.props,
                itemData = _props3.itemData,
                selectionManager = _props3.selectionManager;

            this.setState({
                selected: selectionManager.isSelected(itemData),
                partialSelected: false
            });
        }
    }, {
        key: "updatePartialSelection",
        value: function updatePartialSelection() {
            var _props4 = this.props,
                itemData = _props4.itemData,
                selectionManager = _props4.selectionManager;

            if (this.isAllChildrenSelected()) {
                this.setState({
                    partialSelected: false
                });
                selectionManager.select(itemData);
            } else {
                selectionManager.deselect(itemData);
                this.setState({
                    partialSelected: this.isPartialSelected()
                });
            }
        }
    }, {
        key: "getTagProps",
        value: function getTagProps() {
            return {
                className: this.state.selected ? 'active list-item' : this.state.partialSelected ? 'partial list-item' : 'list-item'
            };
        }
    }, {
        key: "isPartialSelected",
        value: function isPartialSelected() {
            var _props5 = this.props,
                itemData = _props5.itemData,
                selectionManager = _props5.selectionManager;

            var children = this.getAllChildren(itemData);
            if (this.hasChildren()) {
                return !selectionManager.isSelected(itemData) && children.filter(function (v) {
                    return selectionManager.isSelected(v);
                }).length > 0;
            }
        }
    }, {
        key: "isAllChildrenSelected",
        value: function isAllChildrenSelected() {
            var _props6 = this.props,
                itemData = _props6.itemData,
                selectionManager = _props6.selectionManager;

            var children = this.getAllChildren(itemData);
            if (this.hasChildren()) {
                return children.length === children.filter(function (v) {
                    return selectionManager.isSelected(v);
                }).length;
            }
            return false;
        }
    }, {
        key: "hasChildren",
        value: function hasChildren() {
            return this.props.itemData.hasChild;
        }
    }, {
        key: "getParentId",
        value: function getParentId() {
            return this.props.itemData.parentId;
        }
    }, {
        key: "renderContent",
        value: function renderContent() {
            var itemData = this.props.itemData;
            var ContainerTag = this.props.tagName;
            var ClickItemContentTag = SubtreeComponent;
            var tagProps = this.getTagProps();
            return _react2.default.createElement(
                ContainerTag,
                tagProps,
                _react2.default.createElement(ClickItemContentTag, { selectionManager: this.props.selectionManager, onClick: this.selectItem.bind(this), name: itemData.name, hasChild: this.hasChildren(), getChildrenList: this.getChildrenList })
            );
        }
    }]);

    return TreeItem;
}(SelectableItem);

var ClickActionItemContent = exports.ClickActionItemContent = function ClickActionItemContent(props) {
    return _react2.default.createElement(
        "a",
        { href: "#select", onClick: props.onClick },
        _react2.default.createElement("em", { className: "icon" }),
        " ",
        props.name
    );
};

/*
*@class SubtreeComponent
*@extends Component
*@desc:SubtreeView React View
*/

var SubtreeComponent = exports.SubtreeComponent = function (_Component) {
    _inherits(SubtreeComponent, _Component);

    function SubtreeComponent(props) {
        _classCallCheck(this, SubtreeComponent);

        var _this3 = _possibleConstructorReturn(this, (SubtreeComponent.__proto__ || Object.getPrototypeOf(SubtreeComponent)).call(this, props));

        _this3.toggleExpand = function (e) {
            e.preventDefault(); // if children is there??
            if (_this3.isOpen()) {
                _this3.setState({ expand: false });
            } else {
                if (_this3.props.hasChild) {
                    var childList = _this3.props.getChildrenList(); //getChildrenList -->it is deffered,
                    childList.then(function (data) {
                        _this3.setState({ expand: true, children: data });
                    });
                }
            }
        };

        _this3.props = props;
        _this3.state = {
            expand: false,
            children: []
        };
        return _this3;
    }

    _createClass(SubtreeComponent, [{
        key: "isOpen",
        value: function isOpen() {
            return this.state.expand;
        }
    }, {
        key: "render",
        value: function render() {
            var itemData = this.props;
            if (this.state.expand) {
                var configs = {
                    ListItem: TreeItem,
                    items: this.state.children,
                    selectionManager: this.props.selectionManager
                };
                return _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(ExpandCollapse, { toggleExpand: this.toggleExpand, expand: this.state.expand }),
                    _react2.default.createElement(ClickActionItemContent, { onClick: this.props.onClick, name: itemData.name, hasChild: itemData.hasChild }),
                    _react2.default.createElement(
                        "div",
                        { className: "subtree" },
                        " ",
                        _react2.default.createElement(TreeSelectableList, configs),
                        " "
                    )
                );
            } else {
                if (itemData.hasChild) {
                    return _react2.default.createElement(
                        "div",
                        null,
                        _react2.default.createElement(ExpandCollapse, { toggleExpand: this.toggleExpand, expand: this.state.expand }),
                        _react2.default.createElement(ClickActionItemContent, { onClick: this.props.onClick, name: itemData.name, hasChild: itemData.hasChild })
                    );
                } else {
                    return _react2.default.createElement(ClickActionItemContent, { onClick: this.props.onClick, name: itemData.name, hasChild: itemData.hasChild });
                }
            }
        }
    }]);

    return SubtreeComponent;
}(_react.Component);

/*
*@class Tree
*@extends Component
*@descriptio:React Tree component
*/


var Tree = function (_Component2) {
    _inherits(Tree, _Component2);

    function Tree(props) {
        _classCallCheck(this, Tree);

        var _this4 = _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, props));

        _this4.onChange = function (e) {
            console.log(e);
        };

        var _props$items = props.items,
            items = _props$items === undefined ? [] : _props$items,
            _props$multiSelect = props.multiSelect,
            multiSelect = _props$multiSelect === undefined ? false : _props$multiSelect,
            _props$selectionManag = props.selectionManager,
            selectionManager = _props$selectionManag === undefined ? new _selectionManager2.default({ multiSelect: multiSelect }) : _props$selectionManag,
            _props$selectTreeItem = props.selectTreeItems,
            selectTreeItems = _props$selectTreeItem === undefined ? [] : _props$selectTreeItem;


        selectTreeItems.forEach(function (v) {
            selectionManager.select(v);
        });

        selectionManager.on('change', function (selected, prevSelected) {
            console.log(selected);
        });
        _this4.multiSelect = multiSelect;
        _this4.selectionManager = selectionManager;
        _this4.items = items;
        _this4.state = {
            items: items,
            searchText: '',
            selected: selectionManager.getSelected()
        };
        return _this4;
    }

    _createClass(Tree, [{
        key: "render",
        value: function render() {
            var items = this.state.items;
            var _props7 = this.props,
                _props7$ListItem = _props7.ListItem,
                ListItem = _props7$ListItem === undefined ? TreeItem : _props7$ListItem,
                _props7$showSearch = _props7.showSearch,
                showSearch = _props7$showSearch === undefined ? false : _props7$showSearch;

            var listClassName = this.multiSelect ? 'multi-select-list' : 'single-select-list';
            var configs = {
                ListItem: ListItem,
                items: items,
                selectionManager: this.selectionManager,
                className: 'item-list ' + listClassName,
                noDataMessage: 'No record found'
            };

            return _react2.default.createElement(
                "div",
                { className: "tree" },
                _react2.default.createElement(TreeSelectableList, configs)
            );
        }
    }]);

    return Tree;
}(_react.Component);

exports.default = Tree;


Tree.propTypes = {
    items: _react.PropTypes.array.isRequired,
    ListItem: _react.PropTypes.object,
    showsearch: _react.PropTypes.bool,
    multiSelect: _react.PropTypes.bool,
    selectTreeItems: _react.PropTypes.array,
    selectionManager: _react.PropTypes.object
};