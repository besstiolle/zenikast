
const asciidoctor = require('asciidoctor')()

export class UI {

  static run(config){
    UI.processLoadAsciidoc(config['active_metadata']["url"])
  }

  static processInitiatePlaylist(count){
    let html=""
    for (let pos=0; pos < count; pos++) {

      html +=`<div class="song amplitude-song-container amplitude-play-pause" data-amplitude-song-index="${pos}">
      <span class="song-number-now-playing">
        <span class="number">${pos + 1}</span>
        <img class="now-playing" src="https://521dimensions.com/img/open-source/amplitudejs/examples/flat-black/now-playing.svg"/>
      </span>

      <div class="song-meta-container">
        <span class="song-name" data-amplitude-song-info="name" data-amplitude-song-index="${pos}"></span>
        <span class="song-artist-album"><span data-amplitude-song-info="artist" data-amplitude-song-index="${pos}"></span> - <span data-amplitude-song-info="album" data-amplitude-song-index="${pos}"></span></span>
      </div>

      <span class="song-duration">
        <span data-amplitude-song-info="duration" data-amplitude-song-index="${pos}"></span>
      <span>
      </div>
`  
    } 
    document.getElementById('list').innerHTML = html
  }

  static processLoadAsciidoc(url){
    fetch(url.substring(0, url.length - 3) + "adoc")
    .then(response => response.text())
    .then((data) => { document.getElementById('content').innerHTML=asciidoctor.convert(data) })
  }
}
