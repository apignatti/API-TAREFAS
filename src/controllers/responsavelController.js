const dbTarefa = require("../../mook/BaseTarefas.js");

exports.listarResponsaveis = (require, response)=>{
    return response.status(200).json({
        sucesso: true,
        dados: dbTarefa
        }
    )
}