module.exports = {
    "type": "postgres",
    "port": 5432,
    "host": process.env.DB_HOST,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB,
    "ssl": true,
    "entities": ["entity/*.ts"],
    "logging": true,
    "synchronize": true
 }
