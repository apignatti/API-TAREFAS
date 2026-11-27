const bcrypt = require('bcrypt');

const { Responsavel, Tarefa } = require("../models/");
const { request, response } = require('express');

const jwt = require("jsonwebtoken")
const listarResponsaveis = async (request, response) => {
    try {
        const responsaveis = await Responsavel.findAll({
            include: [
                {
                    model: Tarefa,
                    as: 'tarefas'
                }
            ],
            attributes: { exclude: ['senha'] }
        });
        if (responsaveis.length > 0) {
            return response.status(200).json(responsaveis)
        }
        return response.status(404).json({
            "mensagem": "Nenhum responsavel cadastrado."
        })
    } catch (error) {
        return response.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        });
    }
}

const criarResponsavel = async (request, response) => {
    try {
        const { nome, email, telefone, senha, foto, especialidade, cargo, departamento } = request.body;

        if (!nome || !email || !senha) {
            return response.status(400).json({
                mensagem: "Os campos 'nome', 'email' e 'senha' são obrigatórios."
            });
        }

        const salto = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salto);

        const novoResponsavel = await Responsavel.create({
            nome,
            email,
            telefone: telefone || null,
            senha: senhaHash,
            foto: foto || null,
            especialidade: especialidade || null,
            cargo: cargo || null,
            departamento: departamento || null
        });

        novoResponsavel.senha = undefined;

        return response.status(201).json({
            mensagem: "Responsável criado com sucesso!",
            responsavel: novoResponsavel
        });

    } catch (error) {
        console.error('Erro ao criar responsável:', error);
        return response.status(500).json({
            mensagem: "Erro interno do servidor",
            erro: error.message
        });
    }
};

const login = async (request, response) => {
    try {
        const { email, senha } = request.body;

        if (!email || !senha) {
            return response.status(400).json({
                mensagem: "Os campos 'email' e 'senha' são obrigatórios!"
            })
        }
        const responsavel = await Responsavel.findOne({ where: { email } });

        if (!responsavel) {
            return response.status(400).json({
                mensagem: "E-mail não cadastrado"
            })
        }
        const senhaValida = await bcrypt.compare(senha, responsavel.senha);

        if (!senhaValida) {
            return response.status(400).json({
                mensagem: "Senha incorreta!!!"
            })
        }

        const payload = {
            id: responsavel.id,
            nome: responsavel.nome,
            email: responsavel.email,
        }

        const segredo = process.env.JWT_SECRET;

        const opcoes = {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

        const token = jwt.sign(payload, segredo, opcoes);

        return response.status(201).json({
            mensagem: "Login realizado com sucesso!!!",
            responsavel: responsavel,
            token: token
        });

    } catch (error) {
        console.error('Erro ao criar responsavel:', error);
        return response.status(500).json({
            mensagem: "Erro interno do servidor", erro: error.message }
        );
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
        const responsavel = await Responsavel.findByPk(id, {
            include: [{
                model: Tarefa, 
                as: 'tarefa'
            }]
        });
        if(responsavel){
            return response.status(200).json({
                idBusca: id,
                responsavel
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


const atualizarResponsavel = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "O campo id precisa ser numérico" });
        }

        const responsavel = await Tarefa.findByPk(id);

        if (!responsavel) {
            return res.status(404).json({ mensagem: "Responsavel não encontrado" });
        }

        // Extrai todos os campos possíveis do corpo da requisição
        const { nome, email, telefone, senha, foto, especialidade, cargo, departamento} = req.body;

        // Atualiza a tarefa mantendo os valores antigos caso o campo não seja enviado
        await responsavel.update({
            nome: nome !== undefined ? nome : responsavel.nome,
            email: email !== undefined ? email : responsavel.email,
            telefone: telefone !== undefined ? telefone : responsavel.telefone,
            senha: senha !== undefined ? senha : responsavel.senha,
            foto: foto !== undefined ? foto : responsavel.foto,
            especialidade: especialidade !== undefined ? especialidade : responsavel.especialidade,
            cargo: cargo !== undefined ? cargo : responsavel.cargo,
            departamento: departamento !== undefined ? departamento : responsavel.departamento,
        });

        // Busca atualizada com o responsável (excluindo a senha por segurança, igual ao criarTarefa)
        const responsavelAtualizado = await Responsavel.findByPk(id, {
            include: [{
                model: Tarefa,
                as: 'tarefas',
            }]
        });

        responsavelAtualizado.senha = undefined;

        return res.status(200).json({
            idBusca: id, 
            mensagem: "Tarefa atualizada com sucesso!",
            responsavel: responsavelAtualizado
        });

    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
};


// Deletar tarefa
const deletarResponsavel = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "O campo id precisa ser numérico" });
        }

        const responsavel = await Responsavel.findByPk(id);

        if (!responsavel) {
            return res.status(404).json({ mensagem: "Responsavel não encontrada" });
        }

        await responsavel.destroy();

        return res.status(200).json({
            mensagem: "Responsavel removido com sucesso!",
            responsavel: responsavel
        });
    } catch (error) {
        console.error('Erro ao deletar responsavel:', error);
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
};


module.exports = {
    listarResponsaveis, criarResponsavel, login, buscarPorId, atualizarResponsavel, deletarResponsavel
};