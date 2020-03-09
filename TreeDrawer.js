var canvas;
var context;
const yStep = 70;
const xStep = 10;

class CanvasNode {
    constructor(locX, locY, sizeX, sizeY, maxChildren, values) {
        this.locX = locX;
        this.locY = locY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.maxChildren = maxChildren;
        this.isThreeNode = values[1] != null;
        this.value0 = values[0];
        this.value1 = values[1];

        this.leftX = this.locX - ((this.sizeX + xStep) * Math.pow(3,this.maxChildren-1));
        this.rightX = this.locX + ((this.sizeX + xStep) * Math.pow(3,this.maxChildren-1));
        this.nextY = this.locY + this.sizeY + yStep;
    }

    drawNode() {
        context.strokeRect(this.locX, this.locY, this.sizeX/2, this.sizeY);
        context.strokeRect(this.locX + this.sizeX/2, this.locY, this.sizeX/2, this.sizeY);
        context.font = "15px Arial";
        context.fillText(twoDigitString(this.value0), this.locX + this.sizeX/4 - 7.5, this.locY + this.sizeY/2 + 5);
        if(this.value1 != null) {
            context.fillText(twoDigitString(this.value1), this.locX + this.sizeX/2 + 3.25, this.locY + this.sizeY/2 + 5);
        }
        
    }

    createLeft(values) {
        return new CanvasNode(this.leftX, this.nextY, this.sizeX, this.sizeY, this.maxChildren - 1, values);
    }

    createRight(values) {
        return new CanvasNode(this.rightX, this.nextY, this.sizeX, this.sizeY, this.maxChildren - 1, values);
    }

    createCenter(values) {
        return new CanvasNode(this.locX, this.nextY, this.sizeX, this.sizeY, this.maxChildren - 1, values);
    }

    drawEdges() {
          context.moveTo(this.locX + this.sizeX/2, this.locY + this.sizeY);
          context.lineTo(this.leftX + this.sizeX/2, this.nextY);

          context.moveTo(this.locX + this.sizeX/2, this.locY + this.sizeY);
          context.lineTo(this.rightX + this.sizeX/2, this.nextY);

          if(this.isThreeNode) {
            context.moveTo(this.locX + this.sizeX/2, this.locY + this.sizeY);
            context.lineTo(this.locX + this.sizeX/2, this.locY + this.sizeY + yStep);
          }
          context.stroke();
          context.closePath();
    }
}

window.onload = function() {
    canvas  = document.getElementById("can1");
    context = canvas.getContext("2d");

    context.fillStyle = "#000000";
    context.lineWidth = 1;
}

function draw(root,height) {
    if(height >= 0) {
        let left = root.createLeft();
        let center = root.createCenter();
        let right = root.createRight();

        root.drawNode();
        if(height != 0) {
            root.drawEdges();
        }
        

        drawTree(left, height-1);
        drawTree(center, height-1);
        drawTree(right, height-1);
    }
    
}

function twoDigitString(x) {
    let result = "";
    result += Math.floor(x / 10);
    result += (x % 10);
    return result;
}