(function () {
	'use strict';

	NodeList.prototype.forEach = Array.prototype.forEach;

	window.mancala = {

		player: 'one',
		game_over: false,

		player_one_pits: document.querySelectorAll('.row.player-one .pit'),
		player_two_pits: document.querySelectorAll('.row.player-two .pit'),

		player_one_store: document.querySelector('.store.player-one'),
		player_two_store: document.querySelector('.store.player-two'),

		board: [],

		/**
		 * Build the board array with the current board configuration
		 */
		update_board: function () {
			// current player store
			this.board[6] = this.player === 'two' ? this.player_two_store : this.player_one_store;

			// other player store
			this.board[13] = this.player === 'two' ? this.player_one_store : this.player_two_store;

			// current player pits
			var current_player_pits = this.player === 'two' ? this.player_two_pits : this.player_one_pits;
			for (var i = 0; i < 6; ++i) {
				this.board[i] = current_player_pits[i];
			}

			// other player pits
			var other_player_pits = this.player === 'two' ? this.player_one_pits : this.player_two_pits;
			for (i = 7; i < 13; ++i) {
				this.board[i] = other_player_pits[i - 7];
			}
		},

		get_stones: function (pit) {
			var stones = pit.querySelector('p').textContent;
			return parseInt(stones);
		},

		set_stones: function (pit, stones) {
			pit.querySelector('p').textContent = stones;
		},

		add_stones: function (pit, stones) {
			var el = pit.querySelector('p');
			el.textContent = parseInt(el.textContent) + stones;
		},

		do_user_move: function (starting_pit) {

			// perform the player's action
			var result = this.move_stones(starting_pit);

			// make sure that a player hasn't run out of stones
			this.check_for_win();

			// change the player if the current turn is ended
			if ( ! result && ! this.game_over ) {
				this.switch_turn();
			}
		},

		switch_turn: function () {
			this.player = this.player === 'one' ? 'two' : 'one';
			this.update_board();

			var player = this.player;
			setTimeout(function () {
				document.body.setAttribute('data-player', player);
				document.querySelector('.current-player').textContent = player;
			}, 700 );
		},

		move_stones: function (starting_pit) {
			this.update_board();

			// return if pit has no stones
			if (this.get_stones(this.board[starting_pit]) < 1) {
				return true;
			}

			// take stones out of pit
			var stones = this.get_stones(this.board[starting_pit]);
			this.set_stones(this.board[starting_pit], 0);

			var pointer = starting_pit;
			while (stones > 0) {
				++pointer;

				if (pointer > 12) {
					pointer = 0;
				}

				this.add_stones(this.board[pointer], 1);
				stones--;
			}

			// set to point to the opposite pit
			var inverse_pointer = 12 - pointer;

			// Check for capture
			if (pointer < 6 && this.get_stones(this.board[pointer]) === 1 && this.get_stones(this.board[inverse_pointer]) > 0) {

				// Transfer this stone along with opposite pit's stones to store
				this.add_stones(this.board[6], this.get_stones(this.board[inverse_pointer]) + 1);

				// Clear the pits
				this.set_stones(this.board[pointer], 0);
				this.set_stones(this.board[inverse_pointer], 0);
			}

			// return true if the turn ended in storage pit
			return pointer === 6;
		},

		check_for_win: function () {
			var that = this;

			var is_row_empty = function (pits) {
				for (var i = 0; i < pits.length; i++) {
					if (that.get_stones(pits[i]) > 0) {
						return false;
					}
				}

				return true;
			};

			var player_one_out = is_row_empty(this.player_one_pits);
			var player_two_out = is_row_empty(this.player_two_pits);

			// Take the stones from the non-empty row and add them to that player's store
			if (! (player_one_out || player_two_out)) {
				return;
			}

			this.game_over = true;
			document.body.classList.add('game-over');

			var cleanup_row = function (store, pits) {
				var store_stones = that.get_stones(store);

				pits.forEach(function (pit) {
					store_stones += that.get_stones(pit);
					that.set_stones(pit, 0);
				});

				that.set_stones(store, store_stones);
			};

			if (player_one_out && ! player_two_out) {
				cleanup_row(this.player_two_store, this.player_two_pits);

			} else if (! player_one_out && player_two_out) {
				cleanup_row(this.player_one_store, this.player_one_pits);
			}

			var status = document.querySelector('.status');

			// Determine which player holds the most stones
			if (this.get_stones(this.player_one_store) > this.get_stones(this.player_two_store)) {
				status.textContent = 'Player one wins!';
			} else if (this.get_stones(this.player_two_store) > this.get_stones(this.player_one_store)) {
				status.textContent = 'Player two wins!';
			} else {
				status.textContent = 'Draw!';
			}
		}
	};

	mancala.update_board();

	mancala.player_one_pits.forEach(function (pit, index) {
		pit.setAttribute('data-pit', index);
		pit.onclick = function () {
			if (mancala.player === 'one' && ! mancala.game_over) {
				mancala.do_user_move(this.getAttribute('data-pit'));
			}
		};
	});

	mancala.player_two_pits.forEach(function (pit, index) {
		pit.setAttribute('data-pit', index);
		pit.onclick = function () {
			if (mancala.player === 'two' && ! mancala.game_over) {
				mancala.do_user_move(this.getAttribute('data-pit'));
			}
		};
	});

})();
