import ElementList from "./ElementList.js"
import Skill from "./Skill.js"
export default class Skills extends ElementList {
  constructor(name,list){
    super(name, Skill,list);
  }

}
