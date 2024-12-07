const Message = require('../models/mensagens');

const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuário conectado:', socket.id);

        // Receber a mensagem do frontend
        socket.on('sendMessage', async (data) => {
            const { sender, content, recipientId } = data;
            console.log("🚀 ~ socket.on ~ data", data)

            // Salvar mensagem no banco de dados
            const newMessage = new Message({ sender, content, recipientId });
            console.log("dalvando aqyui trhio")
            await newMessage.save();

            // Enviar a mensagem para o destinatário
            io.to(recipientId).emit('receiveMessage', newMessage);
        });

        // Desconectar
        socket.on('disconnect', () => {
            console.log('Usuário desconectado');
        });
    });
};

module.exports = { initSocket };
