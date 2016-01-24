'use strict';
import Events from 'lib/Events.js';
import Skills from "lib/Skills.js";
import Social from "lib/Social.js";
import Keys from "lib/Keys.js";
import TextBlock from "lib/TextBlock.js";

const elements = { //Stupid but import ...as...from...; doesn't work in traceur. Should explore later.
  Events:Events,
  Skills:Skills,
  Social:Social,
  Keys:Keys,
  TextBlock:TextBlock
};
class Engine{
  constructor(){
    this.social = new Social();
    this.textblock = new TextBlock();
    this.replace("social",this.social);
    this.replace("textblock",this.textblock);

    this.load().then((nodes)=>{
      for (let node of nodes){
        if(!node.className || node.className =="") continue;
        this.replace(node.id, new elements[node.className](node.title,node.childNodes));
      }
    },function(e){console.error(e.stack)})
  }

  replace(id,n){
    var old = document.getElementById(id);
    if(old){
      old.appendChild(n.render());
    }else{
      console.warn("can't find anchor with id : ",id);
    }
  }
  load(){
    return new Promise((resolve, reject)=> {
      var req = new XMLHttpRequest();
      req.open('GET', '/data/site_data.html', true);
      req.onreadystatechange = (aEvt)=> {
        if (req.readyState == 4) {
           if(req.status == 200)
            resolve(this.parse(req.responseText));
           else
            reject("Erreur pendant le chargement de la page.\n");
        }
      };
      req.send(null);
    });
  }
  parse(txt){
    var div = document.createElement("DIV");
    div.innerHTML = txt;
    return div.childNodes;
  }
}

var engine = new Engine();
