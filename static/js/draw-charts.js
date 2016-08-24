function displayChart(container, chart_type, data, double_questions) {
    $("#" + container).empty();
    chart_type = chart_type.replace("-chart", "");

    var series_data = [];
    var drilldown_series = [];
    var duplicates = [];
    for (var item in data) {
        var serie = {};
        if (double_questions) {
            if (duplicates.indexOf(data[item]['type2']) == -1){
                serie = getSerieJson(data, item, "type2");
                serie['drilldown'] = serie['name'];
                duplicates.push(data[item]['type2']);
                series_data.push(serie);
            } else {
                var index = series_data.map(function(d) { return d['name']; }).indexOf(data[item]['type2']);
                series_data[index]['y'] += data[item]['count'];
            }
        } else {
            serie = getSerieJson(data, item, "type1");
            series_data.push(serie);
        }
    }

    if (double_questions) {
        for (var element in series_data){
            var drilldown_serie = {
                "name": series_data[element]["name"],
                "id": series_data[element]["name"],
                "data": []
            };
            for (var json in data) {
                if (data[json]['type2'] == series_data[element]['name']){
                    drilldown_serie['data'].push([data[json]['type1'], data[json]['count']])
                }
            }
            drilldown_series.push(drilldown_serie);
        }
    }

    Highcharts.setOptions({
        lang: {
            drillUpText: 'Back'
        }
    });

    $('#' + container).highcharts({
        chart: {
            type: chart_type,
            style: {
                fontFamily: 'Exo'
            }
        },
        title: {
            text: 'KCSF VISUALIZER'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:15px"></span>',
            pointFormat: '<span style="font-size: 13px; color:{point.color}">{point.name}</span>: <b style="font-size: 13px; font-weight: bolder;">{point.y} organizations</b><br/>'
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: series_data
            //data: [{
            //    name: 'Microsoft Internet Explorer',
            //    y: 56.33,
            //    drilldown: 'Microsoft Internet Explorer'
            //}, {
            //    name: 'Chrome',
            //    y: 24.03,
            //    drilldown: 'Chrome'
            //}, {
            //    name: 'Firefox',
            //    y: 10.38,
            //    drilldown: 'Firefox'
            //}, {
            //    name: 'Safari',
            //    y: 4.77,
            //    drilldown: 'Safari'
            //}, {
            //    name: 'Opera',
            //    y: 0.91,
            //    drilldown: 'Opera'
            //}, {
            //    name: 'Proprietary or Undetectable',
            //    y: 0.2,
            //    drilldown: null
            //}]
        }],
        drilldown: {
            drillUpButton: {
                position: {
                    align: 'right'
                }
            },
            series: drilldown_series
        }
    });
}

function getSerieJson(data, item, type) {
    var name = data[item][type];
    var count = data[item]['count'];
    return {
        "name": name,
        "y": count
    };
}