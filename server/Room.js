/**
 * Created by aina on 10/07/15.
 */

var Card = require("./Card.js");

function Room( name ){
    this.name = name;
    this.state = false;
    this.played = false;
    this.p1_name = null;
    this.p2_name = null;
    this.anounced_names = 0;

    this.p1 = name;
    this.p2 = null;
    this.tablecards = [];


}

Room.prototype.generatedeck = function(){
    var de = [];
    for (var i = 0; i < 81; ++i){
        de[i] = {};
        de[i].table = false;
        de[i].id = i;
    }
    return de;
};

Room.prototype.begincards = function(){
    this.deck = this.generatedeck();
    var infos = [];
    this.deck.sort( function() { return 0.5 - Math.random() } );
    for (var i = 0; i < 12; ++i){
        this.deck[i].table = true;
        var c = this.allcards[this.deck[i].id];
        this.tablecards[i] = c;
        var ci = {num: c.num, col: c.color, tex: c.texture, shape: c.shape};
        infos.push(ci);
    }
    return infos;
};


Room.prototype.allcards = [];
    var  idc = 0;
    for (var sh = 1; sh <= 3; ++sh){
        for (var co = 1; co <= 3; ++co){
            for(var nu = 1; nu <= 3; ++nu){
                for (var te = 1; te <= 3; ++te){
                    Room.prototype.allcards.push(new Card(idc, sh, co, nu, te));
                    ++idc;
                }
            }
        }
    }



module.exports = Room;