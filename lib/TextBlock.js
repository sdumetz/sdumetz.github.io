import Element from "./Element.js"

export default class TextBlock extends Element{

  constructor(title,nodes){
    super();
    var h = document.createElement("H4");
    h.innerHTML = title;
    var div = document.createElement("DIV");
    div.innerHTML = '<svg class="textblock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                        <path d="M0 0h24v24H0z" fill="none"/>\
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>\
                    </svg>';

    for (let node of nodes){
      if(!node.innerHTML) continue;
      div.appendChild(node);
    }

    this._el.appendChild(h);
    this._el.appendChild(div);

  }
}
