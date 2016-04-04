import Event from "./Event.js"
import ElementList from "./ElementList.js"

export default class Events extends ElementList{
  constructor(name,list){
    super(name,Event,list);
  }

}
