class Listbox {
constructor (element) {
this.domNode = element;
} // constructor

allItems () {
return Array.from(this.domNode.children);
} // allItems 


add (text, value) {
const node = document.create("li");
if (arguments.length === 1) value = text;
node.setAttribute("value", value);
node.textContent = text;
this.domNode.appendChild(node);
return this;
} // add

remove (index) {
if (!this._isValidIndex(index)) throw new Error("invalid index");
this.domNode.removeChild(this.domNode.children[index]);
return this;
} // remove

item (index) {
if (!this._isValidIndex(index)) throw new Error("invalid index");
return this.domNode.children[index];
} // item

setFocus (index) {
if (arguments.length > 0 && !this._isValidIndex(index)) throw new Error("invalid index");
const node =
(arguments.length === 0 && this.getFocus())?

this.unselectAll()
.domNode.children[index].setAttribute("tabindex", "0");
domNode.children[index].focus();
return this;
} // focus

getFocus () {
return this.domNode.querySelector("[tabindex='0']");
} // getFocus

selectedIndex () {
const focused = this.getFocus();
if (! focused) return -1;
return this.domNode.children.indexOf(focused);
} // selectedIndex

selectedOptions () {
const node = this.getFocus();
return node? [node] : [];
} // selectedOptions

value () {
const node = this.getFocus();
return node? node.getAttribute("value") : undefined;
} // currentItem

isValidIndex (index) {
return index >= 0 && index < domNode.children.length;
} // isValidIndex


} // Listbox

