/**
 * Created by aina on 06/07/15.
 */

var port = process.env.PORT || 9000;
var io = require('socket.io')(port);
var Card = require('./Card.js');
var Room = require('./Room.js');
var onlineplayers = 0;
var rooms = {};

var lastroom = null;



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
        lastroom = socket.id;
        socket.join(rooms[socket.id].name);
    }
    else{
        socket.room_name = lastroom;
        socket.player_num = 2;
        rooms[lastroom].p2 = socket.id;
        rooms[socket.room_name].state = true;
        rooms[socket.room_name].played = true;
        socket.join(socket.room_name);
        io.to(socket.room_name).emit('begin',rooms[socket.room_name].begincards());
    }
    socket.on('click_on_card', function (id) {
        var r = socket.room_name;
        socket.broadcast.to(r).emit('click_on_card', id);
        console.log("lol, serving a click on" + id);
        console.log('click_on_card', r);
        printrooms();
    });
    socket.on('click_on_trash', function(){
        console.log("TRASH!");
        var r = socket.room_name;
        if (socket.id == r){
            rooms[r].p1_trashing = !rooms[r].p1_trashing;
            socket.broadcast.to(r).emit('request_trash');
        }
        else{
            rooms[r].p2_trashing = !rooms[r].p2_trashing;
            socket.broadcast.to(r).emit('request_trash');
        }
        if( rooms[r].p1_trashing && rooms[r].p2_trashing){
            console.log ("let's trash cards!");
            if (rooms[r].getRemaining() > 12){
            io.to(socket.room_name).emit('trash_cards',rooms[socket.room_name].trashcards());
            rooms[r].p2_trashing = false;
            rooms[r].p1_trashing = false;
            }
            else{
                io.to(socket.room_name).emit('end_game');
            }
        }

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
    socket.on('points', function(info){
        var r = socket.room_name;
        var newcards = rooms[socket.room_name].newcards(info);
        socket.broadcast.to(r).emit('points',newcards, true);
        socket.emit('points', newcards, false);
    });
    socket.on('anounceName', function(n) {
        console.log("Anounced name: ", n);
        var r = socket.room_name;
        if (socket.id == r){
            rooms[r].p1_name = n;
            console.log (n , " is player1");
        }
        else{
            rooms[r].p2_name = n;
            console.log (n , " is player2");
        }
        if(rooms[r].anounced_names == 0){
            ++rooms[r].anounced_names;
            console.log('waiting for the other');
        }
        else{
            if (socket.id == r){
                socket.broadcast.to(r).emit('set_op_name', rooms[r].p1_name);
                socket.emit('set_op_name',  rooms[r].p2_name);


            }
            else{
                socket.broadcast.to(r).emit('set_op_name', rooms[r].p2_name);
                socket.emit('set_op_name',  rooms[r].p1_name);
            }
        }
    });
    printrooms();
});

console.log('server started on port', port);
