function numSort(x,y) {
    return x-y;
}

class Node {
    constructor(left, center, right, parent, data) {
        this.children = [left,center,right];
        this.parent=parent;
        this.data=data;
    }
    num_keys() {
        let count = 0;
        var i;
        for(i = 0; i < 2; i++) {
            if(this.data[i]) {
                count++;
            }
        }
        return count;
    }

    height() {
        return this.heightRecur(this)
    }

    heightRecur(node) {
        let result = -1;
        
        if(node.children[0]) {
            result = Math.max(this.heightRecur(node.children[0]),result);
        }

        if(node.children[1]) {
            result = Math.max(this.heightRecur(node.children[1]),result);
        }

        if(node.children[2]) {
            result = Math.max(this.heightRecur(node.children[2]),result);
        }

        return result + 1;
    }
}

class TwoThree {
    constructor() {
        this.root = new Node(null, null, null, null, [null, null]);
    }
    insert(key) {
       let current = this.root;
       let num_keys = current.num_keys();
       while(current.children[0] || current.children[1] || current.children[2]) {
           if(key < current.data[0]) {
               current = current.children[0];
           }
           else if(current.children[1] && key <= current.data[1]) {
               current = current.children[1];
           }
           else {
               current = current.children[2];
           }
       }
       this.insert_recur(key, current, [null,null], 0);
    }
    insert_recur(key, node, split_nodes, which_child) {
        if(node.data[1] == null && !(node.children[0] || node.children[1] || node.children[2])) { // If this node has one member and is a leaf
            node.data = [node.data[0], key].sort(numSort);
            return;
        }
        else if(node.data[1] == null) { // If this node is a parent with one data member
            node.data = [node.data[0], key].sort(numSort);
            switch(which_child) {
                case 0:
                    node.children = [split_nodes[0], split_nodes[1], node.children[2]];
                    break;
                case 2:
                    node.children = [node.children[0], split_nodes[0], split_nodes[1]];
                    break;
            }
            return;
        }
        let keys = [node.data[0], node.data[1], key].sort(numSort);
        let left_split;
        let right_split;
        switch(which_child) {
            case 0:
                left_split = new Node(split_nodes[0], null, split_nodes[1], node.parent, [keys[0], null]);
                right_split = new Node(node.children[1], null, node.children[2], node.parent, [keys[2], null]);
                if(split_nodes[0]) {
                    split_nodes[0].parent = left_split;
                    split_nodes[1].parent = left_split;
                    node.children[1].parent = right_split;
                    node.children[2].parent = right_split;
                }
                break;
            case 1:
                left_split = new Node(node.children[0], null, split_nodes[0], node.parent, [keys[0], null]);
                right_split = new Node(split_nodes[1], null, node.children[2], node.parent, [keys[2], null]);
                if(split_nodes[0]) {
                    split_nodes[0].parent = left_split;
                    split_nodes[1].parent = right_split;
                    node.children[0].parent = left_split;
                    node.children[2].parent = right_split;
                }
                break;
            case 2:
                left_split = new Node(node.children[0], null, node.children[1], node.parent, [keys[0], null]);
                right_split = new Node(split_nodes[0], null, split_nodes[1], node.parent, [keys[2], null]);
                if(split_nodes[0]) {
                    split_nodes[0].parent = right_split;
                    split_nodes[1].parent = right_split;
                    node.children[0].parent = left_split;
                    node.children[1].parent = left_split;
                }
                break;
        }
        if(node.parent) { // If split node is not root
            let i = 0;
            while(node.parent.children[i] != node)
                i++;
            this.insert_recur(keys[1],node.parent,[left_split,right_split],i);
            return;
        }
        let new_root = new Node(left_split, null, right_split, null, [keys[1],null]);
        left_split.parent = new_root;
        right_split.parent = new_root;
        this.root = new_root // If split node is root grow new root
    }
    show() {
        let current = this.root;
        let count = 0;
        while(current) {
            current = current.children[0];
            count++;
        }

    }
    show_recur(node) {
        var i;
        for(i = 0; i < 3; i++) {
            if(node.children[i])
                this.show(node.children[i]);
        }
    }
}

var tree;
var randomKeys;

window.onload = function() {
    canvas  = document.getElementById("can1");
    context = canvas.getContext("2d");

    startTree();
}

function startTree() {
    tree = new TwoThree();
    tree.root.data = [Math.floor(Math.random() * 100),null];
    randomKeys = [];
    while(randomKeys.length < 13) {
        randomKeys.push(Math.floor(Math.random() * 100));
    }
    document.getElementById("nextKeyText").innerHTML = "Next key to add: " + twoDigitString(randomKeys[randomKeys.length-1]);
    drawTree(tree.root);
}

function addRandomKey() {
    if(randomKeys.length > 0) {
        tree.insert(randomKeys.pop());
        drawTree(tree.root);
    }
    
    if(randomKeys.length > 0) {
        document.getElementById("nextKeyText").innerHTML = "Next key to add: " + twoDigitString(randomKeys[randomKeys.length-1]);
    }
    else {
        document.getElementById("nextKeyText").innerHTML = "Great work! Click \"Start over\" to build another tree!";
    }
}

function drawTree(root) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    drawTreeRecur(root, new CanvasNode(250, 10, 50, 25, root.height(), root.data), root.height());
}

function drawTreeRecur(node, canvasNode, height) {
    canvasNode.drawNode();
    if(height != 0) {
        canvasNode.drawEdges();
    }

    if(node.children[0]) {
        drawTreeRecur(node.children[0], canvasNode.createLeft(node.children[0].data), height - 1);
    }
    
    if(node.children[1]) {
        drawTreeRecur(node.children[1], canvasNode.createCenter(node.children[1].data), height - 1);
    }

    if(node.children[2]) {
        drawTreeRecur(node.children[2], canvasNode.createRight(node.children[2].data), height - 1);
    }

}


