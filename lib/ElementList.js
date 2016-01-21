import Element from "lib/Element.js"

export default class ElementList extends Element{
  constructor(name){
    super();
    var title = document.createElement("H4");
    title.id="events";
    title.innerHTML = name
    this._el.appendChild(title);
    this.list().reduce(function(el,ev){
      el.appendChild(ev.render());
      return el;
    },this._el);
  }
  list(){
    return []
  }
}
