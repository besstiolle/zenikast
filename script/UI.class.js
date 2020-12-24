import { JsonLoader } from './JsonLoader.class';

const asciidoctor = require('asciidoctor')()
const Amplitude = require('amplitudejs');

export class UI {

  static regex_timer_chapter = RegExp('^t\\d+$');

  static run(config){
    UI.processSetTitle()
    UI.processLoadAsciidoc(config['active_metadata']["url"])
    UI.processLoadPdf(config['active_metadata']["url"])
  }

  static processSetTitle(){
    document.getElementById('header_h1').innerHTML = JsonLoader.jsonPodcast.podcast_title
    document.title = JsonLoader.jsonPodcast.podcast_title
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

  static processLoadAsciidoc(urlSong){
    //Retrieve from inner cache system
    let data = JsonLoader.getAsciidoc(urlSong.substring(0, urlSong.length - 3) + "adoc")
    document.getElementById('content').innerHTML = asciidoctor.convert(data)
    UI.bind()
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
  
  static time_callbacks(timer){
    console.info("time_callbacks #" + timer + "s")
    //Purge current class "time_current"
    let elements = document.getElementsByClassName("time_current")
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('time_current');
    }

    //Add class time_current where it's needed
    elements = document.getElementsByClassName("t"+timer)
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add('time_current');
    }
  }

  static processLoadPdf(urlSong){    
    //Clear current pdf frame
    document.getElementById('pdf').innerHTML = ''
    document.getElementById('pdf').classList.add('hidden')

    let url = urlSong.substring(0, urlSong.length - 3) + "pdf"
    let xhr = new XMLHttpRequest();
    let regex_http = /[2-3]\d\d/; // http code 2xx & 3xx are accepted as "the file exist"
    xhr.open(DOES_EXISTS_HTTP_WORD, url);
    xhr.send();
    xhr.onload = function() {

      //If the pdf exist, update the html object 
      if ((xhr.status+"").match(regex_http)) {
        let html = `<object data="${url}" type="application/pdf" width="100%" height="100%">
            <iframe src="${url}" style="border: none;" width="100%" height="100%">
              This browser does not support PDFs. Please download the PDF to view it: <a href="${url}">Download PDF</a>
            </iframe>
          </object>`
          document.getElementById('pdf').innerHTML = html
          document.getElementById('pdf').classList.remove('hidden')
      }
    };
  }
}
