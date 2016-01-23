import Event from "lib/Event.js"
import ElementList from "lib/ElementList.js"

export default class Events extends ElementList{
  constructor(name,list){
    super(name,Event,list);
  }

}
