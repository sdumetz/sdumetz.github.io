import Element from "lib/Element.js"

export default class Key extends Element{

  constructor(name,url,text){
    super();
    this._el.classList.add("mdl-card");
    this._el.classList.add("mdl-shadow--2dp");
    this._el.classList.add("cell");
    this._el.classList.add("cell-33");
    this._el.style.background = 'url(/data/'+url+') center / cover'
    this._el.innerHTML= '<div class="mdl-card__title mdl-card--expand" >'
                          + '<h4 class="mdl-card__title mdl-card--expand">'+name+'</h4>'
                        +'</div>'
                        +'<div class="mdl-card__actions">'
                          +text
                        +'</div>'

  }
}
