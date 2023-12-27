const TAG_START = "<";
const TAG_END = ">"

function parseHTML(html) {
    if (typeof (html) != "string") { //checking if the argument provided is a string
        console.log("HTML given is not a string");
        return [];
    }
    if (html.length < 7) { /// Smallest string is <p></p> which is 7 characters
        console.log("Given String is too small.");
    }
    html = html.split(TAG_START);
    let list = [];
    for (var i = 1; i < html.length; i++) {
        let str = TAG_START + html[i];
        if (str.length == 1) continue;
        list = list.concat(splitElement(str));
    }
    console.log(list);
    reStructure(list);
    let current = new HTMLELement(list[0]);
    for (var i = 1; i < list.length - 1; i++) {
        let tag = list[i];
        if (tag.isSingle || !tag.isTag) {
            current.add(new HTMLELement(tag));
        } else if (tag.isStart) {
            let elem = new HTMLELement(tag);
            current.add(elem);
            current = elem;
        } else if (tag.isEnd && current.isStartOf(tag)) {
            current = current.parent;
        }
    }
    console.log(current);
    //console.log(list);
    return current.construct();
}
const single_Elements = ["br", "input"];
function splitElement(str) {
    let list = [];
    if (str.indexOf(TAG_END) < str.length - 1) {
        let lst = str.split(TAG_END);
        list.push(lst[0] + TAG_END, lst[1]);
    } else {
        list.push(str);
    }
    return list;
}
function reStructure(list) {
    //return list.map((item) => new HTMLTag(item));
    for (var i = 0; i < list.length; i++) {
        list[i] = new HTMLTag(list[i]);
    }
}
function getAttributes(tag) {
    if (!tag.isTag) {
        console.log(tag.elem + " is not an Element.");
        return "";
    }
    let elem = tag.elem.slice((tag.isStart) ? 1 : 2, tag.elem.length - 2);
    let attributelist = splitAttributes(elem);
    if (attributelist.length == 0) return {};
    console.log(attributelist);
    let attributes = {};
    for (let attribute of attributelist) {
        attribute = attribute.split("=");
        attributes[attribute[0]] = attribute[1];
    }
    return attributes;
}
function splitAttributes(args, outline = "\"") {
    strings = []
    let in_string = false;

    let split_args = args.split(" ");
    for (let arg of split_args) {
        arg = arg.replace("\\n", "\n");
        if (arg.includes(outline)) {
            in_string = !in_string;
            arg = arg.replace(outline, "");
            if (arg.includes(outline)) {
                arg = arg.replace(outline, "");
                in_string = !in_string;
                if (in_string)
                    strings[strings.length - 1] += " " + arg;
                else
                    strings.push(arg);
                continue;
            }
            if (in_string)
                strings.push(arg);
            else
                strings[strings.length - 1] += " " + arg;
            continue;
        }
        if (in_string) {
            strings[strings.length - 1] += " " + arg;
        } else {
            strings.push(arg);
        }
    }
    //console.log(strings);
    let finalstrings = [];
    let in_prev = false;
    for (var i = 1; i < strings.length; i++) {
        if (strings[i].length > 0) {
            let str = strings[i];
            if (str == "=") {
                finalstrings[finalstrings.length - 1] += str;
                in_prev = true;
                continue;
            }
            let in_start = str[0] == "=" && str.length > 1;
            let in_end = str[str.length - 1] == "=" && str.length > 1;
            if (!in_start && !in_end && !in_prev) {
                finalstrings.push(str);
                continue;
            }
            if (!in_start && !in_end && in_prev) {
                finalstrings[finalstrings.length - 1] += str;
                in_prev = false;
                continue;
            }
            if (in_start) {
                finalstrings[finalstrings.length - 1] += str;
                continue;
            }
            if (in_end) {
                finalstrings.push(str);
                in_prev = true;
                continue;
            }
        }
    }
    return finalstrings;
}
class HTMLTag {
    constructor(elem) {
        this.elem = elem;
        this.isTag = elem.length > 3 && elem[0] == TAG_START && elem[elem.length - 1] == TAG_END;
        if (this.isTag) {
            this.isEnd = this.elem[1] == "/";
            this.isStart = this.elem[1] != "/";

            this.findName();


        }
    }
    findName(log = false) {
        if (!this.isTag) {
            console.log(this.elem + " is not an Element.");
            return "";
        }
        let name = this.elem.slice(this.isStart ? 1 : 2, this.elem.length - 1).split(" ")[0];
        if (log) {
            console.log(name);
        }
        this.name = name;
        if (this.isStart) {
            this.attributes = getAttributes(this);
        }
        if (single_Elements.indexOf(this.name) > -1) {
            this.isSingle = true;
            this.isStart = false;
        }
    }
}
class HTMLELement {
    name;
    text;
    isTag;
    children = [];
    parent;
    constructor(tag) {
        this.isTag = tag.isTag;
        if (this.isTag) {
            this.attributes = tag.attributes;
            this.name = tag.name;
        } else {
            this.text = tag.elem;
        }
    }
    construct() {
        if (!this.isTag) return document.createTextNode(this.text);
        let element = document.createElement(this.name);
        for (var attributeName in this.attributes) {
            element.setAttribute(attributeName, this.attributes[attributeName]);
        }
        for (var child of this.children) {
            let chld = child.construct();
            if (chld) {

            }
            element.appendChild(chld);
        }
        return element;
    }
    add(child) {
        child.parent = this;
        this.children.push(child);
    }
    isStartOf(elem) {
        if (this.name == elem.name) return true;
        console.log("Error. Incorrect string", elem, this.name);
    }
}