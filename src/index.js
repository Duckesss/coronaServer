const app = require('./app')
const PORT = process.env.PORT || 3001
const {format} = require("date-fns")
app.listen(PORT,() => {
    const date = new Date()
    console.log(`[${format(date,"dd/MM/yyyy hh:mm:ss")}] server running on port ${PORT}`)
})