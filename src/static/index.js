import Utils from "./Utils.js";
import Router from "./routes/index.js";

$(document).ready(function(){
    pageController.init()
})

const pageController = {
    init: function(){
        Object.values(this.bindEvents).forEach(evt => evt.apply(pageController))
    },
    bindEvents: {
        btnMediaMovel: function(){
            const self = this
            $('#calculaMediaMovel').on('click', async function(){
                const semanasCorona = await self.services.getCasos()
                const dadosFormatados = formataCasos(semanasCorona)
                const template = $("#tplLinhaMediaMovel").html()
                Mustache.parse(template);
                var renderedRow = Mustache.render(template, {SEMANAS: dadosFormatados});
                $("#bodyTblMediaMovel").append(renderedRow)
            })
            function formataCasos(semanaDeCasos){
                const dados = semanaDeCasos.reduce((retorno,casos,index) => {
                    let totalCasos = 0
                    retorno.push({
                        ID: index,
                        CASOS: casos.map((caso,idxCaso) => {
                            totalCasos += caso.Cases
                            return {
                                ID_CASO: idxCaso,
                                DIA: formataData(caso.Date),
                                QTD_CASOS: caso.Cases
                            }
                        }),
                        MEDIA_MOVEL: Math.floor(totalCasos/7)
                    })
                    return retorno
                },[])
                return dados
            }

            function formataData(date){
                date = date.replace(/T.*/g,'')
                date = date.split('-')
                return `${date[2]}/${date[1]}/${date[0]}`
            }

        },
        btnSalvarUltimoMes: function(){
            const self = this
            $("#SalvarUltimoMes").on("click",async function(){
                const ultimoMes = await self.services.getCasosUltimoMes()
                self.services.saveDados(ultimoMes).then(() => alert("Dados salvos!") )
            })
        }
    },
    services: {
        urlServer: Utils.getUrlServer(),
        getCasos: async function(){
            const semanaPassada = await Utils.fetch(`${this.urlServer}/v1/coronaAPI/getWeek/1`)
            const semanaAtual = await Utils.fetch(`${this.urlServer}/v1/coronaAPI/getWeek/0`)
            return [semanaPassada,semanaAtual]
        },
        getCasosUltimoMes: async function(){
            const dadosMesPassado = await Utils.fetch(`${this.urlServer}/v1/coronaAPI/getLastMonth/?full=1`)
            return dadosMesPassado
        },
        saveDados: function(cases){
            const self = this
            return new Promise((resolve,reject) => {
                navigator.geolocation.getCurrentPosition(async function(position){
                    await Utils.fetch(`${self.urlServer}/v1/db/saveWorstDays`,{
                        method: "POST",
                        body: {
                            cases,
                            locale: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            },
                            date: new Date()
                        }
                    })
                    resolve()
                }, function(err){
                    alert("Por favor, permita a localização no navegador!")
                    reject()
                })
            })
        }
    }
}

$.fn.outerHTML = function() {
    return jQuery('<div />').append(this.eq(0).clone()).html();
};