(function () {
    'use strict';

    /**
     * Update the stones on the page
     */
    Game.prototype.draw_all_stones = function () {
        var format = function (stones) {
            return stones === 0 ? '' : stones;
        };

        this.current_player_store.textContent = format(this.mancala.current_store);
        this.other_player_store.textContent = format(this.mancala.other_store);

        for (var pit = 0; pit < 6; pit++) {
            this.current_player_pits[pit].textContent = format(this.mancala.current_pits[pit]);
            this.other_player_pits[pit].textContent = format(this.mancala.other_pits[pit]);
        }
    };

    /**
     * Update the number of stones in a pit
     * @param {Number} pit The pit number
     */
    Game.prototype.draw_stones = function (pit) {
        var format = function (stones) {
            return stones === 0 ? '' : stones;
        };

        if (pit === 6) {
            this.current_player_store.textContent = format(this.mancala.current_store);
        } else if(pit === 13) {
            this.other_player_store.textContent = format(this.mancala.other_store);
        } else if (pit < 6) {
            this.current_player_pits[pit].textContent = format(this.mancala.current_pits[pit]);
        } else if (pit > 6) {
            pit -= 7;
            this.other_player_pits[pit].textContent = format(this.mancala.other_pits[pit]);
        }
    };

})();