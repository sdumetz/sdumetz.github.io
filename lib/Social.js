import Element from "lib/Element.js"

export default class Social extends Element{
  constructor(){
    super()
    this._el.innerHTML = this.list().reduce((str,item)=>{
      return str+this.socialIcon(item.name,item.target);
    },"");
  }
  list(){
    return [
      {"name":"github","target":"https://github.com/sdumetz"}
    , {"name":"twitter","target":"https://twitter.com/SebastienDumetz"}
    ]
  }
  socialIcon(name,target){
    return '<div class="rs"><a target="_blank" href="'+target+'"><div class="'+name+'"></div></a></div>';
  }
}
