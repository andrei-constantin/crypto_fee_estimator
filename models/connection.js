require('dotenv').config();

const knex = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DATABASE
    },
    searchPath: ['public'],
    pool: { min: 1, max: 2 }
});

module.exports = knex;
