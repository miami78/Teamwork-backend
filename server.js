const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'miami',
    password : '',
    database : 'teamwork'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());



app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})