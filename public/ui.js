

$( document ).ready(function() {
  const start_chart = ( interval ) => {

    $.ajax({
      url: "/litecoin",
      data: {interval: interval},
    }).done(( res ) => {
		var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		};
		var datapoints = res['dp'];
		var config = {
			type: 'line',
			data: {
				labels: res['labels'],
				datasets: [{
					label: 'Waiting time',
					data: datapoints,
					borderColor: "green",
					backgroundColor: 'rgba(0, 0, 0, 0)',
					fill: false,
					lineTension: 0
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Average waiting times for transactions in mempool'
				},
				tooltips: {
					mode: 'index'
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
              labelString: 'Fee range (LTC Sat/byte)'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Average time (min)'
						},
						ticks: {
							suggestedMin: 0,
							suggestedMax: 5,
						}
					}]
				}
			}
		};
		var ctx = document.getElementById('canvas').getContext('2d');
		window.myLine = new Chart(ctx, config);
  });
  }

  start_chart(3600);

  $(".btn-interval").on('click', function (){
    start_chart($(this).data('interval'));
  })
});
