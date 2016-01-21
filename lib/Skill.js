import Element from "lib/Element.js"

export default class Skill extends Element{

  constructor(date,title,desc){
    super();
    this._el.innerHTML= "<div class='skill-date'>"+date+"</div><div class='skill-main'><div class='skill-title'>"+title+"</div><div class='skill-desc'>"+desc+"</div></div>";
  }
}