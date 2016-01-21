import Event from "lib/Event.js"
import Element from "lib/Element.js"

export default class Events extends Element{
  constructor(){
    super();
    this.list().reduce(function(el,ev){
      el.appendChild(ev.render());
      return el;
    },this._el);
  }
  list(){
    return [
      new Event("2013-now","CTO at Holusion","hardware and software production, maintainance, operations management. Secondary work on Business strategy founding.")
    , new Event("2013, 4 month","Intern at Mobivia group","Building a test bench for in-shop benchmark and demonstration of electric bikes capacities.")
    , new Event("2008-2013","Master in engineering at ISEN Lille","High technologies and Innovation Design, Studying a wide range of technical subjects, from Transistors' quantum physics mechanisms to computer science.")
    ]
  }
}
