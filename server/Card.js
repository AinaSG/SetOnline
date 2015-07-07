/**
 * Created by aina on 05/07/15.
 */

function Card(Shape, Color, Number, Texture){
    this.used = false;
    this.onTheTable = false;
    this.num = Number;
    this.shapeCode = Shape;
    this.colorCode = Color;
    this.textureCode = Texture;

    switch (Shape){
        case 1:
            this.shape = "Circle";
            break;
        case 2:
            this.shape = "Square";
            break;
        case 3:
            this.shape = "Triangle";
            break;
        default:
            console.log("ERROR IN THE SHAPE!");
            break;
    }

    switch (Color){
        case 1:
            this.color = "Red";
            break;
        case 2:
            this.color = "Green";
            break;
        case 3:
            this.color = "Blue";
            break;
        default:
            console.log("ERROR IN THE COLOR!");
            break;
    }

    switch (Texture){
        case 1:
            this.texture = "Empty";
            break;
        case 2:
            this.texture = "Full";
            break;
        case 3:
            this.texture = "Lines";
            break;
        default:
            console.log("ERROR IN THE TEXTURE!");
            break;
    }

}

module.exports = Card;