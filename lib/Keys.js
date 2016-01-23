import Key from "lib/Key.js"
import ElementList from "lib/ElementList.js"

export default class Keys extends ElementList{
  constructor(name,list){
    super(name,Key,list);
  }
}
