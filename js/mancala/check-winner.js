(function () {
    'use strict';

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

})();