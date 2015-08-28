var game = (function () {
	'use strict';

	var game = new Game();
	game.load_game();

	game.init();
	var waiting_for_move = true;

	/**
	 * Initialize pit elements as
	 * @param  {string}   player The player who the row belongs to
	 * @param  {NodeList} row    The pit elements to initialize
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

		for (var i = 0; i < row.length; i++) {
			row[i].setAttribute('data-pit', i);
			row[i].onclick = onclick;
		}
	};

	init_pits('one', document.querySelectorAll('.row.player-one .pit'));
	init_pits('two', document.querySelectorAll('.row.player-two .pit'));

	document.querySelector('.new-game').onclick = function () {
		localStorage.removeItem('player');
		localStorage.removeItem('stones');
		window.location.reload();
	};

	return game;
})();
