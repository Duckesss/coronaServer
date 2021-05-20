const { Router } = require('express')
const routes = Router()

routes.get("/ping", (req,res) => res.send("pong"))

module.exports = routes