import Key from "lib/Key.js"
import ElementList from "lib/ElementList.js"

export default class Keys extends ElementList{
  constructor(name,list){
    super(name);
    this._list = list.map(function(args){
      args.unshift("Key")//FIXME should it be something else ?
      var factory = Key.bind.apply(Key,args);
      return new factory();
    });
  }
}
