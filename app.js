const express = require('express');
const bodyParser = require('body-parser');
const path = require ('path');
const app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static path
app.use('/static',express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
  res.render('index',{
    title: 'invat EJS',
    content: 'ala bala portocala'
  });
})

app.get('/test', (req, res) => {
  return res.json({
    name: 'Tudor',
    brother: 'Andrei',
  });
})
app.get('/litecoin', (req, res) => {
  return res.render('index',{
    title: 'invat EJS',
    content: 'ala bala portocala'
  });
})
app.listen(3000, function(){
  console.log('Server started on port 3000...');
})
