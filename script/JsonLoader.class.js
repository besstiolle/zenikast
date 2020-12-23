
import { UI } from './UI.class'

const DEFAULT_ARTIST = 'zenika'
const DEFAULT_ALBUM = 'Animé par la passion'
const DEFAULT_DURATION = '00:00'
const DEFAULT_ALBUM_ART = './assets/zenika.png'
const REGEX_tiMER_ADOC = /\.time\.t(\d+)/g

export class JsonLoader {

    static templates = new Map()
    static json = ""

    static loadJson(json_url){
        let promises = []

        return new Promise((resolve) => {
            fetch(json_url)
                .then(response => response.json())
                .then( json => { 
                    JsonLoader.json = json
                    //pre-load adoc & put it in cache
                    JsonLoader.json.forEach(entry => {
                        promises.push(JsonLoader.loadAsciidoc(entry.url.substring(0, entry.url.length - 3) + "adoc"))
                    })
                    resolve(promises)
                })
        })
    }

    static initiateSongs(){
        let songs = []
        let matchs = []
        let hash 
        let timers

        JsonLoader.json.forEach(entry => {
            hash = JsonLoader.hash(entry.url.substring(0, entry.url.length - 3) + "adoc")
            timers = []
            if(JsonLoader.templates.has(hash)){
                matchs = JsonLoader.templates.get(hash).match(REGEX_tiMER_ADOC)
                if(matchs != null){
                    matchs.forEach(match => {
                        timers.push(match.substring(7))
                    });
                }
            }
            songs.push( new Song(entry, timers))
        })
        return songs
    }

    static getAsciidoc(url){
        let hash = JsonLoader.hash(url)
        
        if(JsonLoader.templates.has(hash)) {
            return JsonLoader.templates.get(hash)
        }
        JsonLoader.loadAsciidoc(url).then( () => JsonLoader.getAsciidoc(url))
    }
    
    static loadAsciidoc(url){
        let hash = JsonLoader.hash(url)
        
        return fetch(url)
        .then(response => response.text())
        .then(data => JsonLoader.templates.set(hash, data))
    }
  
    static hash(str){
        return Array.from(str).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0)
    }

}
class Song{
    constructor(entry, timers){
        this.name = entry.name
        this.artist = entry.artist ? entry.artist : DEFAULT_ARTIST,
        this.album = entry.album ? entry.album : DEFAULT_ALBUM,
        this.duration = entry.duration ? entry.duration : DEFAULT_DURATION,
        this.url = entry.url,
        this.cover_art_url = entry.cover_art_url ? entry.cover_art_url : DEFAULT_ALBUM_ART,
        this.time_callbacks = this._initTimeCallbacks(timers)
    }

    _initTimeCallbacks(timers){
        let callbacks = {}
        timers.forEach(timer => {
            callbacks[timer] = function(){UI.time_callbacks(timer)}
        })
        return callbacks
    }
}