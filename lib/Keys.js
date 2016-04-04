import Key from "./Key.js"
import ElementList from "./ElementList.js"

export default class Keys extends ElementList{
  constructor(name,list){
    super(name,Key,list);
  }
}
