/*This code go from an article written some time ago (nov 2006) by Emilio Cortegoso Lobato:
 https://www.codeproject.com/Articles/16192/Graphic-JavaScript-Tree-with-Layout

Please, don't remove the comment
 */
export interface IECONode {
  data: any;
  width?: number;
  height?: number;
  children?: IECONode[];
  selected?: boolean;
}

export enum Fill {
  NF_GRADIENT,
  NF_FLAT,
}
export enum Colorize {
  CS_NODE,
  CS_LEVEL,
}
//Search method: Title, metadata or both
export enum Search {
  SM_DSC,
  SM_META,
  SM_BOTH,
}
//Selection mode: single, multiple, no selection
export enum Select {
  SL_MULTIPLE,
  SL_SINGLE,
  SL_NONE,
}

export class ECONode {
  id;
  pid;
  dsc;
  w;
  h;
  c;
  bc;
  data;

  siblingIndex = 0;
  dbIndex = 0;

  XPosition = 0;
  YPosition = 0;
  prelim = 0;
  modifier = 0;
  leftNeighbor = null;
  rightNeighbor = null;
  nodeParent: ECONode = null;
  nodeChildren: ECONode[] = [];

  isCollapsed = false;
  canCollapse = false;

  isSelected = false;

  constructor(id, pid, dsc, w, h, c, bc, meta) {
    this.id = id;
    this.pid = pid;
    this.dsc = dsc;
    this.w = w;
    this.h = h;
    this.c = c;
    this.bc = bc;

    this.data = meta;

    this.siblingIndex = 0;
    this.dbIndex = 0;

    this.XPosition = 0;
    this.YPosition = 0;
    this.prelim = 0;
    this.modifier = 0;
    this.leftNeighbor = null;
    this.rightNeighbor = null;
    this.nodeParent = null;
    this.nodeChildren = [];

    this.isCollapsed = false;
    this.canCollapse = false;

    this.isSelected = false;
  }

  // _getLevel() {
  //   if (this.nodeParent.id == -1) {
  //     return 0;
  //   } else return this.nodeParent._getLevel() + 1;
  // }

  _isAncestorCollapsed() {
    if (this.nodeParent.isCollapsed) {
      return true;
    } else {
      if (this.nodeParent.id == -1) {
        return false;
      } else {
        return this.nodeParent._isAncestorCollapsed();
      }
    }
  }

  _setAncestorsExpanded() {
    if (this.nodeParent.id == -1) {
      return;
    } else {
      this.nodeParent.isCollapsed = false;
      return this.nodeParent._setAncestorsExpanded();
    }
  }

  _getChildrenCount() {
    if (this.isCollapsed) return 0;
    if (this.nodeChildren == null) return 0;
    else return this.nodeChildren.length;
  }

  _getLeftSibling() {
    if (
      this.leftNeighbor != null &&
      this.leftNeighbor.nodeParent == this.nodeParent
    )
      return this.leftNeighbor;
    else return null;
  }

  _getRightSibling() {
    if (
      this.rightNeighbor != null &&
      this.rightNeighbor.nodeParent == this.nodeParent
    )
      return this.rightNeighbor;
    else return null;
  }

  _getChildAt(i) {
    return this.nodeChildren[i];
  }

  _getChildrenCenter(tree) {
    const node = this._getFirstChild();
    const node1 = this._getLastChild();
    return (
      node.prelim + (node1.prelim - node.prelim + tree._getNodeSize(node1)) / 2
    );
  }

  _getFirstChild() {
    return this._getChildAt(0);
  }

  _getLastChild() {
    return this._getChildAt(this._getChildrenCount() - 1);
  }

  _drawChildrenLinks(tree) {
    let s = [];
    let xa = 0,
      ya = 0,
      xb = 0,
      yb = 0,
      xc = 0,
      yc = 0,
      xd = 0,
      yd = 0;
    let node1 = null;

    xa = this.XPosition + this.w;
    ya = this.YPosition + this.h / 2;
    // console.log('xa')
    // console.log(xa)
    // console.log('ya')
    // console.log(ya)
    const nodesSorted = this.nodeChildren.sort((a, b) =>
      a.isSelected && !b.isSelected ? 1 : -1
    );
    for (let k = 0; k < nodesSorted.length; k++) {
      node1 = nodesSorted[k];

      xd = node1.XPosition;
      yd = yc = node1.YPosition + node1.h / 2;
      yb = ya;

      xb = xc = xd - tree.config.iLevelSeparation / 2;

      // switch (tree.config.linkType) {
      //   case "M":
      //     s.push(
      //       "M" +
      //         xa +
      //         " " +
      //         ya +
      //         " L" +
      //         xb +
      //         " " +
      //         yb +
      //         " L" +
      //         xc +
      //         " " +
      //         yc +
      //         " L" +
      //         xd +
      //         " " +
      //         yd
      //     );
      //     break;

      // case "B":
      s.push(
        'M' +
          xa +
          ' ' +
          ya +
          ' C' +
          xb +
          ' ' +
          yb +
          ' ' +
          xc +
          ' ' +
          yc +
          ' ' +
          xd +
          ' ' +
          yd
      );
      // break;
      //   case "L":

      //       s.push("M" + xa + " " + ya + " L" + xd + " " + yd);

      //     break;
      // }
    }
    return s;
  }
}

export class ECOTree {
  config: any;
  version = '1.1';
  canvasoffsetTop = 0;
  canvasoffsetLeft = 0;

  maxLevelHeight = [];
  maxLevelWidth = [];
  previousLevelNode = [];

  rootYOffset = 0;
  rootXOffset = 0;

  nDatabaseNodes = [];
  mapIDs = {};

  root;
  iSelectedNode = -1;
  iLastSearch = 0;

  width = 0;
  height = 0;

  constructor() {
    this.config = {
      iMaxDepth: 100,
      iLevelSeparation: 100,
      iSiblingSeparation: 20,
      iSubtreeSeparation: 40,

      topXAdjustment: 0,
      topYAdjustment: 0,
      linkType: 'B',
      nodeColor: '#333',
      nodeBorderColor: 'white',
      nodeSelColor: '#FFFFCC',
      useTarget: true,
      searchMode: Search.SM_DSC,
      selectMode: Select.SL_MULTIPLE,
      defaultNodeWidth: 160,
      defaultNodeHeight: 40,
    };

    this.version = '1.1';
    this.canvasoffsetTop = 0;
    this.canvasoffsetLeft = 0;

    this.maxLevelHeight = [];
    this.maxLevelWidth = [];
    this.previousLevelNode = [];

    this.rootYOffset = 0;
    this.rootXOffset = 0;

    this.nDatabaseNodes = [];
    this.mapIDs = {};

    this.root = new ECONode(-1, null, null, 2, 2, null, null, null);
    this.iSelectedNode = -1;
    this.iLastSearch = 0;
  }

  //Layout algorithm
  _firstWalk(tree, node, level) {
    var leftSibling = null;

    node.XPosition = 0;
    node.YPosition = 0;
    node.prelim = 0;
    node.modifier = 0;
    node.leftNeighbor = null;
    node.rightNeighbor = null;
    tree._setLevelHeight(node, level);
    tree._setLevelWidth(node, level);
    tree._setNeighbors(node, level);
    if (node._getChildrenCount() == 0 || level == tree.config.iMaxDepth) {
      leftSibling = node._getLeftSibling();
      if (leftSibling != null) {
        node.prelim =
          leftSibling.prelim +
          tree._getNodeSize(leftSibling) +
          tree.config.iSiblingSeparation;
        // console.log(node.prelim)
        // console.log(node.data.id)
        // console.log(tree._getNodeSize(leftSibling))
        // console.log(leftSibling)
      } else node.prelim = 0;
    } else {
      const n = node._getChildrenCount();
      for (let i = 0; i < n; i++) {
        const iChild = node._getChildAt(i);
        this._firstWalk(tree, iChild, level + 1);
      }

      let midPoint = node._getChildrenCenter(tree);
      midPoint -= tree._getNodeSize(node) / 2;
      leftSibling = node._getLeftSibling();
      if (leftSibling != null) {
        node.prelim =
          leftSibling.prelim +
          tree._getNodeSize(leftSibling) +
          tree.config.iSiblingSeparation;
        node.modifier = node.prelim - midPoint;
        this._apportion(tree, node, level);
      } else {
        node.prelim = midPoint;
      }
    }
  }

  _apportion(tree, node, level) {
    let firstChild = node._getFirstChild();
    let firstChildLeftNeighbor = firstChild.leftNeighbor;
    let j = 1;
    for (
      let k = tree.config.iMaxDepth - level;
      firstChild != null && firstChildLeftNeighbor != null && j <= k;

    ) {
      let modifierSumRight = 0;
      let modifierSumLeft = 0;
      let rightAncestor = firstChild;
      let leftAncestor = firstChildLeftNeighbor;
      for (let l = 0; l < j; l++) {
        rightAncestor = rightAncestor.nodeParent;
        leftAncestor = leftAncestor.nodeParent;
        modifierSumRight += rightAncestor.modifier;
        modifierSumLeft += leftAncestor.modifier;
      }

      let totalGap =
        firstChildLeftNeighbor.prelim +
        modifierSumLeft +
        tree._getNodeSize(firstChildLeftNeighbor) +
        tree.config.iSubtreeSeparation -
        (firstChild.prelim + modifierSumRight);
      if (totalGap > 0) {
        let subtreeAux = node;
        let numSubtrees = 0;
        for (
          ;
          subtreeAux != null && subtreeAux != leftAncestor;
          subtreeAux = subtreeAux._getLeftSibling()
        )
          numSubtrees++;

        if (subtreeAux != null) {
          let subtreeMoveAux = node;
          let singleGap = totalGap / numSubtrees;
          for (
            ;
            subtreeMoveAux != leftAncestor;
            subtreeMoveAux = subtreeMoveAux._getLeftSibling()
          ) {
            subtreeMoveAux.prelim += totalGap;
            subtreeMoveAux.modifier += totalGap;
            totalGap -= singleGap;
          }
        }
      }
      j++;
      if (firstChild._getChildrenCount() == 0)
        firstChild = tree._getLeftmost(node, 0, j);
      else firstChild = firstChild._getFirstChild();
      if (firstChild != null) firstChildLeftNeighbor = firstChild.leftNeighbor;
    }
  }

  _secondWalk(tree, node, level, X, Y) {
    if (level <= tree.config.iMaxDepth) {
      let xTmp = tree.rootXOffset + node.prelim + X;
      let yTmp = tree.rootYOffset + Y;
      let maxsizeTmp = 0;
      let nodesizeTmp = 0;
      let flag = false;

      maxsizeTmp = tree.maxLevelWidth[level];
      flag = true;
      nodesizeTmp = node.w;

      node.XPosition = xTmp;
      node.YPosition = yTmp;

      if (flag) {
        let swapTmp = node.XPosition;
        node.XPosition = node.YPosition;
        node.YPosition = swapTmp;
      }

      if (node._getChildrenCount() != 0)
        this._secondWalk(
          tree,
          node._getFirstChild(),
          level + 1,
          X + node.modifier,
          Y + maxsizeTmp + tree.config.iLevelSeparation
        );
      const rightSibling = node._getRightSibling();
      if (rightSibling != null)
        this._secondWalk(tree, rightSibling, level, X, Y);
    }
  }

  _positionTree() {
    this.maxLevelHeight = [];
    this.maxLevelWidth = [];
    this.previousLevelNode = [];
    this._firstWalk(this, this.root, 0);

    this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
    this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;

    this._secondWalk(this, this.root, 0, 0, 0);
  }

  _setLevelHeight(node, level) {
    if (this.maxLevelHeight[level] == null) this.maxLevelHeight[level] = 0;
    if (this.maxLevelHeight[level] < node.h)
      this.maxLevelHeight[level] = node.h;
  }

  _setLevelWidth(node, level) {
    if (this.maxLevelWidth[level] == null) this.maxLevelWidth[level] = 0;
    if (this.maxLevelWidth[level] < node.w) this.maxLevelWidth[level] = node.w;
  }

  _setNeighbors(node, level) {
    node.leftNeighbor = this.previousLevelNode[level];
    if (node.leftNeighbor != null) node.leftNeighbor.rightNeighbor = node;
    this.previousLevelNode[level] = node;
  }

  _getNodeSize(node) {
    return node.h;
  }

  _getLeftmost(node, level, maxlevel) {
    if (level >= maxlevel) return node;
    if (node._getChildrenCount() == 0) return null;

    const n = node._getChildrenCount();
    for (let i = 0; i < n; i++) {
      const iChild = node._getChildAt(i);
      const leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
      if (leftmostDescendant != null) return leftmostDescendant;
    }

    return null;
  }

  // _selectNodeInt(dbindex, flagToggle) {
  //   if (this.config.selectMode == Select.SL_SINGLE) {
  //     if (this.iSelectedNode != dbindex && this.iSelectedNode != -1) {
  //       this.nDatabaseNodes[this.iSelectedNode].isSelected = false;
  //     }
  //     this.iSelectedNode =
  //       this.nDatabaseNodes[dbindex].isSelected && flagToggle ? -1 : dbindex;
  //   }
  //   this.nDatabaseNodes[dbindex].isSelected = flagToggle
  //     ? !this.nDatabaseNodes[dbindex].isSelected
  //     : true;
  // }

  // _collapseAllInt(flag) {
  //   let node = null;
  //   for (let n = 0; n < this.nDatabaseNodes.length; n++) {
  //     node = this.nDatabaseNodes[n];
  //     if (node.canCollapse) node.isCollapsed = flag;
  //   }
  //   this.UpdateTree();
  // }

  // _selectAllInt(flag) {
  //   let node = null;
  //   for (let k = 0; k < this.nDatabaseNodes.length; k++) {
  //     node = this.nDatabaseNodes[k];
  //     node.isSelected = flag;
  //   }
  //   this.iSelectedNode = -1;
  //   this.UpdateTree();
  // }

  // ECOTree API begins here...

  UpdateTree() {
    this._positionTree();
    this.width = Math.max(...this.nDatabaseNodes.map((x) => x.XPosition + x.w));
    this.height = Math.max(
      ...this.nDatabaseNodes.map((x) => x.YPosition + x.h)
    );
    // this.width = 1000;
    // this.height = 90;
  }

  add(id, pid, dsc, w, h, c, bc, meta, selected = false) {
    const nw = w || this.config.defaultNodeWidth; //Width, height, colors, target and metadata defaults...
    const nh = h || this.config.defaultNodeHeight;
    const color = c || this.config.nodeColor;
    const border = bc || this.config.nodeBorderColor;
    const metadata = typeof meta != 'undefined' ? meta : '';

    let pnode = null; //Search for parent node in database
    if (pid == -1) {
      pnode = this.root;
    } else {
      for (let k = 0; k < this.nDatabaseNodes.length; k++) {
        if (this.nDatabaseNodes[k].id == pid) {
          pnode = this.nDatabaseNodes[k];
          break;
        }
      }
    }

    const node = new ECONode(id, pid, dsc, nw, nh, color, border, metadata);
    node.isSelected = selected; //New node creation...
    node.nodeParent = pnode; //Set it's parent
    pnode.canCollapse = true; //It's obvious that now the parent can collapse
    const i = this.nDatabaseNodes.length; //Save it in database
    node.dbIndex = this.mapIDs[id] = i;
    this.nDatabaseNodes[i] = node;
    h = pnode.nodeChildren.length; //Add it as child of it's parent
    node.siblingIndex = h;
    pnode.nodeChildren[h] = node;
  }

  // searchNodes(str) {
  //   let node = null;
  //   const m = this.config.searchMode;
  //   const sm = this.config.selectMode == Select.SL_SINGLE;

  //   if (typeof str == "undefined") return;
  //   if (str == "") return;

  //   let found = false;
  //   let n = sm ? this.iLastSearch : 0;
  //   if (n == this.nDatabaseNodes.length) n = this.iLastSearch = 0;

  //   str = str.toLocaleUpperCase();

  //   for (; n < this.nDatabaseNodes.length; n++) {
  //     node = this.nDatabaseNodes[n];
  //     if (
  //       node.dsc.toLocaleUpperCase().indexOf(str) != -1 &&
  //       (m == Search.SM_DSC || m == Search.SM_BOTH)
  //     ) {
  //       node._setAncestorsExpanded();
  //       this._selectNodeInt(node.dbIndex, false);
  //       found = true;
  //     }
  //     if (
  //       node.meta.toLocaleUpperCase().indexOf(str) != -1 &&
  //       (m == Search.SM_META || m == Search.SM_BOTH)
  //     ) {
  //       node._setAncestorsExpanded();
  //       this._selectNodeInt(node.dbIndex, false);
  //       found = true;
  //     }
  //     if (sm && found) {
  //       this.iLastSearch = n + 1;
  //       break;
  //     }
  //   }
  //   this.UpdateTree();
  // }

  //   selectAll() {
  //     if (this.config.selectMode != Select.SL_MULTIPLE) return;
  //     this._selectAllInt(true);
  //   }

  //   unselectAll() {
  //     this._selectAllInt(false);
  //   }

  //   collapseAll() {
  //     this._collapseAllInt(true);
  //   }

  //   expandAll() {
  //     this._collapseAllInt(false);
  //   }

  //   collapseNode(nodeid, upd) {
  //     const dbindex = this.mapIDs[nodeid];
  //     this.nDatabaseNodes[dbindex].isCollapsed = !this.nDatabaseNodes[dbindex]
  //       .isCollapsed;
  //     if (upd) this.UpdateTree();
  //   }

  //   selectNode(nodeid, upd) {
  //     this._selectNodeInt(this.mapIDs[nodeid], true);
  //     if (upd) this.UpdateTree();
  //   }

  //   setNodeTitle(nodeid, title, upd) {
  //     const dbindex = this.mapIDs[nodeid];
  //     this.nDatabaseNodes[dbindex].dsc = title;
  //     if (upd) this.UpdateTree();
  //   }

  //   setNodeMetadata(nodeid, meta, upd) {
  //     const dbindex = this.mapIDs[nodeid];
  //     this.nDatabaseNodes[dbindex].meta = meta;
  //     if (upd) this.UpdateTree();
  //   }

  //   setNodeColors(nodeid, color, border, upd) {
  //     const dbindex = this.mapIDs[nodeid];
  //     if (color) this.nDatabaseNodes[dbindex].c = color;
  //     if (border) this.nDatabaseNodes[dbindex].bc = border;
  //     if (upd) this.UpdateTree();
  //   }

  //   getSelectedNodes() {
  //     let node = null;
  //     const selection = [];
  //     let selnode = null;

  //     for (let n = 0; n < this.nDatabaseNodes.length; n++) {
  //       node = this.nDatabaseNodes[n];
  //       if (node.isSelected) {
  //         selnode = {
  //           id: node.id,
  //           dsc: node.dsc,
  //           meta: node.meta
  //         };
  //         selection[selection.length] = selnode;
  //       }
  //     }
  //     return selection;
  //   }
}
