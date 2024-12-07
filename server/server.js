const socketIO = require('socket.io');

// Esta função inicializa o Socket.IO e o conecta ao servidor HTTP
module.exports.listen = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Iniciando o socket
    io.on('connection', (socket) => {

        // Exemplo de evento de mensagem
        socket.on('chat_message', (data) => {
            console.log('Mensagem recebida: ', data);
            io.emit('chat_message', data); // Emite a mensagem para todos os clientes
        });

        // Desconexão do cliente
        socket.on('disconnect', () => {
            console.log('Cliente desconectado: ' + socket.id);
        });
    });

    console.log('Socket.IO está rodando');
};
