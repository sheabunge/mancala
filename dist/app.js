!function(){"use strict";window.mancala={player:"one",pits:[4,4,4,4,4,4,0,4,4,4,4,4,4,0],init:function(){this.refresh_queries(),this.update_pits()},refresh_queries:function(){this.current_player_pits=document.querySelectorAll(".row.player-"+this.player+" .pit p"),this.other_player_pits=document.querySelectorAll(".row.player-"+this.get_other_player()+" .pit p"),this.current_player_store=document.querySelector(".store.player-"+this.player+" p"),this.other_player_store=document.querySelector(".store.player-"+this.get_other_player()+" p")},update_pits:function(){for(var a=0;13>=a;a++)this.update_pit(a)},update_pit:function(a,b){2===arguments.length?this.pits[a]=b:b=this.pits[a],0===b&&(b=""),6===a?this.current_player_store.textContent=b:13===a?this.other_player_store.textContent=b:6>a?this.current_player_pits[a].textContent=b:a>6&&(this.other_player_pits[a-7].textContent=b)},get_other_player:function(){return"one"===this.player?"two":"one"},do_player_turn:function(a){var b=this.move_stones(a);return this.check_game_over()?!0:(b&&(this.switch_turn(),localStorage.setItem("player",this.player)),void localStorage.setItem("stones",JSON.stringify(this.pits)))},switch_turn:function(){this.player=this.get_other_player();var a=this.pits.slice(0,7),b=this.pits.slice(7,14);this.pits=b.concat(a),this.init();var c=this.player;setTimeout(function(){document.body.setAttribute("data-player",c),document.querySelector(".current-player").textContent=c},700)},move_stones:function(a){if(this.pits[a]<1)return!1;var b=this.pits[a];this.update_pit(a,0);for(var c=a;b>0;)++c,c>12&&(c=0),this.pits[c]++,b--,this.update_pit(c);var d=12-c;return 6>c&&1===this.pits[c]&&this.pits[d]>0&&(this.pits[6]+=this.pits[d]+1,this.update_pit(6),this.update_pit(c,0),this.update_pit(d,0)),6!==c},check_game_over:function(){var a=function(a){return a.every(function(a){return 0===a})},b=a(mancala.pits.slice(0,6)),c=a(mancala.pits.slice(7,13));if(!b&&!c)return!1;document.body.classList.add("game-over");var d;if(b&&!c)for(d=7;13>d;d++)this.pits[13]+=this.pits[d],this.pits[d]=0;else if(c&&!b)for(d=0;6>d;d++)this.pits[6]+=this.pits[d],this.pits[d]=0;this.update_pits();var e=document.querySelector(".status");return this.pits[6]>this.pits[13]?e.textContent="Player "+this.player+" wins!":this.pits[13]>this.pits[6]?e.textContent="Player "+this.get_other_player()+" wins!":e.textContent="Draw!",this.player="",!0}},localStorage.getItem("player")?(mancala.player=localStorage.getItem("player"),mancala.pits=JSON.parse(localStorage.getItem("stones"))):(localStorage.setItem("player",mancala.player),localStorage.setItem("stones",JSON.stringify(mancala.pits))),mancala.init();var a=!0,b=function(b,c){for(var d=function(){if(mancala.player===b&&a){a=!1;var c=parseInt(this.getAttribute("data-pit"));mancala.do_player_turn(c)||(a=!0)}},e=0;e<c.length;e++)c[e].setAttribute("data-pit",e),c[e].onclick=d};b("one",document.querySelectorAll(".row.player-one .pit")),b("two",document.querySelectorAll(".row.player-two .pit"))}();
//# sourceMappingURL=app.js.map