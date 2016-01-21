'use strict';
import Events from 'lib/Events.js';
import Skills from "lib/Skills.js";
import Social from "lib/Social.js";
import Keys from "lib/Keys.js";

class Engine{
  constructor(){
    this.events = new Events();
    this.skills = new Skills();
    this.social = new Social();
    this.projects = new Keys("Key Projects",[
      ["Electron","electron.png","Build a media library software with a web-based UI"]
    , ["Jenkins","jenkins.png","Management of a Continuous Integration system"]
    , ["Freedesktop","freedesktop.png","XDG's DE and thumbnails services using nodejs"]
    , ["Jekyll","jekyll.png","<a href='http://dev.holusion.com'>dev.holusion.com</a> : A static website with Jekyll"]
    ]);
    this.hobbies = new Keys("Hobbies",[
      ["Sailboat","hobie-16.jpg","Sailing Boats since I'm a child"]
    , ["Bikes","bike.png","Commuting by bike since 2011. Occasional Cross-country"]
    , ["Hacking","rpi.jpg","Strong DIY culture, love to play with electronic stuff for fun"]
    ]);
  }
  render(){
    this.replace("events",this.events.render());
    this.replace("skills",this.skills.render());
    this.replace("social",this.social.render());
    this.replace("projects",this.projects.render());
    this.replace("hobbies",this.hobbies.render());
  }
  replace(id,n){
    var old = document.getElementById(id);
    if(old){
      old.appendChild(n);
    }else{
      console.warn("can't find anchor with id : ",id);
    }
  }
}

var engine = new Engine();
engine.render();
