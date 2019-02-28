const express = require('express');
const bodyParser = require('body-parser');
const path = require ('path');
const app = express();

const fee_estimator = require ('./models/fee_estimator.js');

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
    title: 'LTC Fee Estimator',
    content: ''
  });
})

app.get('/litecoin', async (req, res) => {
  // the first parameter used by fee_estimator() is coin_id from mempool_aggregator
  const interval = req.query.interval;
  if (parseInt(interval) <= 259200 ){
    const dp = await fee_estimator.fee_estimator(1 , interval);
    return res.json(dp);
  }

})

app.listen(3000, function(){
  console.log('Server started on port 3000...');
})
