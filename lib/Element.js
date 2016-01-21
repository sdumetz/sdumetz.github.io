export default class Element{
  constructor(){
    this._el = document.createElement("DIV");
    this._el.className = this.__proto__.constructor.name.toLowerCase();
  }
  render(){
    return this._el;
  }
}
