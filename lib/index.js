'use strict';
import Skills from 'lib/Skills.js';
class Engine{
  constructor(){
    this.skills = new Skills();
  }
  render(){
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
