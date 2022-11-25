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

    children: [
      {
        data: { id: 1 },
      },
      { data: { id: '2' } },
      {
        data: { id: 3 },
      },
    ],
  };
  data2: IECONode = {
    data: { id: `data2 (2)` },
    children: [
      {
        data: { id: 1 }
      },
      { data: { id: 2 }},
    ],
  };
  data3: IECONode = {
    data: { id: `data3 (4)` },
    children: [
      {
        data: { id: 1 }
      },
      { data: { id: 2 }},
      { data: { id: 3 }},
      { data: { id: 4 }},
    ],
  };
  data4: IECONode = {
    data: { id: `data4 (5)` },
    children: [
      {
        data: { id: 1 }
      },
      { data: { id: 2 }},
      { data: { id: 3 }},
      { data: { id: 4 }},
      { data: { id: 5 }},
    ],
  };
  data5: IECONode = {
    data: { id: `data5 (1)` },
    children: [
      {
        data: { id: 1 }
      },

    ],
  };
  
  dataArray:IECONode[] = [this.data,this.data2,this.data3,this.data4,this.data5]
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
