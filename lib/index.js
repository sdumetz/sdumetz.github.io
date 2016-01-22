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
      ["Electron","electron.png","Build a media library software with a web-based UI. Controllable with a tailor-made USB-HID joystick based on an arduino.<br><b>&lt;private project&gt;</b>"]
    , ["Jenkins","jenkins.png","Management of a Continuous Integration system, Using travis-CI for public repositories and Jenkins for privates."]
    , ["Freedesktop","freedesktop.png","nodejs antive implementation of XDG's <a href='http://standards.freedesktop.org/desktop-entry-spec/latest/'>Desktop Entries</a> and <a href='http://specifications.freedesktop.org/thumbnail-spec/thumbnail-spec-latest.html'>thumbnails services</a><br>Projects are open-sourced : <a href='https://github.com/Holusion/node-desktop-launch'>&lt;Desktop entries starter service&gt;</a>, <a href='https://github.com/Holusion/node-thumbnail-manager'>&lt;Thumbnails manager&gt;</a> and some of their dependencies."]
    , ["Jekyll","jekyll.png","Create, build and maintain <a href='http://dev.holusion.com'>dev.holusion.com</a> : A static website based on Jekyll and github pages.<br>The goal was to have a localized site that can be internally updated by the technical team as well as by the communication team. Hosted by Github pages, the public repo is <a href='https://github.com/Holusion/holusion.github.io'>here</a>"]
    ]);
    this.hobbies = new Keys("Hobbies",[
      ["Sailboat","hobie-16.jpg","Sailing Boats since I'm a child. I love Hobie cats, Skiffs, Dayboats, Cruiser etc..."]
    , ["Bikes","bike.png","Commuting by bike since 2011. Occasional Cross-country practice"]
    , ["Hacking","rpi.jpg","Strong DIY culture, love to play with electronic stuff for fun. Home-made Theatre PC, custom Joystick based on an Arduino..."]
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
