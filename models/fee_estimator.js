const knex = require('./connection.js');

const get_coins = async () => {
  const coin_info = await knex.from('currencies')
    .select ('coin_name','subdivision_name','decimals', 'approx_block_time', 'ticker','coin_id')
    .orderBy('coin_id')
  return coin_info;
}

const search = (nameKey, myArray) => {
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].coin_id == nameKey) {
            return myArray[i];
        }
    }
}

const ts_diff_min = (timestamp1, timestamp2) => {
    var difference = timestamp1 - timestamp2;
    var minutes_diff = parseFloat(Math.round(difference/1000/60).toFixed(2));
    return minutes_diff;
}

const interval_picker = async (interval, coin_id) => {
  //will return the approx number of blocks generated during the <interval>
  const coins = await get_coins()
  const coin_info = search ( coin_id , coins);
  //getting the block generating time for the coin
  const block_time = coin_info['approx_block_time']/60;
  return Math.ceil(interval/60/block_time)
}

const scale_pick = (max_fee) =>{
  const x_bar = [200,300,400,500,600,700,800,900,1000];
  let scale = 0;
  for (i = 0 ; i< x_bar.length; i++){
    if(max_fee < x_bar[i]){
      scale = x_bar[i];
      break;
    }
  }
  return scale;
}

const data_prel = (data) => {
  //removing the 10% highest txs
  const cut_size = Math.floor(data.length*0.1);
  const cut = data.splice((data.length-cut_size),cut_size);
  const scale = scale_pick(data[data.length-1]['fee']);
  const step = scale/20;
  let dp_values = [];
  let label_values = [];
  for (i = step; i <= scale; i+= step ){
    let dp_cur = 0;
    let label_cur = (i-step) +'-'+ i;
    var counter = 0;
    for (j = 0 ; j < data.length; j++){
      const el = data[j];
      if( parseInt(el['fee']) <= i ){
        dp_cur += ts_diff_min(el['ts_gone'],el['ts_seen']);
        counter += 1;
      }
      else {
        data = data.slice(counter);
        break
      }
    }
    if(dp_cur != 0){
      dp_cur = parseFloat(Math.round(dp_cur /counter * 100) / 100).toFixed(2);
    }
    dp_values.push(dp_cur);
    label_values.push(label_cur);
    counter = 0;

  }
  let dp = {'dp': [],'labels': []};
  dp['dp'] = dp_values;
  dp['labels'] = label_values;
  return dp;
}

const fee_estimator = async (coin_id, interval) =>{
  const last_block_id = await knex('blocks')
    .select('block_id')
    .orderBy('block_id', 'desc')
    .limit(1)
  const interval_calc = await interval_picker(interval, coin_id);
  const blocks_calculated = parseInt(last_block_id[0]['block_id'] - interval_calc);
  const data = await knex('mempool_aggregator')
    .join('blocks','mempool_aggregator.block_id','=','blocks.block_id')
    .select('mempool_aggregator.id_tx as id','mempool_aggregator.fee','mempool_aggregator.ts_seen as ts_seen','mempool_aggregator.height_seen','blocks.ts_seen as ts_gone','blocks.block_height as height_gone')
    .where('blocks.block_id','>', blocks_calculated )
    .andWhere('mempool_aggregator.coin_id', '=', coin_id)
    .orderBy('fee','asc');
  let dp = data_prel(data);
  return dp;
}

module.exports = {
  fee_estimator : fee_estimator
}
