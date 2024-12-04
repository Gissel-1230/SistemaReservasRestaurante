// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto a tu host
    user: 'root', // Tu usuario de MySQL
    password: '123456789', // Tu contraseña de MySQL
    database: 'restaurante' // El nombre de tu base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos como id ' + connection.threadId);
});

module.exports = connection;
