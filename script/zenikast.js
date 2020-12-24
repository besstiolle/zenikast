import { UI } from './UI.class'
import { AmplitudeWrapper } from './AmplitudeWrapper.class'
import { JsonLoader } from './JsonLoader.class'

const urlParams = new URLSearchParams(window.location.search);
console.info("hash : " + JsonLoader.uuidMinimal())

JsonLoader.loadJsonPlaylists(PLAYLIST_URL).then( promise => {

  Promise.resolve(promise).then( () => {
    
    //Does Playlist with hash exist ? 
    if(JsonLoader.jsonPlaylist[urlParams.get('podcast')]){
      
      JsonLoader.loadJsonPodcast(JsonLoader.jsonPlaylist[urlParams.get('podcast')]).then( promises => {
        Promise.all(promises).then( () => 
          JsonLoader.initiateSongs()
        ).then(songs => {

          // Setup the exact number of entries for the visual playlist
          UI.processInitiatePlaylist(songs.length)
        
          // Bind the Amplitude player's buttons with the UI
          AmplitudeWrapper.bindUi()
        
          // Initiate the Amplitude player with the songs's configuration
          AmplitudeWrapper.init(songs)
        })
      })
    }
  })  
})