import ElementList from "/lib/ElementList.js"
import Skill from "lib/Skill.js"
export default class Skills extends ElementList {
  constructor(){
    super("Skills");
  }
  list() {
    return [
      new Skill("Javascript - ES6",90)
    , new Skill("GNU/linux Operations",75)
    , new Skill("C/C++",65)
    , new Skill("Shell - Bash",70)
    , new Skill("Provisionning - Puppet",80)
    ]
  }
}
