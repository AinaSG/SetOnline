/**
 * Created by aina on 06/07/15.
 */

var port = process.env.PORT || 9000;
var io = require('socket.io')(port);
var Card = require('./Card.js');

var allCards = [];
generatecards();
printcards();

function generatecards(){
    //Code - Shape    - Color - Number - Texture:
    // 1   - Circle   - Red   - 1      - Empty
    // 2   - Square   - Green - 2      - Full
    // 3   - Triangle - Blue  - 3      - Lines
    for (var sh = 1; sh <= 3; ++sh){
        for (var co = 1; co <= 3; ++co){
            for(var nu = 1; nu <= 3; ++nu){
                for (var te = 1; te <= 3; ++te){
                    allCards.push(new Card(sh, co, nu, te));
                }
            }
        }
    }
}

function printcards(){
    for (var c in allCards){
        var ca = allCards[c];
        console.log( c + " Sh: " + ca.shape + " Nu: " + ca.num + " Co: " + ca.color + " Te: " + ca.texture);
    }
}

io.on('connection', function (socket) {
    socket.on('click_on_card', function (id) {
        socket.broadcast.emit('click_on_card', id);
        console.log("lol, serving a click on" + id);

    });

});

console.log('server started on port', port);