import { Component } from '@angular/core';
import {  IECONode, ECONode, ECOTree } from './econode';
import { TreeViewComponent } from './tree-view.component';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  nodeSelected: ECONode = null;

  data: IECONode = {
    data: { id: `data1 (3)` },
    selected: true,
    children: [
      {
        data: { id: 1 },
        selected: true,
      },
      { data: { id: '2' }, selected: true },
      {
        data: { id: 3 },
        selected: true
      },
    ],
  };
  data2: IECONode = {
    data: { id: `data2 (2)` },
    selected: true,
    children: [
      {
        data: { id: 4 },
        selected: true,
      },
      { data: { id: 5 }, selected: true },
    ],
  };
  
  dataArray:IECONode[] = [this.data,this.data2]
  // selectSlibingNodes(treeView: TreeViewComponent, node: ECONode) {
  //   console.log(treeView)
  //   console.log(node)
  //   if (node == this.nodeSelected) {
  //     this.nodeSelected = null;
  //     treeView.nodes.forEach((x) => {
  //       x.isSelected = false;
  //     });
  //   } else {
  //     this.nodeSelected = node;
  //     const nodes = treeView.getSlibingNodes(node).map((x) => x.id);
  //     treeView.nodes.forEach((x) => {
  //       x.isSelected = x.id == node.id || nodes.indexOf(x.id) >= 0;
  //     });
  //   }
  // }
}
