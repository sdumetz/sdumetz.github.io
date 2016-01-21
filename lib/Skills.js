import Element from "/lib/Element.js"
import Skill from "lib/Skill.js"
export default class Skills extends Element {
  constructor(){
    super();
    this.list().reduce(function(el,skill){
      el.appendChild(skill.render());
      return el;
    },this._el);
  }
  list() {
    return [
      new Skill("nodejs",90)
    , new Skill("GNU/linux Operations",75)
    , new Skill("C/C++",65)
    , new Skill("Shell/Bash",70)
    , new Skill("Provisionning - Puppet",80)
    ]
  }
}
