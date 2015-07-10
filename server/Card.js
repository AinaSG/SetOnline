/**
 * Created by aina on 05/07/15.
 */

function Card(id, Shape, Color, Number, Texture){
    //this.used = false;
    //this.onTheTable = false;
    this.id = id;
    this.num = Number;
    this.shapeCode = Shape;
    this.colorCode = Color;
    this.textureCode = Texture;

    switch (Shape){
        case 1:
            this.shape = "c";//"Circle";
            break;
        case 2:
            this.shape = "s";//"Square";
            break;
        case 3:
            this.shape = "t";//"Triangle";
            break;
        default:
            console.log("ERROR IN THE SHAPE!");
            break;
    }

    switch (Color){
        case 1:
            this.color = "r";//"Red";
            break;
        case 2:
            this.color = "g";//"Green";
            break;
        case 3:
            this.color = "b";//"Blue";
            break;
        default:
            console.log("ERROR IN THE COLOR!");
            break;
    }

    switch (Texture){
        case 1:
            this.texture = "e";//"Empty";
            break;
        case 2:
            this.texture = "f";//"Full";
            break;
        case 3:
            this.texture = "l";//"Lines";
            break;
        default:
            console.log("ERROR IN THE TEXTURE!");
            break;
    }

}

module.exports = Card;