const UsuariosSchema = require('../models/usuario')
const passport = require('passport');

const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log("Erro no Passport Authenticate:", err);
            return res.status(500).json({ message: 'Erro de autenticação' });
        }

        if (!user) {
            console.log("Usuário não encontrado ou senha inválida");
            return res.status(400).json({ message: info.message });
        }

        console.log("Login bem-sucedido, usuário encontrado:", user);

        req.login(user, (err) => {
            if (err) {
                console.log("Erro ao salvar usuário na sessão:", err);
                return next(err);
            }
            console.log("Usuário salvo na sessão");
            console.log("Sessão ativasass: ", req.isAuthenticated());
            return res.status(200).json({ message: 'Login bem-sucedido', user });
        });
    })(req, res, next);
};


const verificaSessao = async (req, res) => {
    console.log('Sessão ativa:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.status(200).json({
            message: 'Sessão ativa',
            user: req.user, // Envia os dados do usuário para o frontend
        });
    } else {
        return res.status(401).json({ message: 'Nenhuma sessão ativa' });
    }
};




module.exports = { login, verificaSessao };
