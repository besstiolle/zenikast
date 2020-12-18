
const Amplitude = require('amplitudejs');

import { UI } from './UI.class'

var refresh = function(){
  UI.run(Amplitude.getConfig())
}
UI.processInitiatePlaylist(2)


window.onkeydown = function(e) {
    return !(e.keyCode == 32);
};

/*
  Handles a click on the down button to slide down the playlist.
*/
document.getElementsByClassName('down-header')[0].addEventListener('click', function(){
  var list = document.getElementById('list');

  list.style.height = ( parseInt( document.getElementById('flat-black-player-container').offsetHeight ) - 135 ) + 'px';

  document.getElementById('list-screen').classList.remove('slide-out-top');
  document.getElementById('list-screen').classList.add('slide-in-top');
  document.getElementById('list-screen').style.display = "block";
});

/*
  Handles a click on the up arrow to hide the list screen.
*/
document.getElementsByClassName('hide-playlist')[0].addEventListener('click', function(){
  document.getElementById('list-screen').classList.remove('slide-in-top');
  document.getElementById('list-screen').classList.add('slide-out-top');
  document.getElementById('list-screen').style.display = "none";
});

/*
  Handles a click on the song played progress bar.
*/
document.getElementById('song-played-progress').addEventListener('click', function( e ){
  var offset = this.getBoundingClientRect();
  var x = e.pageX - offset.left;

  Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
});

document.querySelector('img[data-amplitude-song-info="cover_art_url"]').style.height = document.querySelector('img[data-amplitude-song-info="cover_art_url"]').offsetWidth + 'px';

Amplitude.init({
  "bindings": {
    37: 'prev',
    39: 'next',
    32: 'play_pause'
  },
  "songs": [
    {
        "name": "00 - Intro",
        "artist": "Kevin",
        "album": "Zenika",
        "duration":"01:08",
        "url": "./medias/POD_ARK_00_Intro.mp3",
        "cover_art_url": "./medias/zenika.png",
    		"time_callbacks": {
      			1: function(){
        			console.log( "1 second into the song" )
      			},
      			90: function(){
        			console.log( "1 minute 30 seconds into the song" );
      			},
      			110: function(){
        			console.log( "1 minute 50 seconds into the song" );
      			}
    		}
    },
    {
        "name": "01 - Pourquoi l'agilité ?",
        "artist": "Kevin",
        "album": "Zenika",
        "duration":"16:23",
        "url": "./medias/POD_ARK_01_Pourquoi_L_Agilite.mp3",
        "cover_art_url": "./medias/zenika.png",
    		"time_callbacks": {
      			1: function(){
        			console.log( "1 second into the song" )
      			},
      			90: function(){
        			console.log( "1 minute 30 seconds into the song" );
      			},
      			110: function(){
        			console.log( "1 minute 50 seconds into the song" );
      			}
    		}
    }
  ],
  "default_album_art": "./medias/zenika.png",
		 callbacks: {
      loadstart: function(){refresh()}
     }
});
