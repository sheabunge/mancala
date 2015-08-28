var Mancala = (function () {
	'use strict';

	var Mancala = function (game, stones) {
		stones = stones || [ 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0 ];
		this.stones = stones;
		this.game = game;
	};

	Mancala.prototype.set_stones = function (stones) {
		this.stones = stones;
	};

	Mancala.prototype.flip_board = function () {
		this.stones = this.stones.slice(7, 14).concat(
			this.stones.slice(0, 7)
		);
	};

	/**
	 * Distribute the stones from a pit around the board
	 * @param  {Integer} starting_pit The pit to begin in
	 * @return {Boolean}              Whether the user's turn has ended
	 */
	Mancala.prototype.move_stones = function (starting_pit) {

		// return if pit has no stones
		if (this.stones[starting_pit] < 1) {
			return false;
		}

		// take stones out of pit
		var stones = this.stones[starting_pit];
		this.game.update_pit(starting_pit, 0);

		var pointer = starting_pit;
		while (stones > 0) {
			++pointer;

			// wrap around the board before reaching other player's store
			if (pointer > 12) {
				pointer = 0;
			}

			this.stones[pointer]++;
			stones--;
			this.game.update_pit(pointer);
		}

		// the number of the pit opposite
		var inverse_pointer = 12 - pointer;

		// Check for capture
		if (pointer < 6 && this.stones[pointer] === 1 && this.stones[inverse_pointer] > 0) {

			// Transfer this pit's stones along with opposite pit's stones to store
			this.stones[6] += this.stones[inverse_pointer] + 1;
			this.game.update_pit(6);

			// Clear the pits
			this.game.update_pit(pointer, 0);
			this.game.update_pit(inverse_pointer, 0);
		}

		// the user's turn ended if the stones did not end in the storage pit
		return pointer !== 6;
	};

	Mancala.prototype.check_winner = function () {

		/**
		 * Check if a row on the board is empty
		 * @param  {Array}  pits The pits to check
		 * @return {Boolean}     true all of the pits contain no stones
		 */
		var is_row_empty = function (pits) {
			return pits.every(function (stones) {
				return stones === 0;
			});
		};

		var current_player_out = is_row_empty(this.stones.slice(0, 6));
		var other_player_out = is_row_empty(this.stones.slice(7, 13));

		// the game is not over if neither player has an empty row
		if (! current_player_out && ! other_player_out) {
			return -1;
		}

		// Move the stones remaining in a player's row into their store
		var pit;

		if (current_player_out && ! other_player_out) {
			for (pit = 7; pit < 13; pit++) {
				this.stones[13] += this.stones[pit];
				this.stones[pit] = 0;
			}

		} else if (other_player_out && ! current_player_out) {
			for (pit = 0; pit < 6; pit++) {
				this.stones[6] += this.stones[pit];
				this.stones[pit] = 0;
			}
		}

		this.game.update_pits();

		if (this.stones[6] > this.stones[13]) {
			// current player wins
			return this.game.player === 'two' ? 2 : 1;
		} else if (this.stones[13] > this.stones[6]) {
			// other player wins
			return this.game.player === 'two' ? 1 : 2;
		} else {
			return 0;
		}
	};

	return Mancala;
})();
