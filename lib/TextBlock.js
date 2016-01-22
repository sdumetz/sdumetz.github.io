import Element from "lib/Element.js"

export default class TextBlock extends Element{

  constructor(){
    super();
    this._el.innerHTML= '<h4>About Me</h4>'
                        +'<div>'
                          +'<svg class="textblock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\
                              <path d="M0 0h24v24H0z" fill="none"/>\
                              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>\
                          </svg>'
                          + 'Passionate about Solving problems, Design thinking and technologies. My entrepreneur adventure was just about that : Solving real world problems without anyone to show the way, designing from the ground up a product, an infrastructure, services, etc... And learning to share, hire the good people, communicate about what makes a project great. That\'s what I love about my job.'
                        +'</div>'
  }
}
