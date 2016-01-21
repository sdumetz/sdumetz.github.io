'use strict';
import Skills from 'lib/Skills.js';
console.log(Skills)
class Engine{
  constructor(){
    this.skills = new Skills();
  }
}

var engine = new Engine();
