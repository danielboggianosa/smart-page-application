interface ComponentProps {
    id: string;
    parentId: string;
    template: string;
    styles?: string;
}
class Component {

    id: string;
    parentId: string;
    template: string;
    styles: string;
    parent: Element;

    constructor(props: ComponentProps) {
        const { id, parentId, template, styles } = props;
        this.id = id;
        this.parentId = parentId;
        this.template = template;
        this.styles = styles || "";
        this.parent = document.querySelector("#" + this.parentId)!;
        this._render();
    }

    public onEvent(event: any, fn: any): void {
        this.parent.querySelector("#" + this.id)?.addEventListener(event, fn);
    }

    public remove(): void {
        this.parent.querySelector("#" + this.id)?.remove();
    }

    public clear(): void {
        this.remove();
        this._render();
    }

    public addClass(className: string): void {
        this.parent.querySelector("#" + this.id)?.classList.add(className);
    }

    public removeClass(className: string): void {
        this.parent.querySelector("#" + this.id)?.classList.remove(className);
    }

    public toggleClass(className: string): void {
        this.parent.querySelector("#" + this.id)?.classList.toggle(className);
    }

    public copyTemplate() {
        return this.template;
    }

    public append(html: string): void {
        this.parent.querySelector('#' + this.id)!.innerHTML += html
    }

    public select(query: string): HTMLElement | null {
        return this.parent.querySelector(query)
    }

    _createTemplate(): Element {
        const tag = this.template.split('<')[1].split(' ')[0]
        let div = document.createElement('div');
        div.innerHTML = this.template.trim();
        return div.children[0];
    }

    _render(): void {
        const html = this._createTemplate();
        html.id = this.id
        this.parent.appendChild(html!);
        const body = document.querySelector("body");
        const st = document.createElement("style");
        if (!body?.querySelector("style")) body?.appendChild(st);
        document.querySelector("style")?.append(this.styles);
    }
}
class Page extends Component {
    constructor(props: ComponentProps) {
        super(props)
    }
    _render(): void {
        this.parent.innerHTML = this.template;
        this.parent.children[0].id = this.id
        const body = document.querySelector("body");
        const st = document.createElement("style");
        if (!body?.querySelector("style")) body?.appendChild(st);
        document.querySelector("style")?.append(this.styles);
    }
}
interface Route {
    path: string;
    component: Function;
    content: Component;
}
class Router {
    private routes: Route[]
    constructor() {
        this.routes = []
        window.addEventListener('hashchange', this.navigate.bind(this))
    }
    registerRoute(route: Route): void {
        const routeExists = this.routes.find(r => r.path == route.path)
        if (routeExists) throw new Error(`La ruta ${route.path} ya está registrada`)
        this.routes.push(route)
    }
    navigate(): void {
        if (!this.routes.length) return
        const index = this.routes.findIndex(r => r.path == window.location.hash)
        if (index < 0) return
        const content = this.routes[index].content
        this.routes[index].component(content)
    }
    getActiveRoute(): string {
        return window.location.hash
    }
}
const Utils = {
    readFile: (file: Blob): Promise<string | undefined> => new Promise((resolve, reject) => {
        if (!file)
            reject('No file found');
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
            resolve(e.target?.result?.toString());
        });
        reader.readAsBinaryString(file);
    })
}
class App { }