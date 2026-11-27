const { response } = require("express");
const {Responsavel, Tarefa} = require("../models/")

const listarTarefas = async (require, response)=>{
       try{
        const tarefas = await Tarefa.findAll({
            include: [
                {
                    model: Responsavel, 
                    as: 'responsavel'
                }
           ],
           //attributes: {exclude:['senha']}
        });

        if(tarefas.length > 0){
            return response.status(200).json(tarefas)
        }
        return response.status(404).json({
            "mensagem":"Nenhum tarefa cadastrado."
        })
    }catch(error){
        return response.status(500).json({
            mensagem: "Erro interno do servidor", 
            erro: error.message
        });
    }
}

const  buscarPorId = async (require, response)=>{
    try{
        const id = Number(require.params.id);

        if(isNaN(id)){
            return response.status(400).json({
                mensagem: "O campo id, precisa ser numérico."
            })
        }
        const tarefa = await Tarefa.findByPk(id, {
            include: [{
                model: Responsavel, 
                as: 'responsavel'
            }]
        });
        if(tarefa){
            return response.status(200).json({
                idBusca: id,
                tarefa
            })
        }else{
            return response.status(404).json({
                idBusca: id,
                mensagem: "Registro não encontrado"
            })
        }
    }catch(error){
        return response.status(500).json({
            mensagem: "Erro interno do Servidor",
            erro: error.message
        })
    }
}

const cadastrarTarefa = async(request, response)=>{

    try{
        const { titulo, descricao, preco, tempo_estimado_horas, data_limite, prioridade, id_responsavel} = request.body;
        
        if(!titulo || !descricao || !id_responsavel){
            return response.status(400).json({
                mensagem: "Os campos [titulo, descrição e responsável] são obrigatórios",                
            })
        }

        if(id_responsavel){
            const responsavelExiste = await Responsavel.findByPk(id_responsavel);
            
            if(!responsavelExiste){
                return response.status(404).json({
                    mensagem: "Responsável não cadastrado."
                })
            }
        }
        const novaTarefa = await Tarefa.create(request.body);

        const tarefaCriada = await Tarefa.findByPk(novaTarefa.id, {
            include: [
                {
                    model: Responsavel,
                    as: 'responsavel',
                    attributes: {exclude:['senha']}
                }
            ]
        });
        return response.status(201).json({
            mensagem: "Tarefa criada com sucesso!!!",
            tarefa: tarefaCriada
        })
        
    }catch(error){
        return response.status(500).json({
            mensagem:"Erro ao cria a tarefa",
            erro: error.message
        })
    }
}

const atualizarTarefa = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "O campo id precisa ser numérico" });
        }

        const tarefa = await Tarefa.findByPk(id);

        if (!tarefa) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada" });
        }

        // Extrai todos os campos possíveis do corpo da requisição
        const { titulo, descricao, preco, tempo_estimado_horas, data_limite, prioridade, id_responsavel, status} = req.body;
        

        const novoResponsavelId = id_responsavel;

        // Se houver alteração de responsável, valida se ele existe
        if (novoResponsavelId !== undefined && novoResponsavelId !== null) {
            const responsavelExiste = await Responsavel.findByPk(novoResponsavelId);
            if (!responsavelExiste) {
                return res.status(404).json({ mensagem: "Responsável não encontrado." });
            }
        }

        // Atualiza a tarefa mantendo os valores antigos caso o campo não seja enviado
        await tarefa.update({
            titulo: titulo !== undefined ? titulo : tarefa.titulo,
            descricao: descricao !== undefined ? descricao : tarefa.descricao,
            preco: preco !== undefined ? preco : tarefa.preco,
            tempo_estimado_horas: tempo_estimado_horas !== undefined ? tempo_estimado_horas : tarefa.tempo_estimado_horas,
            data_limite: data_limite !== undefined ? data_limite : tarefa.data_limite,
            prioridade: prioridade !== undefined ? prioridade : tarefa.prioridade,
            status: status !== undefined ? status : tarefa.status,
            id_responsavel: novoResponsavelId !== undefined ? novoResponsavelId : tarefa.id_responsavel
        });

        // Busca atualizada com o responsável (excluindo a senha por segurança, igual ao criarTarefa)
        const tarefaAtualizada = await Tarefa.findByPk(id, {
            include: [{
                model: Responsavel,
                as: 'responsavel',
                attributes: { exclude: ['senha'] }
            }]
        });

        return res.status(200).json({
            idBusca: id, 
            mensagem: "Tarefa atualizada com sucesso!",
            tarefa: tarefaAtualizada
        });
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
};

// Deletar tarefa
const deletarTarefa = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "O campo id precisa ser numérico" });
        }

        const tarefa = await Tarefa.findByPk(id);

        if (!tarefa) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada" });
        }

        await tarefa.destroy();

        return res.status(200).json({
            mensagem: "Tarefa removida com sucesso!",
            tarefa: tarefa
        });
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
};

module.exports = {
    listarTarefas, cadastrarTarefa, buscarPorId, deletarTarefa, atualizarTarefa
};