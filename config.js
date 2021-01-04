/**
 * URL to the playlist*S* json file which contains the map hash => playlist
 **/
const PLAYLIST_URL="./medias/playlists_sample.json"

/**
 * Default Artist & Album if not provided in songs configuration 
 **/
const DEFAULT_ARTIST = 'zenika'
const DEFAULT_ALBUM = 'Animé par la passion'

/**
 * Default Duration if not provided in songs configuration 
 **/
const DEFAULT_DURATION = '00:00'

/**
 * Default Album Art Cover if not provided in songs configuration
 * Must be a ratio 1:1 at last.
 **/
const DEFAULT_ALBUM_ART = './assets/zenika.png'

/**
 * Regex to capture timestamp from Adoc file 
 **/
const REGEX_TIMER_ADOC = /\.time\.t(\d+)/g

/**
 * Used only with cheap webserver. 
 * Prefering 'HEAD' in production
 **/
const DOES_EXISTS_HTTP_WORD = 'GET'