import ElementList from "/lib/ElementList.js"
import Skill from "lib/Skill.js"
export default class Skills extends ElementList {
  constructor(name,list){
    super(name, Skill,list);
  }

}
