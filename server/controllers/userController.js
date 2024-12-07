const dbConnect = require('../config/dbConnect');
const UsuariosSchema = require('../models/usuario');
const bcrypt = require('bcrypt');
const criarUsuario = async (req, res) => {
    try {
        await dbConnect();
        const { nome, username, senha } = req.body;

        // Criptografa a senha
        const senhaCripto = await bcrypt.hash(senha, 10);

        // Cria o novo usuário
        const createUser = new UsuariosSchema({ nome, username, senha: senhaCripto });
        await createUser.save();

        return res.status(200).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {

        // Verifica se o username ja estava cadastrado codigo de erro do mongodb
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username já cadastrado' });
        }

        console.log(error)
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
}
const buscaUsuarios = async (req, res) => {
    try {
        await dbConnect();
        const usuarios = await UsuariosSchema.find();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
}

module.exports = {
    criarUsuario,
    buscaUsuarios
}