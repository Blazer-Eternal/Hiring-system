require('dotenv').config({ debug: false, override: true, quiet:true });


module.exports = {
  development: {
  host: process.env.DB_HOST||"localhost",
  username: process.env.DB_USER||"root",
  password: process.env.DB_PASSWORD||"",
  database: process.env.DB_NAME||"hiring_system",
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT || 'mysql'
  },
};
  
