const mongoose = require('mongoose');

// Definindo o esquema das mensagens
const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true, // O campo é obrigatório
    },
    content: {
        type: String,
        required: true, // O campo é obrigatório
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId, // Referência ao modelo de usuário
        ref: 'User', // Nome do modelo de usuário (ajuste conforme o nome real do seu modelo)
        required: true, // O destinatário é obrigatório
    },
    timestamp: {
        type: Date,
        default: Date.now, // Define automaticamente a data e hora
    },
});

// Criando o modelo
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
