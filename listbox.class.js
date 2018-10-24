class Listbox {
constructor (element) {
this._multiple = false;
this.wrap = false;
this._selectedIndex = -1;
element.setAttribute("role", "listbox");
element.setAttribute("aria-multiselectable", "false");
element.setAttribute("style", "list-style:none;");
const container = document.createElement("div");
const label = document.createElement("span");
container.appendChild(label);
element.parentElement.replaceChild(container, element);
container.appendChild(element);
label.setAttribute("id", `label-${Math.random().toString()}`);
element.setAttribute("aria-labelledby", label.getAttribute("id"));
container.setAttribute("role", "region");

this.domNode = element;
this.container = container;
this.label = label;

this.children().forEach (node => {
node.setAttribute("role", "option");
node.setAttribute("tabindex", "-1");
}); // forEach
if (this.length > 0) this.selectedIndex = 0;


element.addEventListener ("keydown", (e) => {
if (this.isEmpty()) return;
//if (e.target === this.getFocus()) {
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

//} else {
//alert("event target and currently focused item should be the same");
//} // if
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
this.getFocus().setAttribute("aria-selected", selected === "true"? "false" : "true");
} // if
}, // spaceBar

"Enter": () => {
if (this.getFocus()) {
this.getFocus().click();
} // if
} // "Enter"
}; // this._keymap
} // constructor

children () {
return Array.from(this.domNode.children);
} // children

isEmpty () {
return this.children().length === 0;
} // isEmpty

get length () {return this.children().length;}

get multiple () {return this._multiple;}
set multiple (value) {
if (value) {
this._multiple = true;
this.domNode.setAttribute("aria-multiselectable", "true");
} else {
this.unselectAll();
this._multiple = false;
this.domNode.setAttribute("aria-multiselectable", "false");
this.focus();
} // if
} // set multiple

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
if (this.isValidIndex(this._selectedIndex)) {
const node = this.children()[this._selectedIndex];
if (!this.multiple) {
this.unselectAll();
node.setAttribute("aria-selected", "true");
} // if

this.unfocusAll();
node.setAttribute("tabindex", "0");
if (this._isFocusWithin()) node.focus();
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

pairs () {
return this.children()
.map(x => [x.textContent, x.getAttribute("value")]);
} // pairs

text () {
return this.pairs().map(x => x[0]);
} // text

values () {
return this.pairs().map(x => x[1]);
} // values

entries () {
return this.pairs()
.map(x => ({text: x[0], value: x[1]}));
} // entries

focus () {
if (this.isValidIndex(this.selectedIndex)) {
this.children()[this.selectedIndex].focus();
} // if
} // focus


getFocus () {
return this.children()[this.selectedIndex];
} // getFocus


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


selectedOptions () {
return this.children()
.filter(x => x.getAttribute("aria-selected") === "true");
} // selectedOptions


value (returnArray) {
const val = this.selectedOptions()
.map(x => x.getAttribute("value")? x.getAttribute("value") : x.textContent);
return (returnArray || this.multiple)? val : val[0];
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

_isFocusWithin () {
return this.domNode.contains(document.activeElement);
} // focusWithin

} // Listbox

