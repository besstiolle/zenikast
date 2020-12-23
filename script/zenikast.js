import { UI } from 'UI.class'
import { AmplitudeWrapper } from 'AmplitudeWrapper.class'
import { JsonLoader } from 'JsonLoader.class'


JsonLoader.loadJson("./medias/playlist1.json").then( promises => {
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