/**
 * Manages the game state in localStorage
 */
(function () {
    'use strict';

    /**
     * Load the game state from localStorage
     */
    Game.prototype.load_game = function () {

        /* Remove old items */
        if (localStorage.getItem('stones')) {
            localStorage.removeItem('stones');
            localStorage.removeItem('player');
        }

        if (localStorage.getItem('current_pits')) {
            this.mancala.current_store = parseInt(localStorage.getItem('current_store'));
            this.mancala.other_store = parseInt(localStorage.getItem('other_store'));

            this.mancala.current_pits = JSON.parse(localStorage.getItem('current_pits'));
            this.mancala.other_pits = JSON.parse(localStorage.getItem('other_pits'));

            if ('two' === localStorage.getItem('player')) {
                this.switch_turn();
            }

        } else {
            this.save_game();
        }
    };

    /**
     * Save the game state to localStorage
     */
    Game.prototype.save_game = function () {
        localStorage.setItem('player', this.player);

        localStorage.setItem('current_store', JSON.stringify(this.mancala.current_store));
        localStorage.setItem('other_store', JSON.stringify(this.mancala.other_store));

        localStorage.setItem('current_pits', JSON.stringify(this.mancala.current_pits));
        localStorage.setItem('other_pits', JSON.stringify(this.mancala.other_pits));
    };

    /**
     * Reset the game state in localStorage
     */
    Game.prototype.reset_game = function () {
        localStorage.removeItem('player');
        localStorage.removeItem('current_store');
        localStorage.removeItem('other_store');
        localStorage.removeItem('current_pits');
        localStorage.removeItem('other_pits');
    };

})();