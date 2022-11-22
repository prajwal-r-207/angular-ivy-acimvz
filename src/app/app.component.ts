import { Component } from '@angular/core';
import { Orientation, IECONode, ECONode, ECOTree } from './econode';
import { TreeViewComponent } from './tree-view.component';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  Orientation = Orientation;
  nodeSelected: ECONode = null;

  data: IECONode = {
    data: { id: 1 },
    linkColor: 'red',
    background: 'red',
    color: 'white',
    selected: true,
    children: [
      {
        data: { id: 2 },
        linkColor: 'pink',
        background: 'pink',
        color: 'white',
        selected: true,
      },
      { data: { id: 3 }, selected: true },
      {
        data: { id: 4 },
        linkColor: 'orange',
        background: 'orange',
        color: 'white',
        selected: true
      },
    ],
  };
  selectSlibingNodes(treeView: TreeViewComponent, node: ECONode) {
    if (node == this.nodeSelected) {
      this.nodeSelected = null;
      treeView.nodes.forEach((x) => {
        x.isSelected = false;
      });
    } else {
      this.nodeSelected = node;
      const nodes = treeView.getSlibingNodes(node).map((x) => x.id);
      treeView.nodes.forEach((x) => {
        x.isSelected = x.id == node.id || nodes.indexOf(x.id) >= 0;
      });
    }
  }
}
