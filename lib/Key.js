'use strict';
import Element from "lib/Element.js"

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
    this._el.classList.add("mdl-card");
    this._el.classList.add("mdl-shadow--2dp");
    this._el.classList.add("cell");
    this._el.style.background = 'url(/data/'+url+') center / cover'
    this.longtext = this.long(text);
    this.name = name;
    this.url = url;
    this.update(false);
    this._el.onclick = this.toggle.bind(this);
  }
  toggle(){
    var parent = this._el.parentNode;
    for (var child of parent.childNodes){
      child.classList.toggle("in");
    }
    this._el.classList.remove("in");
    if(this.longtext.parentNode){
      this.update(false);
      parent.removeChild(this.longtext)
    }else{
      this.update(true);
      parent.appendChild(this.longtext);
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
    cell.className = "cell box key-panel";
    cell.style.width="300px"
    cell.style.flexGrow="2";
    cell.appendChild(close);
    cell.appendChild(txt);
    txt.innerHTML = text;
    txt.className = "key-text";
    return cell;
  }
  update(active){
    this._el.innerHTML = '<div class="mdl-card__title mdl-card--expand" >'
                        +'</div>'
                        +'<div class="mdl-card__actions icon-line">'
                          +'<i class="material-icons" >'+((active)?'remove':'add')+'</i>'+this.name
                        +'</div>';
  }
}