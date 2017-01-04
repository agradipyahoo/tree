# tree
React Multi Level Tree component

Basic useful feature list:

 * Expand and collapsing tree
 * Supporting partial selection
 * Select all children when parent is selected
 * Preload Tree State
 * TODO: Search and select
 * TODO:Selecting particular item into tree and scroll into the item
 * TODO:Unit test cases.


 ```javascript
    import Tree from "tree";
    import React, {PropTypes, Component} from "react";
    import ReactDOM from 'react-dom';
    let app = document.getElementById('app');
    const  items = [] ;let i=1 ,item;
        while(i <1000){
            items.push({id:i,name:'item '+i});
            i++;
        }

        const treeList = [] ;
        let children = [] ,hasChild,n=0;
        i =1;
        while (i<30){

            item = {id:i,name:'state' +i, hasChild:false};
            if(i%5 ===0){
                children = []
                for(let j=i;j<i+5;j++){
                    if(j%5===0){
                        let subchild =[]
                        for(n=j;n<j+5;n++){
                            subchild.push({id:'sc'+n,name:'carrier'+n,parentId:'c'+j})
                        }    
                        children.push({id:'c'+j,name:'city'+j,parentId:i,hasChild:true,children:subchild});
                    }
                    else{
                        children.push({id:'c'+j,name:'city'+j,parentId:i});
                    }


                }
                item = {...item,hasChild:true,children:children}
            }
            treeList.push(item);
            i++;
        }

        let selectTreeItems =[];
        selectTreeItems.push({id:1,name:'state' + 1});
        selectTreeItems.push({id:2,name:'state' + 2});
        selectTreeItems.push({id:3,name:'state' + 3});
        selectTreeItems.push({id:4,name:'state' + 4});
        selectTreeItems.push({id:5,name:'state' + 5});
        selectTreeItems.push({id:'c5',name:'city' + 5});
        selectTreeItems.push({id:'sc5',name:'carrier' + 5});


    ReactDOM.render(<Tree showSearch={true} selectTreeItems={selectTreeItems} items={treeList} multiSelect={true}></Tree>,app)

 ```
