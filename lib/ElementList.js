import Element from "lib/Element.js"

export default class ElementList extends Element{
  constructor(name, type, list){
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
    if(type && list){
      //console.log("list : ",list)
      if(list instanceof NodeList){
        this._list = [];
        for (let node of list){
          if(!node.className || node.className.toLowerCase() != type.prototype.constructor.name.toLowerCase()) continue;
          this._list.push(new type(node));
        }
      }else{
        this._list = list.map(function(args){
          args.unshift(type.prototype.constructor.name)//FIXME should it be something else ?
          var factory = type.bind.apply(type,args);
          return new factory();
        });
      }
    }
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
