import Router, { RouterFactory } from "./Router.js";

const routerInstance = new Router('defaultRouter', [
    new RouterFactory("index","/"),
])

export default routerInstance