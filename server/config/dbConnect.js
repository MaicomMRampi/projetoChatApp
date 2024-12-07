const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/MessageConnect');

        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar-se ao MongoDB:', error);
        throw error;
    }
};

module.exports = dbConnect;