var Game = (function () {
	'use strict';

	var Game = function () {
		this.player = 'one';
		this.pits = [ 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0 ];
	};

	Game.prototype.load_game = function () {

		if (localStorage.getItem('player')) {
			this.player = localStorage.getItem('player');
			this.pits = JSON.parse(localStorage.getItem('stones'));
		} else {
			localStorage.setItem('player', this.player);
			localStorage.setItem('stones', JSON.stringify(this.pits));
		}
	};

	/**
	 * Refresh the query selectors and update pit stones
	 */
	Game.prototype.init = function () {
		this.refresh_queries();
		this.update_pits();
	};

	/**
	 * Run the query selectors for the pits
	 */
	Game.prototype.refresh_queries = function () {
		this.current_player_pits = document.querySelectorAll('.row.player-' + this.player + ' .pit p');
		this.other_player_pits = document.querySelectorAll('.row.player-' + this.get_other_player() + ' .pit p');
		this.current_player_store = document.querySelector('.store.player-' + this.player + ' p');
		this.other_player_store = document.querySelector('.store.player-' + this.get_other_player() + ' p');
	};

	/**
	 * Update the stones on the page
	 */
	Game.prototype.update_pits = function () {

		for (var i = 0; i <= 13; i++) {
			this.update_pit(i);
		}
	};

	/**
	 * Update the number of stones in a pit
	 * @param {Number} pit The pit ID
	 */
	Game.prototype.update_pit = function (pit, stones) {

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
	};

	/**
	 * Retrieve the name of the player not currently having a turn
	 * @return {string}
	 */
	Game.prototype.get_other_player = function () {
		return this.player === 'one' ? 'two' : 'one';
	};

	/**
	 * Perform the move for a player
	 * @param {Number}  starting_pit The ID of the pit to begin in
	 * @param {Boolean}              false if the game is now over
	 */
	Game.prototype.do_player_turn = function (starting_pit) {

		// perform the player's action
		var turn_over = this.move_stones(starting_pit);

		// make sure that a player hasn't run out of stones
		if (this.check_game_over()) {
			return true;
		}

		// change the player if the current turn is ended
		if (turn_over) {
			this.switch_turn();
			localStorage.setItem('player', this.player);
		}

		localStorage.setItem('stones', JSON.stringify(this.pits));
	};

	/**
	 * Change the user currently having a turn
	 */
	Game.prototype.switch_turn = function () {
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
	};

	/**
	 * Distribute the stones from a pit around the board
	 * @param  {Integer} starting_pit The pit to begin in
	 * @return {Boolean}              Whether the user's turn has ended
	 */
	Game.prototype.move_stones = function (starting_pit) {

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
	};

	/**
	 * Check if the game should end
	 * @return {Boolean} Whether the game is over
	 */
	Game.prototype.check_game_over = function () {

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

		var current_player_out = is_row_empty(this.pits.slice(0, 6));
		var other_player_out = is_row_empty(this.pits.slice(7, 13));

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
	};

	return Game;
})();
