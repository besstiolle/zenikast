import { UI } from './UI.class'
import { AmplitudeWrapper } from './AmplitudeWrapper.class'
import { JsonLoader } from './JsonLoader.class'

const urlParams = new URLSearchParams(window.location.search);

JsonLoader.loadJsonPlaylists(PLAYLIST_URL).then( promise => {

  Promise.resolve(promise).then( () => {
    let url = null

    //Does Playlist with hash exist ? 
    for(let i=0; i < JsonLoader.jsonPlaylist.length; i++){
      if(JsonLoader.jsonPlaylist[i]['key'] === urlParams.get('podcast')){
        url = JsonLoader.jsonPlaylist[i]['url']
      }
    }


    //Does Playlist with hash exist ? 
    if(url){
      JsonLoader.loadJsonPodcast(url).then( promises => {
        Promise.all(promises)
          .then( () => JsonLoader.initiateSongs())
          .then(songs => {
              document.getElementById('playerwrapper').classList.remove('hidden')
              // Setup the exact number of entries for the visual playlist
              UI.processInitiatePlaylist(songs.length)
              // Bind the Amplitude player's buttons with the UI
              AmplitudeWrapper.bindUi()
              // Initiate the Amplitude player with the songs's configuration
              AmplitudeWrapper.init(songs)
          })
      })
    } else {
      document.getElementById('podcasts').classList.remove('hidden')
      UI.listPodcasts(JsonLoader.getPlaylistPopulated())
      document.getElementById('hash').classList.remove('hidden')
      UI.displayHash()
    }
  })  
})