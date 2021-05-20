const Router = function(id,routes){
    const navigate = route => {
        const achouRota = routes.find(r => r.name === route.replace(/\?.+/,''))
        if(achouRota){
            window.location.href = `${window.location.origin}/${route}`
        }else{
            throw Error("Rota não encontrada!")
        }
    }
    $("[router-link]").toArray().forEach(route => {
        $(route).on("click",function(){
            const rota = $(this).attr("router-link")
            navigate(rota)
        })
    })
    return function(){
        return {
            id,
            routes,
            navigate
        }
    }
}

const RouterFactory = function(name,path = ""){
    if(!name) throw Error("A rota precisa ter um nome")
    const route = {name}
    route.path = path  || (`/${name}`)
    return route
}


module.exports = {
    Router,RouterFactory
}