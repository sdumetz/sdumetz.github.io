import Event from "lib/Event.js"
import ElementList from "lib/ElementList.js"

export default class Events extends ElementList{
  constructor(){
    super("Experiences");
  }
  list(){
    return [
      new Event("2013-now","CTO at Holusion","hardware and software production, maintainance, operations management. Secondary work on Business strategy founding.")
    , new Event("2013, 4 month","Intern at Mobivia group","Building a test bench for in-shop benchmark and demonstration of electric bikes capacities.")
    , new Event("2008-2013","Master in engineering at ISEN Lille","High technologies and Innovation Design, Studying a wide range of technical subjects, from Transistors' quantum physics mechanisms to computer science.")
    ]
  }
}
