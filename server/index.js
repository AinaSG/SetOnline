/**
 * Created by aina on 06/07/15.
 */

var port = process.env.PORT || 9000;
var io = require('socket.io')(port);
var Card = require('./Card.js');
var Room = require('./Room.js');
var onlineplayers = 0;
var rooms = {};
var allCards = [];

var lastroom = null;
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

function printrooms() {
    console.log('onlinePlayers', onlineplayers);
    for (var id in rooms){
        var r = rooms[id];
        console.log('RoomID:', id, 'P1:', r.p1, 'P2:', r.p2, 'State:', r.state);
    }
    console.log('===========');
}

io.on('connection', function (socket) {
    ++onlineplayers;

    if (!(onlineplayers%2==0) ){
        socket.room_name = socket.id;
        socket.player_num = 1;
        rooms[socket.id] = new Room(socket.room_name);
        //rooms[socket.id].p1 = socket.id;
        //rooms[socket.id].state = false;
        //rooms[socket.id].played = false;
        lastroom = socket.id;
        socket.join(rooms[socket.id].name);
    }
    else{
        socket.room_name = lastroom;
        socket.player_num = 2;
        rooms[lastroom].p2 = socket.id;
        rooms[socket.room_name].state = true;
        rooms[socket.room_name].played = true;
        //rooms[socket.room_name].deck = generatedeck();
        socket.join(socket.room_name);
        io.to(socket.room_name).emit('begin');
    }
    socket.on('click_on_card', function (id) {
        var r = socket.room_name;
        socket.broadcast.to(r).emit('click_on_card', id);
        console.log("lol, serving a click on" + id);
        console.log('click_on_card', r);
        printrooms();
    });
    socket.on('disconnect', function () {
        var r = socket.room_name;
        var me = socket.player_num;
        if (rooms[r].state){
            socket.broadcast.to(r).emit('op_left');
            onlineplayers -= 2;
            rooms[r].state = false;
        }
        else {
            if (!(rooms[r].played)) --onlineplayers;
            delete rooms[r];
        }
        console.log('disconnect', r);
        printrooms();
    });
    printrooms();
});

console.log('server started on port', port);



/*
 socket.on('disconnect', function () {
 console.log('disconnection', socket.id)
 delete players[socket.id]
 socket.broadcast.emit('remove_player', socket.id)
 })
 */