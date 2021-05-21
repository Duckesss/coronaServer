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

        }
    },
    services: {
        urlServer: Utils.getUrlServer(),
        getCasos: async function(){
            const semanaPassada = await Utils.fetch(`${this.urlServer}/getWeek/1`)
            const semanaAtual = await Utils.fetch(`${this.urlServer}/getWeek/0`)
            return [semanaPassada,semanaAtual]
        }
    }
}

$.fn.outerHTML = function() {
    return jQuery('<div />').append(this.eq(0).clone()).html();
};