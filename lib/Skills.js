import Skill from "lib/Skill.js"
import Element from "lib/Element.js"

export default class Skills extends Element{
  constructor(){
    super();
    this.list().reduce(function(el,skill){
      return el.appendChild(skill.render());
    },this._el);
  }
  list(){
    return [
      new Skill("2013-now","CTO at Holusion","hardware and software production, maintainance, Innovation projects management"),
      new Skill("2013, mai - sept.","Intern at Mobivia group","Building a test bench for in-shop benchmark and demonstration of electric bikes capacities")
    ]
  }
}
