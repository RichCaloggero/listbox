class Listbox {
constructor (element) {
this.multiple = false;
this.wrap = false;
this._selectedIndex = -1;
this.domNode = element;
element.setAttribute("role", "listbox");
element.setAttribute("style", "list-style:none;");

element.addEventListener ("keydown", (e) => {
if (this.isEmpty()) return;
if (e.target === this.getFocus()) {
//console.log("key: ", e.key);
const command = this._handleKey(e.key);

if (Number.isInteger(command)) {
//console.log ("match at index: ", command);
this.selectedIndex = command;
} else if (command instanceof Function) {
//console.log ("command: ", command);
command.apply(this);
e.preventDefault();
} // if

} else {
alert("event target and currently focused item should be the same");
} // if
}); // listen for keyup

this._keymap = {
"ArrowDown": () => {
const index = this._index(this.selectedIndex + 1, this.wrap);
if (this.isValidIndex(index)) this.selectedIndex = index;
}, // "ArrowDown"

"ArrowUp": () => {
const index = this._index(this.selectedIndex - 1, this.wrap);
if (this.isValidIndex(index)) this.selectedIndex = index;
}, // "ArrowDown"

"Home": () => {
this.selectedIndex = 0;
}, // Home

"End": () => {
this.selectedIndex = this.length-1;
}, // Home

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
}; // this._keymap
} // constructor

children() {
return Array.from(this.domNode.children);
} // children

isEmpty () {
return this.children().length === 0;
} // isEmpty

get length () {return this.children().length;}

isValidIndex (index) {
return index >= 0 && index < this.children().length;
} // isValidIndex

isValidOption (node) {
return this.children().indexOf(node) >= 0;
} // isValidOption

_index (index, wrap = false) {
if (wrap) {
if (index < 0) index = this.length - 1;
if (index >= this.length) index = 0;
} // wrap
return this.isValidIndex(index)? index : -1;
} // _index

get selectedIndex () {return this._selectedIndex;}
set selectedIndex (index) {
this._selectedIndex = this._index(index, this.wrap);
this.focus();
//console.log ("set selectedIndex: ", this._selectedIndex);
} // set selectedIndex


indexOf (node) {
return this.children().indexOf(node);
} // indexOf

add (option) {
if (!(option instanceof HTMLElement)) option = this.createOption.apply (this, arguments);
option.setAttribute("role", "option");
option.setAttribute("tabindex", "-1");
this.domNode.appendChild(option);
this.selectedIndex = 0;
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
return this.isValidIndex(index)?
this.children()[index] : undefined;
} // item

list () {
return this.children()
.map(x => [x.textContent, x.getAttribute("value")]);
} // list

text () {
return this.list().map(x => x[0]);
} // text

values () {
return this.list().map(x => x[1]);
} // values

focus () {
if (this.isValidIndex(this.selectedIndex))
this.setFocus(this.children()[this.selectedIndex]);
} // focus

setFocus(node) {
if (this.isValidOption(node)) {
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
} // getFocusIndex

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

/*selectedIndex () {
const focused = this.getFocus();
if (! focused) return -1;
return Array.from(this.domNode.children).indexOf(focused);
} // selectedIndex
*/

selectedOptions () {
const node = this.getFocus();
return node? [node] : [];
} // selectedOptions

value () {
const node = this.getFocus();
return node? node.getAttribute("value") : undefined;
} // value


_matchIndex (c) {
c = c.toLowerCase();
const matches = this._enumerate()
.filter (index => this.item(index).textContent.slice(0,1) === c);
//console.log("matches: ", matches);
return matches.length === 0? null : matches[0];
} // _matchIndex

_enumerate () {
let indicies = [];
let i = this.selectedIndex;

do {
i = this._index(i+1, this.wrap);
if (this.isValidIndex(i)) indicies.push(i);
} while (this.isValidIndex(i) && i !== this.selectedIndex);

return indicies;
} // enumerate

_handleKey (key) {
if (!key || this.isEmpty()) return;
if (key.length === 1
&& !/\s/.test(key)
) {
//console.log("search for: ", key);
return this._matchIndex(key);
} else {
const command = this._keymap[key];
return command? command : undefined;
} // if
} // handleKey

} // Listbox

