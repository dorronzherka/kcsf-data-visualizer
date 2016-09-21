// sorts items in drill down
function Comparator(b, a) {
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
}

function drawChart(container, chart_type, data, double_questions) {
    $("#" + container).empty();
    chart_type = chart_type.replace("-chart", "");

    var series_data = [];
    var drilldown_series = [];
    var duplicates = [];
    var dataSum = 0;

    // building the dataset for the chart.
    for (var item in data) {
        var serie = {};
        if (double_questions) {
            dataSum += data[item]['count'];
            if (duplicates.indexOf(data[item]['type1']) == -1) {
                serie = getSerieJson(data, item, "type1");
                serie['drilldown'] = serie['name'];
                duplicates.push(data[item]['type1']);
                series_data.push(serie);
            } else {
                var index = series_data.map(function (d) {
                    return d['name'];
                }).indexOf(data[item]['type1']);
                series_data[index]['y'] += data[item]['count'];
            }
        } else {
            serie = getSerieJson(data, item, "type1");
            dataSum += data[item]['count'];
            series_data.push(serie);
        }
    }

    var e = document.getElementById("main-indicator-select");
    var question_id = e.options[e.selectedIndex].value;
    var question_title = e.options[e.selectedIndex].text;
    var title = getChartTitle(question_id.replace("q", ""), question_title);

    // building the drill down data for the chart.
    if (double_questions) {
        for (var element in series_data) {
            var drilldown_serie = {
                "name": series_data[element]["name"],
                "id": series_data[element]["name"],
                "data": []
            };
            for (var json in data) {
                if (data[json]['type1'] == series_data[element]['name']) {
                    drilldown_serie['data'].push([data[json]['type2'], data[json]['count']])
                }
            }
            drilldown_series.push(drilldown_serie);
        }
        for (var item in drilldown_series) {
            drilldown_series[item]['data'].sort(Comparator);
        }
    }

    // sort data to display to the chart.
    sortResults(series_data, "y", false);

    // modified the back button text on drill down.
    Highcharts.setOptions({
        lang: {
            drillUpText: 'Back'
        }
    });

    //
    var chart_plot_options = {
        series: {
            dataLabels: {
                enabled: true,
                formatter: function () {
                    var name = this.point.name;
                    var value = this.point.y;
                    var formatter;
                    if (chart_type == "pie") {
                        var percentage = this.point.percentage.toString();
                        formatter = name.length > 30 ? name.substring(0, 30) + '...: ' + Highcharts.numberFormat(percentage) + '%' : name + ': ' + Highcharts.numberFormat(percentage) + "%";
                    } else {
                        var pcnt = (value / dataSum) * 100;
                        formatter = name.length > 30 ? name.substring(0, 30) + '...: ' + Highcharts.numberFormat(pcnt) + '%' : name + ': ' + Highcharts.numberFormat(pcnt) + '%';
                    }
                    return formatter;
                }
            }
        }
    };

    var tooltip_formatter = function () {
        var name = this.point.name;
        var value = this.point.y;
        var formatter;
        if (chart_type == "pie") {
            var percentage = this.point.percentage.toString();
            formatter = name + ': <b>' + Highcharts.numberFormat(percentage) + "%</b>";
        } else {
            var pcnt = (value / dataSum) * 100;
            formatter = name + ': <b>' + Highcharts.numberFormat(pcnt) + '%</b>';
        }
        return formatter;
    };

    if (window.screen.width < 768) {
        chart_plot_options['series']['dataLabels']["enabled"] = false;
    }

    var chart = $('#' + container).highcharts({
        chart: {
            events: {
                drilldown: function () {
                    var e1 = document.getElementById("disaggregate-select");
                    var question_id = e1.options[e1.selectedIndex].value;
                    var question_title = e1.options[e1.selectedIndex].text;
                    var title = getChartTitle(question_id.replace("q", ""), question_title);
                    this.setTitle({text: title});
                },
                drillup: function () {
                    var e2 = document.getElementById("main-indicator-select");
                    var question_id = e2.options[e2.selectedIndex].value;
                    var question_title = e2.options[e2.selectedIndex].text;
                    var title = getChartTitle(question_id.replace("q", ""), question_title);
                    this.setTitle({text: title});
                }
            },
            type: chart_type,
            style: {
                fontFamily: 'Exo'
            }
        },
        title: {
            text: title
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            minRange: 0.1
        },
        plotOptions: chart_plot_options,
        tooltip: {
            backgroundColor: "rgba(255,255,255,1)",
            style: {
                fontSize: '10pt'
            },
            formatter: tooltip_formatter
        },
        series: [{
            name: 'Series',
            colorByPoint: true,
            data: series_data
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

    return chart;
}

function getChartTitle(question_id, chart_title) {
    var cso_questions = ["76_1", "76_2", '136_1'];
    if (cso_questions.indexOf(question_id) == -1) {
        if (question_id.length == 3) {
            if (question_id.charAt(0) == "1") {
                return "<b>" + translation_data["CSO"][window.language] + "</b> - " + chart_title;
            } else if (question_id.charAt(0) == "2") {
                return "<b>" + translation_data["Development-Partners"][window.language] + "</b> - " + chart_title;
            } else if (question_id.charAt(0) == "3") {
                return "<b>" + translation_data["CSO-Network"][window.language] + "</b> - " + chart_title;
            } else if (question_id.charAt(0) == "4") {
                return "<b>" + translation_data["External"][window.language] + "</b> - " + chart_title;
            }
        } else if (question_id.length < 3) {
            return "<b>" + translation_data["CSO"][window.language] + "</b> - " + chart_title;
        } else {
            return "<b>" + translation_data["UNDP"][window.language] + "</b> - " + chart_title;
        }
    } else {
        return "<b>" + translation_data["CSO"][window.language] + "</b> - " + chart_title;
    }
}

function drawMultipleSeriesChart(chart_container, chart_type, title, categories, chart_plot_options, series) {
    $('#' + chart_container).highcharts({
        chart: {
            type: chart_type,
            style: {
                fontFamily: 'Exo'
            }
        },
        title: {
            text: title
        },
        xAxis: {
            categories: categories
        },
        plotOptions: {
            column: chart_plot_options,
            line: chart_plot_options,
            bar: chart_plot_options
        },
        yAxis: {
            min: 0,
            minRange: 0.1
        },
        tooltip: {
            backgroundColor: "rgba(255,255,255,1)",
            headerFormat: '<span style="font-size:12px; text-align: center;"><b>{point.key}</b></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0;"><b>{series.name}:</b></td>' +
            '<td style="padding-left: 5px;"><b style="font-weight: bolder;">{point.y:.1f}%</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: series
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

function sortResults(json_array, prop, asc) {
    return json_array.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}