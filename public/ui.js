

$( document ).ready(function() {

  const ajax_test = () => {
    $.ajax({
      url: "/test",
    }).done(( data ) => {
      let content = `Hello <h1>${ data.name } </h1>, brother of <h1>${data.brother}<h1>`;
      console.log(content);
      $("#app").html( content );
    });
  }
  const start_chart = () => {
    $.ajax({
      url: "/litecoin",
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
					label: 'Cubic interpolation (monotone)',
					data: datapoints,
					borderColor: "red",
					backgroundColor: 'rgba(0, 0, 0, 0)',
					fill: false,
					cubicInterpolationMode: 'monotone'
				}, {
					label: 'Cubic interpolation (default)',
					data: datapoints,
					borderColor: "blue",
					backgroundColor: 'rgba(0, 0, 0, 0)',
					fill: false,
				}, {
					label: 'Linear interpolation',
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
					text: 'Chart.js Line Chart - Cubic interpolation mode'
				},
				tooltips: {
					mode: 'index'
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
						ticks: {
							suggestedMin: -10,
							suggestedMax: 200,
						}
					}]
				}
			}
		};
		var ctx = document.getElementById('canvas').getContext('2d');
		window.myLine = new Chart(ctx, config);
  });
  }


  start_chart();
});
