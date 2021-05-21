const Utils = function(){
    const parseFetch = function(promise){
        return new Promise(async (resolve,reject) => {
            try{
                let request = await promise
                if(!request.ok){
                    const textError = await request.text();
                    return reject(new Error(textError))
                }
                request = await request.json();
                resolve(request)
            }catch(err){
                reject(err)
            }
        })
    }
    return {
        fetch: function(url,config){
            return parseFetch(fetch(url,{
                ...config,
                ...( config?.body? {body: JSON.stringify(config.body)} : {} ),
                headers:{
                    ...(config?.headers || {}),
                    "Content-Type": "application/json"
                },
            }))
        },
        getUrlServer: () => `http://localhost:80`,
    }
}
export default Utils()