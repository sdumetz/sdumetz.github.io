import Element from "lib/Element.js"

export default class ElementList extends Element{
  constructor(name){
    super();
    var title = document.createElement("H4");
    var content = document.createElement("DIV");
    content.className = "content";
    title.id=encodeURIComponent(name);
    title.innerHTML = name
    this.list().reduce(function(el,ev){
      el.appendChild(ev.render());
      return el;
    },content);
    this._el.appendChild(title);
    this._el.appendChild(content);

  }
  list(){
    return []
  }
}
