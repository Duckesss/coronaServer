const {Router,RouterFactory} = require("./Router.js")

const routerInstance = new Router('defaultRouter', [
    new RouterFactory("index","/"),
])

module.exports = routerInstance