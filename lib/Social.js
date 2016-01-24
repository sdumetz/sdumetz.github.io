import Element from "lib/Element.js"

export default class Social extends Element{
  constructor(title,list){
    super()
    for (let node of list){
      if(!node.href || !node.innerHTML) continue;
      this._el.appendChild(this.socialIcon(node.innerHTML,node.href))
    }
  }
  socialIcon(name,target){
    var d = document.createElement("DIV");
    var l = document.createElement("A");
    var c = document.createElement("DIV");
    d.className = "rs";
    l.target = "_blank"
    l.href = target;
    c.style.backgroundImage = 'url("/data/sprites/'+name.toLowerCase()+'.png")'
    l.appendChild(c);
    d.appendChild(l);
    return d
  }
}
