
const express = require('express');
const router = express.Router();


// Controllers
const autenticacaoController = require('../controllers/autentificacaoController');
const userController = require('../controllers/userController');
const mensagenController = require('../controllers/mensagenController');
// =============================================================================

// Rotas de Autenticação
router.post('/api/login', autenticacaoController.login);
router.get('/api/verificaSessao', autenticacaoController.verificaSessao);


// // Rotas de Usuário
router.post('/api/register', userController.criarUsuario);
router.get('/api/usuarios', userController.buscaUsuarios);


//  rotas de mensagens 

router.post('/api/mensagens', mensagenController.criaMensagem);
router.get('/api/mensagens', mensagenController.buscarMensagem);

module.exports = router;

