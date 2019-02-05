const knex = require('./connection.js');

const fee_estimator = async () =>{
  let dp_values = [];
  let label_values = [];
  let db = await knex.from('litecoin_mempool')
    .select ('bytes_size','fee')
    .orderBy('bytes_size', 'asc')
  db.forEach(function (el){
    dp_values.push(el['fee']);
    label_values.push(el['bytes_size']);
  })
  const dp = {dp:dp_values,
      labels:label_values};
  return dp;
}


module.exports = {
  fee_estimator : fee_estimator
}
