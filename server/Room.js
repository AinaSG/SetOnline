/**
 * Created by aina on 10/07/15.
 */

function Room( name ){
    this.name = name;
    this.state = false;
    this.played = false;

    this.p1 = name;
    this.p2 = null;

    this.deck = this.generatedeck();

}

Room.prototype.generatedeck = function(){
    var de = [];
    for (var i = 0; i < 81; ++i){
        de[i]=false;
    }
    return de;
};


module.exports = Room;