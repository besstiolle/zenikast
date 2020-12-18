
const asciidoctor = require('asciidoctor')()
const Amplitude = require('amplitudejs');

export class UI {

  static regex_timer_chapter = RegExp('^t\\d+$');

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
    .then(() => { UI.bind()})
  }

  static bind(){
    //Bind clic for chapters
    UI.bindByPattern('div.time > h2:first-of-type')
    UI.bindByPattern('div.time > h3:first-of-type')
  }

  static bindByPattern(pattern){
    //Bind clic for chapters
    let elements = document.querySelectorAll(pattern)
    let timer = ""
    for (let i = 0; i < elements.length; i++){
      elements[i].addEventListener('click', function(e){
        //Not a real-time resolution of the timer.
        timer = UI.getTimerOfChapter(this)
        if(timer !== -1){Amplitude.skipTo( timer, Amplitude.getActiveIndex())}
      })
      // The real-time resolution.
      timer = UI.getTimerOfChapter(elements[i])

    }
  }

  static getTimerOfChapter(element){
    let classNames = element.parentNode.className.split(' ')
    for (let j = 0; j < classNames.length; j++){
      if(UI.regex_timer_chapter.test(classNames[j])){
        return classNames[j].substring(1)
      }
    }
    return -1;
  }

  static hash(str){
    return Array.from(str).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0)
  }
}
