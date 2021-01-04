
import { UI } from './UI.class'

export class JsonLoader {

    static templates = new Map()
    static jsonPodcast = ""
    static jsonPlaylist = ""
    static cache = new Map()

    static loadJsonPlaylists(json_url){
        return new Promise((resolve) => {
            fetch(json_url)
                .then(response => response.json())
                .then( jsonPlaylist => { 
                    JsonLoader.jsonPlaylist = jsonPlaylist
                    resolve()
                })
        })
    }

    static loadJsonPodcast(json_url){
        let promises = []

        return new Promise((resolve) => {
            fetch(json_url)
                .then(response => response.json())
                .then( jsonPodcast => { 
                    JsonLoader.jsonPodcast = jsonPodcast
                    //pre-load adoc & put it in cache
                    JsonLoader.jsonPodcast.podcast_tracks.forEach(entry => {
                        promises.push(JsonLoader.getAsciidoc(entry.url.substring(0, entry.url.length - 3) + "adoc"))
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

        JsonLoader.jsonPodcast.podcast_tracks.forEach(entry => {
            hash = JsonLoader.hash(entry.url.substring(0, entry.url.length - 3) + "adoc")
            timers = []
            if(JsonLoader.templates.has(hash)){
                matchs = JsonLoader.templates.get(hash).match(REGEX_TIMER_ADOC)
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
            return new Promise((resolve) => {resolve(JsonLoader.templates.get(hash))})
        } 

        return new Promise((resolve) => {
            fetch(url)
              .then(response => response.text())
              .then(data => {
                  JsonLoader.templates.set(hash, data)
                  resolve(JsonLoader.templates.get(hash))}
                )
        })
    }

    static getPlaylistPopulated(){
        let urls = []
        JsonLoader.jsonPlaylist.forEach(playlist => {
            urls.push(playlist['url'])
        });

        return new Promise((resolve) => {
            //Preload Json, put result in cache then ...
            Promise.all(JsonLoader.preFetchJson(urls)).then(() => {
                for(let i = 0; i < JsonLoader.jsonPlaylist.length; i++){
                    JsonLoader.jsonPlaylist[i]['meta'] = JsonLoader.cache.get(JsonLoader.hash(JsonLoader.jsonPlaylist[i]['url']))
                }
                resolve()
            })
        })
    }

    static preFetchJson(urls){
        let promises = []
        urls.forEach(url => {
            //TODO: check cache
            promises.push(
                new Promise((resolve) => {
                    fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        JsonLoader.cache.set(JsonLoader.hash(url), data)
                        resolve()
                    })
                })
            )  
        })
        
        return promises
    }
  
    static hash(str){
        return Array.from(str).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0)
    }

    static uuidMinimal() {
        return ([1e4]+"").replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
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