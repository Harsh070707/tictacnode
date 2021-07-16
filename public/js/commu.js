var socket = io();
var symbol;

	$(function () {
		
	  $(".board button").attr("disabled", true);
	  $(".board button").on("click", makeMove);
	  

	  socket.on("movedone", function (data) {
		  
		
		$("#" + data.position).text(data.symbol);
		
	

		myTurn = data.symbol !== symbol;

		
			if (!isGameOver()) {
				
				  if (gameTied()) {
					$("#messages").text("Game is tied");
					$(".board button").attr("disabled", true);
				  } 
			  
				  else {
					renderTurnMessage();
				  }
			  
			} 
		
		else {
		  
			  if (myTurn) {
				$("#messages").text("You lost.");
				
			  } 
		  
			  else {
				$("#messages").text("You won");
			  }
		  
		   $(".board button").attr("disabled", true);
		}
	  });

  
		  socket.on("gamestart", function (data) {
			
					symbol = data.symbol;
					myTurn = symbol === "X";
					renderTurnMessage();
					
		  });

		 
		  socket.on("opponentleave", function () {
			  
			$("#messages").text("The Player left the game.You Won!");
			$(".board button").attr("disabled", true);
	
     });
  
});

		function getBoardState() {
			
		  var obj = {};
		 
		  $(".board button").each(function () {
			obj[$(this).attr("id")] = $(this).text() || "";
		  });
		  return obj;
		}

		function gameTied() {
		  var state = getBoardState();

		  if (
			state.d0 !== "" &&
			state.d1 !== "" &&
			state.d2 !== "" &&
			state.e0 !== "" &&
			state.e1 !== "" &&
			state.e2 !== "" &&
			state.f0 !== "" &&
			state.f1 !== "" &&
			state.f2 !== ""
		  ) {
			return true;
		  }
		}

		function isGameOver() {
			
		  var state = getBoardState(),
			
			matches = ["XXX", "OOO"],
			
			rows = [
			  state.d0 + state.d1 + state.d2,
			  state.e0 + state.e1 + state.e2,
			  state.f0 + state.f1 + state.f2,
			  state.d0 + state.e1 + state.f2,
			  state.d2 + state.e1 + state.f0,
			  state.d0 + state.e0 + state.f0,
			  state.d1 + state.e1 + state.f1,
			  state.d2 + state.e2 + state.f2,
			];

		  
		  for (var i = 0; i < rows.length; i++) {
			  
				if (rows[i] === matches[0] || rows[i] === matches[1]) {
				  return true;
				}
			}
		}

	function renderTurnMessage() {
	 
	  if (!myTurn) {
		$("#messages").text("Game started. You are the second Player");
		$(".board button").attr("disabled", true);
		
	  } else {
		$("#messages").text("Game started. You are the first Player");
		$(".board button").removeAttr("disabled");
	  }
	}

	function makeMove(e) {
		
	  e.preventDefault();
	
	  if (!myTurn) {
		return;
	  }
	  
	  
	  if ($(this).text().length) {
		return;
	  }

	 
	  socket.emit("startmove", {
		symbol: symbol,
		position: $(this).attr("id"),
	  });
	  
	}
