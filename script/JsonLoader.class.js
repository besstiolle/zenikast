
import { UI } from './UI.class'

const DEFAULT_ARTIST = 'zenika'
const DEFAULT_ALBUM = 'Animé par la passion'
const DEFAULT_DURATION = '00:00'
const DEFAULT_ALBUM_ART = './medias/zenika.png'

export class JsonLoader {

    static loadJson(json_url){
        return fetch(json_url)
          .then(response => response.json())
          .then((json) => { 
            let songs = []
            json.forEach(entry => {
                songs.push( new Song(entry))
            });
            return songs
          })
    }
}



class Song{
    constructor(entry){
        this.name=entry.name
        this.artist = entry.artist ? entry.artist : DEFAULT_ARTIST,
        this.album= entry.album ? entry.album : DEFAULT_ALBUM,
        this.duration = entry.duration ? entry.duration : DEFAULT_DURATION,
        this.url = entry.url,
        this.cover_art_url = entry.cover_art_url ? entry.cover_art_url : DEFAULT_ALBUM_ART,
        this.time_callbacks = {
            1: function(){
                UI.time_callbacks(1)
            },
            5: function(){
                UI.time_callbacks(5)
            },
            10: function(){
                UI.time_callbacks(10)
            }
        }
    }
}