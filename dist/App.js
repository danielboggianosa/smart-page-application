"use strict";
class Component {
    constructor(props) {
        const { id, parentId, template, styles } = props;
        this.id = id;
        this.parentId = parentId;
        this.template = template;
        this.styles = styles || "";
        this.parent = document.querySelector("#" + this.parentId);
        this._render();
    }
    onEvent(event, fn) {
        this.parent.querySelector("#" + this.id)?.addEventListener(event, fn);
    }
    remove() {
        this.parent.querySelector("#" + this.id)?.remove();
    }
    clear() {
        this.remove();
        this._render();
    }
    addClass(className) {
        this.parent.querySelector("#" + this.id)?.classList.add(className);
    }
    removeClass(className) {
        this.parent.querySelector("#" + this.id)?.classList.remove(className);
    }
    toggleClass(className) {
        this.parent.querySelector("#" + this.id)?.classList.toggle(className);
    }
    copyTemplate() {
        return this.template;
    }
    append(html) {
        this.parent.querySelector('#' + this.id).innerHTML += html;
    }
    select(query) {
        return this.parent.querySelector(query);
    }
    _createTemplate() {
        const tag = this.template.split('<')[1].split(' ')[0];
        let div = document.createElement('div');
        div.innerHTML = this.template.trim();
        return div.children[0];
    }
    _render() {
        const html = this._createTemplate();
        html.id = this.id;
        this.parent.appendChild(html);
        const body = document.querySelector("body");
        const st = document.createElement("style");
        if (!body?.querySelector("style"))
            body?.appendChild(st);
        document.querySelector("style")?.append(this.styles);
    }
}
class Page extends Component {
    constructor(props) {
        super(props);
    }
    _render() {
        this.parent.innerHTML = this.template;
        this.parent.children[0].id = this.id;
        const body = document.querySelector("body");
        const st = document.createElement("style");
        if (!body?.querySelector("style"))
            body?.appendChild(st);
        document.querySelector("style")?.append(this.styles);
    }
}
class Router {
    constructor() {
        this.routes = [];
        window.addEventListener('hashchange', this.navigate.bind(this));
    }
    registerRoute(route) {
        const routeExists = this.routes.find(r => r.path == route.path);
        if (routeExists)
            throw new Error(`La ruta ${route.path} ya está registrada`);
        this.routes.push(route);
    }
    navigate() {
        if (!this.routes.length)
            return;
        const index = this.routes.findIndex(r => r.path == window.location.hash);
        if (index < 0)
            return;
        const content = this.routes[index].content;
        this.routes[index].component(content);
    }
    getActiveRoute() {
        return window.location.hash;
    }
}
const Utils = {
    readFile: (file) => new Promise((resolve, reject) => {
        if (!file)
            reject('No file found');
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
            resolve(e.target?.result?.toString());
        });
        reader.readAsBinaryString(file);
    })
};
class App {
}
