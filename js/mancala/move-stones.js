(function () {
    'use strict';

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

})();