'use strict';
import Element from "./Element.js"

export default class Key extends Element{

  constructor(a1,url,text){
    super();
    var name;
    if(a1 instanceof Node){
      name =a1.title;
      url = a1.dataset.img;
      text = a1.innerHTML;
    }else{
      name = a1;
    }
    this.card = document.createElement("DIV")
    this.card.classList.add("mdl-card");
    this.card.classList.add("mdl-shadow--2dp");
    this.card.classList.add("cell");
    this.card.style.background = 'url(/data/'+url+') center / cover'
    this.card.onclick = this.toggle.bind(this);
    this._el.appendChild(this.card)
    this.longtext = this.long(text);
    this._el.appendChild(this.longtext)
    this.name = name;
    this.url = url;
    this.update(false);
  }
  toggle(){
    var parent = this._el.parentNode;
    for(let node of parent.querySelectorAll('.key.active')){
       node.classList.remove("active")
    }
    this.active = !this.active;
    if(this.active){
      this._el.classList.add("active")
    }
  }
  long(text){
    var cell = document.createElement("DIV");
    var txt = document.createElement("DIV");
    var close = document.createElement("DIV");
    close.className = "key-close";
    close.innerHTML = '<i class="material-icons">clear</i>';
    close.onclick = ()=>{
      this.toggle();
    }
    cell.className = "cell key-panel";
    cell.appendChild(close);
    cell.appendChild(txt);
    txt.innerHTML = text;
    txt.className = "key-text";
    return cell;
  }
  update(active){
    this.card.innerHTML = '<div class="mdl-card__title mdl-card--expand" >'
                        +'</div>'
                        +'<div class="mdl-card__actions icon-line">'
                          +'<i class="material-icons" >'+((active)?'remove':'add')+'</i>'+this.name
                        +'</div>';
  }
}
