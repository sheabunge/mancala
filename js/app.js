(function () {
	'use strict';

	NodeList.prototype.forEach = Array.prototype.forEach;

	window.mancala = {

		player: 'one',
		gameover: false,

		playerOnePits: document.querySelectorAll('.row.player-one .pit'),
		playerTwoPits: document.querySelectorAll('.row.player-two .pit'),

		playerOneStore: document.querySelector('.store.player-one'),
		playerTwoStore: document.querySelector('.store.player-two'),

		board: [],

		/**
		 * Build the board array with the current board configuration
		 */
		updateBoard: function () {
			// current player store
			this.board[6] = this.player === 'two' ? this.playerTwoStore : this.playerOneStore;

			// other player store
			this.board[13] = this.player === 'two' ? this.playerOneStore : this.playerTwoStore;

			// current player pits
			var currentPlayerPits = this.player === 'two' ? this.playerTwoPits : this.playerOnePits;
			for (var i = 0; i < 6; ++i) {
				this.board[i] = currentPlayerPits[i];
			}

			// other player pits
			var otherPlayerPits = this.player === 'two' ? this.playerOnePits : this.playerTwoPits;
			for (i = 7; i < 13; ++i) {
				this.board[i] = otherPlayerPits[i - 7];
			}
		},

		getStones: function (pit) {
			var stones = pit.querySelector('p').textContent;
			return parseInt(stones);
		},

		setStones: function (pit, stones) {
			pit.querySelector('p').textContent = stones;
		},

		addStones: function (pit, stones) {
			var el = pit.querySelector('p');
			el.textContent = parseInt(el.textContent) + stones;
		},

		doPlayerMove: function (starting_pit) {

			// perform the player's action
			var result = this.moveStones(starting_pit);

			// make sure that a player hasn't run out of stones
			this.checkForWin();

			// change the player if the current turn is ended
			if ( ! result && ! this.gameover ) {
				this.switchTurn();
			}
		},

		switchTurn: function () {
			this.player = this.player === 'one' ? 'two' : 'one';
			this.updateBoard();

			var player = this.player;
			setTimeout(function () {
				document.body.setAttribute('data-player', player);
				document.querySelector('.current-player').textContent = player;
			}, 700 );
		},

		moveStones: function (starting_pit) {
			this.updateBoard();

			// return if pit has no stones
			if (this.getStones(this.board[starting_pit]) < 1) {
				return true;
			}

			// take stones out of pit
			var stones = this.getStones(this.board[starting_pit]);
			this.setStones(this.board[starting_pit], 0);

			var pointer = starting_pit;
			while (stones > 0) {
				++pointer;

				if (pointer > 12) {
					pointer = 0;
				}

				this.addStones(this.board[pointer], 1);
				stones--;
			}

			// set to point to the opposite pit
			var inverse_pointer = 12 - pointer;

			// Check for capture
			if (pointer < 6 && this.getStones(this.board[pointer]) === 1 && this.getStones(this.board[inverse_pointer]) > 0) {

				// Transfer this stone along with opposite pit's stones to store
				this.addStones(this.board[6], this.getStones(this.board[inverse_pointer]) + 1);

				// Clear the pits
				this.setStones(this.board[pointer], 0);
				this.setStones(this.board[inverse_pointer], 0);
			}

			// return true if the turn ended in storage pit
			return pointer === 6;
		},

		checkForWin: function () {
			var that = this;

			var is_row_empty = function (pits) {
				for (var i = 0; i < pits.length; i++) {
					if (that.getStones(pits[i]) > 0) {
						return false;
					}
				}

				return true;
			};

			var player_one_out = is_row_empty(this.playerOnePits);
			var player_two_out = is_row_empty(this.playerTwoPits);

			// Take the stones from the non-empty row and add them to that player's store
			if (! (player_one_out || player_two_out)) {
				return;
			}

			this.gameover = true;
			document.body.classList.add('game-over');

			var cleanUpRow = function (store, pits) {
				var store_stones = that.getStones(store);

				pits.forEach(function (pit) {
					store_stones += that.getStones(pit);
					that.setStones(pit, 0);
				});

				that.setStones(store, store_stones);
			};

			if (player_one_out && ! player_two_out) {
				cleanUpRow(this.playerTwoStore, this.playerTwoPits);

			} else if (! player_one_out && player_two_out) {
				cleanUpRow(this.playerOneStore, this.playerOnePits);
			}

			var status = document.querySelector('.status');

			// Determine which player holds the most stones
			if (this.getStones(this.playerOneStore) > this.getStones(this.playerTwoStore)) {
				status.textContent = 'Player one wins!';
			} else if (this.getStones(this.playerTwoStore) > this.getStones(this.playerOneStore)) {
				status.textContent = 'Player two wins!';
			} else {
				status.textContent = 'Draw!';
			}
		}
	};

	mancala.updateBoard();

	mancala.playerOnePits.forEach(function (pit, index) {
		pit.setAttribute('data-pit', index);
		pit.onclick = function () {
			if (mancala.player === 'one' && ! mancala.gameover) {
				mancala.doPlayerMove(this.getAttribute('data-pit'));
			}
		};
	});

	mancala.playerTwoPits.forEach(function (pit, index) {
		pit.setAttribute('data-pit', index);
		pit.onclick = function () {
			if (mancala.player === 'two' && ! mancala.gameover) {
				mancala.doPlayerMove(this.getAttribute('data-pit'));
			}
		};
	});

})();
