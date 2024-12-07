// passportConfig.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UsuariosSchema = require('../models/usuario');
console.log("chegou no pass")
// Configuração da estratégia local
passport.use(
    new LocalStrategy(
        { usernameField: 'username', passwordField: 'senha' },
        async (username, senha, done) => {
            try {
                const user = await UsuariosSchema.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'Usuário não encontrado' });
                }
                const senhaValida = await bcrypt.compare(senha, user.senha);
                if (!senhaValida) {
                    return done(null, false, { message: 'Senha inválida' });
                }
                return done(null, user); // Login bem-sucedido
            } catch (error) {
                console.log("🚀 ~ error", error)
                return done(error);
            }
        }
    )
);

// Serialização do usuário para a sessão
passport.serializeUser((user, done) => {
    done(null, user.id); // Apenas o ID é armazenado na sessão
});

// Desserialização do usuário a partir da sessão
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UsuariosSchema.findById(id); // Encontra o usuário usando o ID armazenado na sessão
        done(null, user); // Passa o usuário completo para a sessão
    } catch (error) {
        done(error, null); // Caso ocorra um erro, chama done com null

    }
});

module.exports = passport;
