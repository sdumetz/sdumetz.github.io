import Element from "lib/Element.js"

export default class ElementList extends Element{
  constructor(name){
    super();
    this._list = [];
    var title = document.createElement("H4");
    this.content = document.createElement("DIV");
    this.content.className = "content grid";
    this.update();
    title.id=encodeURIComponent(name);
    title.innerHTML = name
    this._el.appendChild(title);
    this._el.appendChild(this.content);

  }
  render(){
    this.update();
    return super.render();
  }
  update(){ //FIXME quick hack for testing purposes
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
    }
    this.list().reduce(function(el,ev){
      el.appendChild(ev.render());
      return el;
    },this.content);
  }
  list(){
    return this._list;
  }
}
