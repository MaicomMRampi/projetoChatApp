const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv').config();
const passport = require('./auth/passportConfig');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dbConnect = require('./config/dbConnect');
const Message = require('./models/mensagens');  // Importa o modelo de mensagem
const UsuariosSchema = require('./models/usuario');
dbConnect();

const app = express();

// Configuração de CORS
app.use(
    cors({
        origin: 'http://localhost:3000', // Substitua pelo domínio do frontend (ou use '*' em desenvolvimento)
        credentials: true,
    })
);

// Configuração da sessão
app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Inicializar o Passport e a sessão
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./routes/routes');
app.use(express.json());
app.use(userRoutes);

// Criação do servidor HTTP
const server = http.createServer(app);


// Eventos do Socket.IO
// Armazenar usuários online
const onlineUsers = new Map();

const io = require('socket.io')(server);  // Assumindo que você já tenha a instância do servidor e do socket.io

// Evento de conexão de cliente
io.on('connection', (socket) => {

    // Evento de conexão de cliente
    io.on('connection', (socket) => {
        console.log(`Novo cliente conectado: ${socket.id}`);

        // Evento para associar usuário ao socket
        socket.on('userConnect', async (userId) => {
            console.log("🚀 ~ socket.on ~ userId", userId);
            onlineUsers.set(userId, socket.id); // Associa o usuário ao socket ID
            socket.join(userId); // Faz o socket entrar em uma sala com o ID do usuário
            console.log(`Usuário conectado: ${userId}`);

            // Notifica todos os clientes que o usuário está online
            io.emit('userStatus', { userId, status: 'online' });

            // Envia lista de usuários automaticamente ao cliente conectado
            try {
                const allUsers = await UsuariosSchema.find({}, '_id nome');
                const usersWithStatus = allUsers.map(user => ({
                    _id: user._id,
                    nome: user.nome,
                    status: onlineUsers.has(user._id.toString()) ? 'Online' : 'Offline',
                }));
                socket.emit('usersList', usersWithStatus);
            } catch (error) {
                console.error('Erro ao buscar lista de usuários:', error);
                socket.emit('usersListError', { error: 'Erro ao buscar usuários' });
            }
        });

        // Evento para desconectar o usuário
        socket.on('disconnect', () => {
            const disconnectedUser = [...onlineUsers.entries()].find(([_, id]) => id === socket.id);
            if (disconnectedUser) {
                const [userId] = disconnectedUser;
                onlineUsers.delete(userId); // Remove o usuário da lista de online
                console.log(`Usuário desconectado: ${userId}`);

                // Notifica todos os clientes que o usuário está offline
                io.emit('userStatus', { userId, status: 'offline' });
            }
            console.log(`Cliente desconectado: ${socket.id}`);
        });

        // Evento para enviar mensagens
        socket.on('sendMessage', async (data) => {
            console.log('Mensagem recebida no servidor:', data);

            const newMessage = new Message({
                sender: data.sender,
                recipientId: data.recipientId,
                content: data.content,
            });

            try {
                await newMessage.save(); // Salva a mensagem no banco de dados

                // Notifica o destinatário em tempo real
                io.to(data.recipientId).emit('receiveMessage', {
                    sender: data.sender,
                    recipientId: data.recipientId,
                    content: data.content,
                    timestamp: newMessage.timestamp,
                });

                console.log('Mensagem enviada para o destinatário:', data.recipientId);
            } catch (error) {
                console.error('Erro ao salvar e enviar a mensagem:', error);
            }
        });


        // Evento para buscar mensagens entre dois usuários
        socket.on('fetchMessages', async (data) => {
            console.log("🚀 ~ socket.on ~ data", data)

            try {
                const messages = await Message.find({
                    $or: [
                        { sender: data.sender, recipientId: data.recipientId },
                        { sender: data.recipientId, recipientId: data.sender },
                    ],
                }).sort({ timestamp: 1 });
                console.log("🚀 ~ socket.on ~ messages", messages)
                socket.emit('fetchMessagesResponse', messages);
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
                socket.emit('fetchMessagesError', { error: 'Erro ao buscar mensagens' });
            }


        });

        // Evento para notificar mudanças de status
        socket.on('userStatus', (data) => {
            const { userId, status } = data;
            socket.to(userId).emit('userStatus', { userId, status });
        });
    });
});


const port = 3333;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
