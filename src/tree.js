import "./tree.css";
import {core, components} from "react-starter-components";
import React, {PropTypes, Component} from "react";
import Promise from 'bluebird';
import Selection from "selection-manager";
const {common:CommonComponent} = components;
const {SelectableList, SelectableItem, InlinePopupGroup} = CommonComponent;
const {InlinePopup, InlineButton, InlineBody} = InlinePopupGroup;


/*
*@description: React View for Expland and collapse
*/
export const ExpandCollapse =(props)=>{
    let clsName = props.expand ? '' : 'collapsed';
    return <a href="#expand" onClick={props.toggleExpand}><em className={'hitarea  ' + clsName}></em></a>;
}


/**
*@class
*@extends {SelectableList}
*@description: Selectable View for React Tree
*/
export class TreeSelectableList extends SelectableList{
    componentDidMount() {
        let selectionManager = this.props.selectionManager;
        let self = this;
        if (selectionManager) {
            this.unsubscribeSelection = selectionManager.on('change', function (selection, prevSelection) {
                let fullList = _.flatten([selection, prevSelection]);
                _.each(fullList, function (item) {
                    if (item) {
                        self.refs[item.id] && self.refs[item.id].updateSelectionState();
                    }
                })
            });
            this.unsubscribePartialSelection = selectionManager.on('partialSelected', function (selection) {
                self.refs[selection] && self.refs[selection].updatePartialSelection();
            })
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeSelection) {
            this.unsubscribeSelection();
        }

        if (this.unsubscribePartialSelection) {
            this.unsubscribePartialSelection();
        }
    }
}

/*
*@class
*@extends SelectableItem
*@description: TreeView Item
*/
export class TreeItem extends SelectableItem {

    constructor() {
        super(...arguments);
        let {itemData, selectionManager} = this.props;
        this.state = {
            selected: selectionManager.isSelected(itemData),
            partialSelected:this.isPartialSelected()
        }

    }
    componentDidMount() {
        let {itemData, selectionManager} = this.props;
        this.getParentId() && selectionManager.trigger('partialSelected',this.getParentId());
    }

    getAllChildren(itemData){
        return itemData.children;
    }

    selectItem(event) {
        event.preventDefault();
        let {itemData, selectionManager} = this.props;
        if (selectionManager._multiSelect) {
            selectionManager.toggle(itemData);
            if(this.hasChildren()){
                let children = this.getAllChildren(itemData);
                children.forEach(function(v){
                    if(selectionManager.isSelected(itemData)){
                        selectionManager.select(v);
                    }
                    else{
                        selectionManager.deselect(v);
                    }

                });
            }
            this.getParentId() && selectionManager.trigger('partialSelected',this.getParentId());
        } else {
            selectionManager.select(itemData);
        }

    }

    updateSelectionState() {
        let {itemData, selectionManager} = this.props;
        this.setState({
            selected: selectionManager.isSelected(itemData),
            partialSelected:false
        });
    }

    updatePartialSelection(){
        let {itemData, selectionManager} = this.props;
        if(this.isAllChildrenSelected()){
            this.setState({
                partialSelected: false
            });
            selectionManager.select(itemData);
        }
        else {
            selectionManager.deselect(itemData);
            this.setState({
                partialSelected: this.isPartialSelected()
            });
        }
    }

    getTagProps() {
        return {
            className: this.state.selected ? 'active list-item' : (this.state.partialSelected) ? 'partial list-item' :'list-item'
        }
    }

    isPartialSelected(){
        let {itemData, selectionManager} = this.props;
        let children  = this.getAllChildren(itemData);
        if(this.hasChildren()){
            return !selectionManager.isSelected(itemData) && children.filter(function(v){
                return selectionManager.isSelected(v);
            }).length > 0;
        }
    }

    isAllChildrenSelected(){
        let {itemData, selectionManager} = this.props;
        let children  = this.getAllChildren(itemData);
        if(this.hasChildren()){
            return children.length === children.filter(function(v){
                    return selectionManager.isSelected(v);
            }).length;
        }
        return false;
    }

    getChildrenList=()=>{
        var children = this.props.itemData.children;
        return new Promise(resolve => {
            resolve(children);
        });
    }

    hasChildren(){
        return this.props.itemData.hasChild;
    }

    getParentId(){
        return this.props.itemData.parentId;
    }

    renderContent() {
        var itemData = this.props.itemData;
        var ContainerTag = this.props.tagName
        var ClickItemContentTag = SubtreeComponent;
        var tagProps = this.getTagProps();
        return (<ContainerTag {...tagProps} >
            <ClickItemContentTag selectionManager={this.props.selectionManager} onClick={this.selectItem.bind(this)} name={itemData.name} hasChild={this.hasChildren()} getChildrenList={this.getChildrenList}/>
        </ContainerTag>);
    }
}


export const ClickActionItemContent = (props) => {
    return <a href="#select" onClick={props.onClick}><em className="icon"></em> {props.name}</a>
}

/*
*@class SubtreeComponent
*@extends Component
*@desc:SubtreeView React View
*/
export class SubtreeComponent extends Component{
    constructor(props){
        super(props)
        this.props = props;
        this.state = {
            expand:false,
            children:[]
        }
    }
    isOpen(){
        return this.state.expand;
    }
    toggleExpand =(e)=>{
        e.preventDefault(); // if children is there??
        if(this.isOpen()){
            this.setState({expand:false});
        }
        else{
            if(this.props.hasChild){
                let childList = this.props.getChildrenList(); //getChildrenList -->it is deffered,
                childList.then((data)=> {
                    this.setState({expand:true,children:data});
                });
            }
        }
    }
    render(){
        var itemData = this.props;
        if(this.state.expand){
            let configs = {
                ListItem:TreeItem,
                items: this.state.children,
                selectionManager: this.props.selectionManager,
            }
            return <div>
                <ExpandCollapse toggleExpand={this.toggleExpand} expand={this.state.expand}/><ClickActionItemContent onClick={this.props.onClick} name={itemData.name} hasChild={itemData.hasChild}></ClickActionItemContent>
                <div className="subtree"> <TreeSelectableList {...configs}/> </div>
            </div>;
        }
        else {
            if(itemData.hasChild){
                return <div>
                    <ExpandCollapse toggleExpand={this.toggleExpand} expand={this.state.expand}/><ClickActionItemContent onClick={this.props.onClick} name={itemData.name} hasChild={itemData.hasChild}></ClickActionItemContent>
                </div>;
            }
            else{
                return <ClickActionItemContent onClick={this.props.onClick} name={itemData.name} hasChild={itemData.hasChild}></ClickActionItemContent>;
            }
        }

    }
}


/*
*@class Tree
*@extends Component
*@descriptio:React Tree component
*/
export default class Tree extends Component {

    constructor(props){
        super(props);
        let {items: items = [],multiSelect: multiSelect = false,
            selectionManager:selectionManager = new Selection({multiSelect:multiSelect}) ,selectTreeItems:selectTreeItems=[]} = props;
        
        selectTreeItems.forEach(function(v){
            selectionManager.select(v);
        });


        selectionManager.on('change', function (selected, prevSelected) {
            console.log(selected);
        });
        this.multiSelect = multiSelect;
        this.selectionManager = selectionManager;
        this.items = items;
        this.state= {
            items:items,
            searchText:'',
            selected:selectionManager.getSelected()
        };
    }

    onChange =(e)=>{
        console.log(e);
    }
    render(){
        const items = this.state.items;
        let {ListItem: ListItem = TreeItem,
            showSearch: showSearch = false} = this.props;
        let listClassName = this.multiSelect ? 'multi-select-list' : 'single-select-list';
        const configs = {
            ListItem: ListItem,
            items: items,
            selectionManager: this.selectionManager,
            className: 'item-list ' + listClassName,
            noDataMessage: 'No record found'
        }

        return <div className="tree">
                <TreeSelectableList {...configs}/>
            </div>;
    }

}

Tree.propTypes = {
    items:PropTypes.array.isRequired,
    ListItem:PropTypes.object,
    showsearch:PropTypes.bool,
    multiSelect:PropTypes.bool,
    selectTreeItems:PropTypes.array,
    selectionManager: PropTypes.object
}
