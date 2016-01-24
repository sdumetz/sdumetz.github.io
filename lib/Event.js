import Element from "lib/Element.js"

export default class Event extends Element{

  constructor(a1,title,desc){
    super();
    var date;
    if(a1 instanceof Node){
      date = a1.dataset.date;
      title = a1.title;
      desc = a1.innerHTML;
    }else{
      date = a1; //legacy
    }
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
