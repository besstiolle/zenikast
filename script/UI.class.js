
const asciidoctor = require('asciidoctor')()

export class UI {
  constructor(){
   
  }

  static run(config){
    console.info(config);
    UI.processLoadAsciidoc(config["url"])
  }

  static processLoadAsciidoc(url){
    fetch(url.substring(0, url.length - 3) + "adoc")
    .then(response => response.text())
    .then((data) => { document.getElementById('content').innerHTML=asciidoctor.convert(data) })
  }
}
