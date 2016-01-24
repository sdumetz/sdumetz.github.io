import Element from "lib/Element.js"

export default class Skill extends Element{
  constructor(a1,completion){
    super();
    var name;
    if(a1 instanceof Node){
      name =a1.title;
      completion = parseInt(a1.innerHTML);
    }else{
      name = a1;
    }
    this._el.innerHTML='<div class="skill-name">'+name+'</div>'
                        +'<svg height="6" width="250">\
                            <line x1="3" y1="3" x2="247" y2="3" style="stroke:rgba(0,0,0,0.2);stroke-width:6" stroke-linecap="round"/>\
                            <line class="skill-progress" x1="3" y1="3" x2="'+completion*244/100+'" y2="3" style="stroke-width:6" stroke-linecap="round"/>\
                          </svg>';

  }
}
