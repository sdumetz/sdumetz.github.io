'use strict';
import Events from 'lib/Events.js';
import Skills from "lib/Skills.js";
class Engine{
  constructor(){
    this.events = new Events();
    this.skills = new Skills();
  }
  render(){
    this.replace("events",this.events.render());
    this.replace("skills",this.skills.render());
  }
  replace(id,n){
    var old = document.getElementById(id);
    if(old){
      n.className += " "+ old.className; //FIXME rude.
      old.parentNode.replaceChild(n, old);
    }else{
      console.warn("can't find anchor with id : ",id);
    }
  }
}

var engine = new Engine();
engine.render();
