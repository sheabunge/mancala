(function () {
	'use strict';

	/**
	 * @type {Object}
	 */
	window.mancala = {

		/**
		 * The player currently having a turn
		 * @type {String}
		 */
		player: 'one',

		/**
		 * Stores a flat array representation of the mancala board
		 * @type {Array}
		 */
		pits: [ 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0 ],

		/**
		 * Refresh the query selectors and update pit stones
		 */
		init: function () {
			this.refresh_queries();
			this.update_pits();
		},

		/**
		 * Run the query selectors for the pits
		 */
		refresh_queries: function () {
			this.current_player_pits = document.querySelectorAll('.row.player-' + this.player + ' .pit p');
			this.other_player_pits = document.querySelectorAll('.row.player-' + this.get_other_player() + ' .pit p');
			this.current_player_store = document.querySelector('.store.player-' + this.player + ' p');
			this.other_player_store = document.querySelector('.store.player-' + this.get_other_player() + ' p');
		},

		/**
		 * Update the stones on the page
		 */
		update_pits: function () {

			for (var i = 0; i <= 13; i++) {
				this.update_pit(i);
			}
		},

		/**
		 * Update the number of stones in a pit
		 * @param {Number} pit The pit ID
		 */
		update_pit: function (pit, stones) {

			if (arguments.length === 2) {
				this.pits[pit] = stones;
			} else {
				stones = this.pits[pit];
			}

			if (stones === 0) {
				stones = '';
			}

			if (pit === 6) {
				this.current_player_store.textContent = stones;
			} else if(pit === 13) {
				this.other_player_store.textContent = stones;
			} else if (pit < 6) {
				this.current_player_pits[pit].textContent = stones;
			} else if (pit > 6) {
				this.other_player_pits[pit - 7].textContent = stones;
			}
		},

		/**
		 * Retrieve the name of the player not currently having a turn
		 * @return {string}
		 */
		get_other_player: function () {
			return this.player === 'one' ? 'two' : 'one';
		},

		/**
		 * Perform the move for a player
		 * @param {Number} starting_pit The ID of the pit to begin in
		 */
		do_player_turn: function (starting_pit) {

			// perform the player's action
			var turn_over = this.move_stones(starting_pit);

			// make sure that a player hasn't run out of stones
			var game_over = this.check_for_win();

			// change the player if the current turn is ended
			if ( turn_over && ! game_over ) {
				this.switch_turn();
			}
		},

		/**
		 * Change the user currently having a turn
		 */
		switch_turn: function () {
			this.player = this.get_other_player();

			var player_one_pits = this.pits.slice(0, 7);
			var player_two_pits = this.pits.slice(7, 14);
			this.pits = player_two_pits.concat(player_one_pits);

			this.init();

			var player = this.player;
			setTimeout(function () {
				document.body.setAttribute('data-player', player);
				document.querySelector('.current-player').textContent = player;
			}, 700 );
		},


		/**
		 * Distribute the stones from a pit around the board
		 * @param  {Integer} starting_pit The pit to begin in
		 * @return {Boolean}              Whether the user's turn has ended
		 */
		move_stones: function (starting_pit) {

			// return if pit has no stones
			if (this.pits[starting_pit] < 1) {
				return false;
			}

			// take stones out of pit
			var stones = this.pits[starting_pit];
			this.update_pit(starting_pit, 0);

			var pointer = starting_pit;
			while (stones > 0) {
				++pointer;

				// wrap around the board before reaching other player's store
				if (pointer > 12) {
					pointer = 0;
				}

				this.pits[pointer]++;
				stones--;
				this.update_pit(pointer);
			}

			// the number of the pit opposite
			var inverse_pointer = 12 - pointer;

			// Check for capture
			if (pointer < 6 && this.pits[pointer] === 1 && this.pits[inverse_pointer] > 0) {

				// Transfer this pit's stones along with opposite pit's stones to store
				this.pits[6] += this.pits[inverse_pointer] + 1;
				this.update_pit(6);

				// Clear the pits
				this.update_pit(pointer, 0);
				this.update_pit(inverse_pointer, 0);
			}

			// the user's turn ended if the stones did not end in the storage pit
			return pointer !== 6;
		},

		/**
		 * Check if the game has ended
		 */
		check_for_win: function () {

			/**
			 * Check if a row on the board is emptu
			 * @param  {Array}  pits The pits to check
			 * @return {Boolean}     true all of the pits contain no stones
			 */
			var is_row_empty = function (pits) {
				return pits.every(function (stones) {
					return stones === 0;
				});
			};

			var current_player_out = is_row_empty(mancala.pits.slice(0, 6));
			var other_player_out = is_row_empty(mancala.pits.slice(7, 13));

			// the game is not over if neither player has an empty row
			if (! current_player_out && ! other_player_out) {
				return false;
			}

			document.body.classList.add('game-over');

			// Move the stones remaining in a player's row into their store
			var pit;

			if (current_player_out && ! other_player_out) {
				for (pit = 7; pit < 13; pit++) {
					this.pits[13] += this.pits[pit];
					this.pits[pit] = 0;
				}

			} else if (other_player_out && ! current_player_out) {
				for (pit = 0; pit < 6; pit++) {
					this.pits[6] += this.pits[pit];
					this.pits[pit] = 0;
				}
			}

			this.update_pits();

			var status = document.querySelector('.status');

			// Determine which player holds the most stones
			if (this.pits[6] > this.pits[13]) {
				status.textContent = 'Player ' + this.player + ' wins!';
			} else if (this.pits[13] > this.pits[6]) {
				status.textContent = 'Player ' + this.get_other_player() + ' wins!';
			} else {
				status.textContent = 'Draw!';
			}

			this.player = '';
			return true;
		}
	};

	mancala.init();

	/**
	 * Initialize pit elements as
	 * @param  {string}   player The player who the row belongs to
	 * @param  {NodeList} row    The pit elements to initialize
	 */
	var init_pits = function (player, row) {
		var onclick = function () {
			if (mancala.player === player) {
				var pit = parseInt(this.getAttribute('data-pit'));
				mancala.do_player_turn(pit);
			}
		};

		for (var i = 0; i < row.length; i++) {
			row[i].setAttribute('data-pit', i);
			row[i].onclick = onclick;
		}
	};

	init_pits('one', document.querySelectorAll('.row.player-one .pit'));
	init_pits('two', document.querySelectorAll('.row.player-two .pit'));
})();
