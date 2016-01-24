import Element from "lib/Element.js"

export default class Social extends Element{
  constructor(title,list){
    super()
    var t = document.createElement("div");
    t.innerHTML = title;
    t.style.textAlign= "right";
    t.style.fontWeight = "bold";
    t.style.paddingTop = "5px"
    for (let node of list){
      if(!node.href || !node.innerHTML) continue;
      this._el.appendChild(this.socialIcon(node.innerHTML,node.href))
    }

    this._el.appendChild(t); //title appended last because we're in float:right
  }
  socialIcon(name,target){
    var d = document.createElement("DIV");
    var l = document.createElement("A");
    var c = document.createElement("DIV");
    d.className = "rs";
    l.target = "_blank"
    l.href = target;
    l.title = name;
    c.style.backgroundImage = 'url("/data/sprites/'+name.toLowerCase()+'.png")';
    c.id=encodeURIComponent(name);
    l.appendChild(c);
    d.appendChild(l);
    return d
  }
}
