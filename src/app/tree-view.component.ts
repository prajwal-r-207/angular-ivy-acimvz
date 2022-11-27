import { Component, Input, TemplateRef } from '@angular/core';
import { ECOTree, ECONode, Search, Select } from './econode';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styles: [
    `
  .item{
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  background-color:white;
  overflow: hidden;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
  border-radius:5px;
  
}
.tree{
  position:relative;
}
.treeLink {
	stroke: silver;
  fill:transparent;
}
  `,
  ],
})
export class TreeViewComponent {
  expand: boolean = false;
  hasChildren(node) {
    if (node.nodeChildren.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  onClick(node: any, tree: ECOTree) {
    console.log(node.isCollapsed);
    console.log('is ancestor collapsed')
    console.log(node._isAncestorCollapsed())
    node.isCollapsed = !node.isCollapsed
    // this.treeArray[0].height = 80
    // this.treeArray[1].height = 10
    // this.treeArray[2].height = 40
    // this.treeArray[3].height = 150
    // this.treeArray[4].height = 100
    // tree.width =242 ;
    // tree.height = 5;
  }
  @Input() template: TemplateRef<any>;
  @Input() set data(value) {
    console.log('value')
    console.log(value)
    // console.log(this.tree)
    // for
    value.forEach((x)=>{
      let tree  = new ECOTree();
    this.addNodes(tree, x);
    tree.UpdateTree()
    this.treeArray.push(tree)
    console.log(this.treeArray)
    })
    
    // console.log(this.treeArray)
  }
  // update() {
  //   this.tree.UpdateTree();
  // }
  // get config() {
  //   return this.tree.config;
  // }
  // get nodes() {
  //   return this.tree.nDatabaseNodes;
  // }
  
  treeArray:ECOTree[]=[];

  
  // getChildren(node:ECONode,nodes:ECONode[]=[])
  // {
  //    const children=node.nodeChildren;
  //    if (children && children.length){
  //       nodes=[...nodes,...children]
  //       children.forEach(x=>{
  //         nodes=this.getChildren(x,nodes)
  //       })
  //    }
  //    return nodes
  // }
  // getParent(node:ECONode,nodes:ECONode[]=[])
  // {
  //    if (node.nodeParent){
  //       nodes=[...nodes,node.nodeParent]
  //       nodes=this.getParent(node.nodeParent,nodes)
  //    }
  //    return nodes
  // }

  // getSlibingNodes(node:ECONode){
  //   console.log([...this.getChildren(node)])
  //    return [...this.getParent(node),...this.getChildren(node)]
  // }

  private addNodes(tree: ECOTree, node: any, parent: any = null) {
    parent = parent || {
      id: -1,
      width: null,
      height: null,
      color: null,
      background: null,
      linkColor: null,
    };
    node.width = node.width || parent.width;
    node.height = node.height || parent.height;
    node.color = node.color || parent.color;
    node.background = node.background || parent.background;
    node.id = tree.nDatabaseNodes.length;
    tree.add(
      node.id,
      parent.id,
      node.title,
      node.width,
      node.height,
      node.color,
      node.background,
      node.data,
      node.selected
    );
    if (node.children) {
      node.children.forEach((x: any) => {
        this.addNodes(tree, x, node);
      });
    }
  }
}
