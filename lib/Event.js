import Element from "lib/Element.js"

export default class Event extends Element{

  constructor(date,title,desc){
    super();
    this._el.innerHTML= "<div class='event-line'>"
                          +"<div class='event-date'><div>"+date+"</div></div>"
                          +'<div class="event-separator"><i class="material-icons">fiber_manual_record</i></div>'
                          +"<div class='event-main'>"
                            +"<div class='event-title'>"+title+"</div>"
                            +"<div class='event-desc'>"+desc+"</div>"
                          +"</div>"
                        +"</div>";
  }
}
