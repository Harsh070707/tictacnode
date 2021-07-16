const express = require('express')
const socketio=require('socket.io')
const http = require('http')
const app = express()


const server=http.createServer(app)
const io= socketio(server)

app.use(express.static('public'))
const port = process.env.PORT || 5050



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var players = {},
  unmatched;


	io.on("connection",(socket)=>{
		console.log("New Webscoket connection")
		socket.emit('connect',{msg:"hello"})
		
		
	   joinGame(socket);	

		  if (getOpponent(socket)) {
			  
			socket.emit("gamestart", {
			  symbol: players[socket.id].symbol,
			});
			
			getOpponent(socket).emit("gamestart", {
			  symbol: players[getOpponent(socket).id].symbol,
			});

		  }

	  socket.on("startmove", function (data) {
		  
			  
			if (!getOpponent(socket)) {
			  return;
			}
			socket.emit("movedone", data);
			getOpponent(socket).emit("movedone", data);
			
		  });

      socket.on("disconnect", function () {
			if (getOpponent(socket)) {
			  getOpponent(socket).emit("opponentleave");
			}
      });
    });

		function joinGame(socket) {
			
		  players[socket.id] = {
			opponent: unmatched,

			symbol: "X",
			// The socket that is associated with this player
			socket: socket,
		  };
		  
			  if (unmatched) {
				  
				players[socket.id].symbol = "O";
				players[unmatched].opponent = socket.id;
				unmatched = null;
				
			  } 
			  
			  else {
				  
				unmatched = socket.id;
				
			  }
		}

		function getOpponent(socket) {
			
		  if (!players[socket.id].opponent) {
			return;
		  }
		  
		  return players[players[socket.id].opponent].socket;
		  
        }

server.listen(port,()=>{
	
console.log(`The server is up at the Port ${port}`)
})
