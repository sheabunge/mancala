var game = (function () {
	'use strict';

	var game = new Game(Mancala);
	game.load_game();

	game.init();
	var waiting_for_move = true;

	/**
	 * Initialize pit elements as
	 * @param {String}   player The player who the row belongs to
	 * @param {NodeList} row    The pit elements to initialize
	 */
	var init_pits = function (player, row) {
		var onclick = function () {
			if (game.player === player && waiting_for_move) {
				waiting_for_move = false;
				var pit = parseInt(this.getAttribute('data-pit'));
				if (!game.do_player_turn(pit)) {
					waiting_for_move = true;
				}
			}
		};

		for (var pit = 0; pit < row.length; pit++) {
			row[pit].setAttribute('data-pit', pit);
			row[pit].onclick = onclick;
		}
	};

	init_pits('one', document.querySelectorAll('.row.player-one .pit'));
	init_pits('two', document.querySelectorAll('.row.player-two .pit'));

	document.querySelector('.new-game').onclick = function () {
		game.reset_game();
		window.location.reload();
	};

	return game;
})();
