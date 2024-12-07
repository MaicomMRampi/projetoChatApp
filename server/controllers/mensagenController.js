const MensagensSchema = require('../models/mensagens');
const io = require('../app').io; // Acesse o servidor e o io do socket.io

const criaMensagem = async (req, res) => {
    const teste = req.body
    const { text, fromMe, recipientId } = req.body;

    try {
        // Criando a nova mensagem com os campos necessários
        const novaMensagem = new MensagensSchema({
            sender: fromMe, // Nome ou id do remetente, ou qualquer dado que represente o remetente
            content: text,
            recipientId: recipientId, // Apenas o _id do destinatário
        });

        await novaMensagem.save();
        res.status(200).json(novaMensagem);
    } catch (error) {
        console.error("Erro ao criar mensagem:", error);
        res.status(500).json({ message: "Erro ao criar mensagem", error });
    }
};


const buscarMensagem = async (req, res) => {
    const { sender, recipientId } = req.query;

    try {
        // Buscar mensagens onde o sender é o usuário e o recipientId é o destinatário
        const mensagens = await MensagensSchema.find({
            $or: [
                { sender: sender, recipientId: recipientId },
                { sender: recipientId, recipientId: sender },
            ],
        }).sort({ createdAt: 1 }); // Ordenar as mensagens por data de criação

        return res.json(mensagens);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar mensagens");
    }
}

module.exports = {
    criaMensagem,
    buscarMensagem
}