class Listbox {
constructor (element) {
this.multiple = false;
this._selectedIndex = -1;
this.domNode = element;
element.setAttribute("role", "listbox");
element.addEventListener ("keydown", (e) => {
if (this.isEmpty()) return;
if (e.target === this.getFocus()) {
console.log("key: ", e.key);
this._keymap[e.key]();
e.preventDefault();
} else {
alert("event target and currently focused item should be the same");
} // if
}); // listen for keyup

this._keymap = {
"ArrowUp": () => {
this.focus(this.focusIndex()+1);
}, // "ArrowUp"

"ArrowDown": () => {
this.focus(this.focusIndex() - 1);
}, // "ArrowDown"

" ": () => {
if (this.multiple && this.getFocus()) {
const selected = this.getFocus().getAttribute("aria-selected");
this.getFocus().setAttribute(
"aria-selected",
selected === "true"? "false" : "true"
); // setAttribute
} // if
}, // spaceBar

"Enter": () => {
if (this.getFocus()) {
this.getFocus().click();
} // if
} // "Enter"
} // this._keymap
} // constructor

children() {
return Array.from(this.domNode.children);
} // children

isEmpty () {
return this.children().length === 0;
} // isEmpty

isValidIndex (index) {
return index >= 0 && index < this.children().length;
} // isValidIndex

get selectedIndex () {return this._selectedIndex;}
set selectedIndex (index) {
if (this.isEmpty()) return;
if (this.wrap)
index = (index < 0)? this.children.length-1 : 0;

if (this.isValidIndex(index)) {
this._selectedIndex = index;
this.setFocus(index);
} // if
} // set selectedIndex


indexOf (node) {
return this.children().indexOf(node);
} // indexOf

add (option) {
if (!(option instanceof HTMLElement)) option = this.createOption.apply (this, arguments);
option.setAttribute("role", "option");
option.setAttribute("tabindex", "-1");
this.domNode.appendChild(option);
return this;
} // add

createOption(text, value) {
if (arguments.length === 0) return null;
if (arguments.length === 1) value = text;
//console.log("createOption: ", arguments.length, text, value);
const node = document.createElement("li");
node.appendChild(document.createTextNode(text));
node.setAttribute("value", value);
return node;
} // createOption

remove (index) {
if (!this._isValidIndex(index)) throw new Error("invalid index");
this.domNode.removeChild(this.domNode.children[index]);
return this;
} // remove

item (index) {
if (this.wrap) {
if (index < 0) index = this.children().length-1;
else if (index >= this.children().length) index = 0;
} // if

return this.isValidIndex(index)?
this.children(index)
: undefined;
} // item


setFocus(index) {
if (this.isValidIndex(index)) {
const node = this.children()[index];
if (!this.multiple) {
this.unselectAll();
node.setAttribute("aria-selected", "true");
} // if

this.unfocusAll();
node.setAttribute("tabindex", "0");
node.focus();
} // if
} // setFocus

getFocus () {
return this.domNode.querySelector("[tabindex='0']");
} // getFocus

getFocusIndex () {
return this.getFocus()? this.indexOf(this.getFocus()) : -1;
} // focusIndex

unselectAll () {
this.children().forEach (node => node.setAttribute(
"aria-selected",
this.multiple? "false" : ""
)); // forEach
return this;
} // unselectAll

unfocusAll () {
if (this.getFocus()) this.getFocus().blur();
this.children().forEach (node => node.setAttribute(
"tabindex", "-1"
)); // forEach
return this;
} // unfocusAll

selectedIndex () {
const focused = this.getFocus();
if (! focused) return -1;
return Array.from(this.domNode.children).indexOf(focused);
} // selectedIndex

selectedOptions () {
const node = this.getFocus();
return node? [node] : [];
} // selectedOptions

value () {
const node = this.getFocus();
return node? node.getAttribute("value") : undefined;
} // value


_handleKey (key) {
if (this.isEmpty()) return;
return this._keymap[key]();
} // handleKey

} // Listbox

