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
    this.keys = new Keys();
  }
  render(){
    this.replace("events",this.events.render());
    this.replace("skills",this.skills.render());
    this.replace("social",this.social.render());
    this.replace("keys",this.keys.render());
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
