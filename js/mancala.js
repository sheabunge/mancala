/**
 * Manages the mancala board
 */
var Mancala = (function () {
	'use strict';

	/**
	 * Initialise class
	 * @param {Game} game
	 */
	var Mancala = function (game) {
		this.game = game;

		this.current_pits = [4, 4, 4, 4, 4, 4];
		this.other_pits = [4, 4, 4, 4, 4, 4];
		this.current_store = 0;
		this.other_store = 0;
	};

	/**
	 * Exchange the players' positions on the board
	 */
	Mancala.prototype.flip_board = function () {
		var current_pits = this.current_pits;
		this.current_pits = this.other_pits;
		this.other_pits = current_pits;

		var current_store = this.current_store;
		this.current_store = this.other_store;
		this.other_store = current_store;
	};

	/**
	 * Retrieve the amount of stones in a pit
	 * @param  {Number} pit The pit number
	 * @return {Number}     The amount of stones
	 */
	Mancala.prototype.get_stones = function (pit) {

		if (pit === 6) {
			return this.current_store;
		} else if (pit === 13) {
			return this.other_store;
		} else if (pit < 6) {
			return this.current_pits[pit];
		} else if (pit > 6) {
			return this.other_pits[pit - 7];
		}

		return NaN;
	};

	/**
	 * Set the amount of stones in a pit
	 * @param {Number} pit    The pit number
	 * @param {Number} stones The amount of stones
	 */
	Mancala.prototype.set_stones = function (pit, stones) {

		if (pit === 6) {
			this.current_store = stones;
		} else if (pit === 13) {
			this.other_store = stpnes;
		} else if (pit < 6) {
			this.current_pits[pit] = stones;
		} else if (pit > 6) {
			this.other_pits[pit - 7] = stones;
		}
	};

	/**
	 * Adjust the amount of stones in a pit
	 * @param {Number} pit    The pit number
	 * @param {Number} stones The amount of stones
	 */
	Mancala.prototype.add_stones = function (pit, stones) {

		if (pit === 6) {
			this.current_store += stones;
		} else if (pit === 13) {
			this.other_store[pit] += stpnes;
		} else if (pit < 6) {
			this.current_pits[pit] += stones;
		} else if (pit > 6) {
			this.other_pits[pit - 7] += stones;
		}
	};

	/**
	 * Distribute the stones from a pit around the board
	 * @param {Number} pit The pit to begin in
	 * @return {Boolean} Whether the user's turn has ended
	 */
	Mancala.prototype.move_stones = function (pit) {

		// return if pit has no stones
		if (this.get_stones(pit) < 1) {
			return false;
		}

		// take stones out of pit
		var stones = this.get_stones(pit);
		this.set_stones(pit, 0);
		this.game.draw_stones(pit);

		while (stones > 0) {
			++pit;

			// wrap around the board before reaching other player's store
			if (pit > 12) {
				pit = 0;
			}

			this.add_stones(pit, 1);
			stones--;
			this.game.draw_stones(pit);
		}

		// Invert the pit number (number of opposite pit in opponent's row)
		var inverse = 5 - pit;

		// Check for capture
		if (pit < 6 && this.current_pits[pit] === 1 && this.other_pits[inverse] > 0) {

			// Transfer this pit's stones along with opposite pit's stones to store
			this.current_store += this.other_pits[inverse] + 1;
			this.game.draw_stones(6);

			// Clear the pits
			this.current_pits[pit] = 0;
			this.other_pits[inverse] = 0;
			this.game.draw_stones(pit);
			this.game.draw_stones(12 - pit);
		}

		// the user's turn ended if the stones did not end in the storage pit
		return pit !== 6;
	};

	/**
	 * Check if a player has won
	 * @return {Number} -1 for no win, 0 for draw, 1 for player one win, 2 for player two win
	 */
	Mancala.prototype.check_winner = function () {

		/**
		 * Check if a row on the board is empty
		 * @param {Array} pits The pits to check
		 * @return {Boolean} true all of the pits contain no stones
		 */
		var is_row_empty = function (pits) {
			return pits.every(function (stones) {
				return stones === 0;
			});
		};

		var current_player_out = is_row_empty(this.current_pits);
		var other_player_out = is_row_empty(this.other_pits);

		// the game is not over if neither player has an empty row
		if (! current_player_out && ! other_player_out) {
			return -1;
		}

		// Move the stones remaining in a player's row into their store
		var pit;

		if (current_player_out && ! other_player_out) {
			for (pit = 0; pit < 6; pit++) {
				this.other_store += this.other_pits[pit];
				this.other_pits[pit] = 0;
			}

		} else if (other_player_out && ! current_player_out) {
			for (pit = 0; pit < 6; pit++) {
				this.current_store += this.current_pits[pit];
				this.current_pits[pit] = 0;
			}
		}

		this.game.draw_all_stones();

		if (this.current_store > this.other_store) {
			// current player wins
			return this.game.player === 'two' ? 2 : 1;

		} else if (this.other_store > this.current_store) {
			// other player wins
			return this.game.player === 'two' ? 1 : 2;

		} else {
			return 0;
		}
	};

	return Mancala;
})();
