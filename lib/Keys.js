import Key from "lib/Key.js"
import ElementList from "lib/ElementList.js"

export default class Keys extends ElementList{
  constructor(){
    super("Key Projects");
  }
  list(){
    return [
      new Key("Electron","electron.png","Build a media library software with a web-based UI")
    , new Key("Jenkins","jenkins.png","Management of a Continuous Integration system")
    , new Key("Freedesktop","freedesktop.png","XDG's DE and thumbnails implementation using nodejs")
    , new Key("Jekyll","jekyll.png","made <a href='http://dev.holusion.com'>dev.holusion.com</a> : A static website with Jekyll")
    ]
  }
}
