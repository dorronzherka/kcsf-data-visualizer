// sorts items in drill down
function Comparator(b, a) {
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
}

// call function's parameters by name. e.g. { parameter1: value }
var parameterfy = (function () {
    var pattern = /function[^(]*\(([^)]*)\)/;

    return function (func) {
        // fails horribly for parameterless functions ;)
        var args = func.toString().match(pattern)[1].split(/,\s*/);

        return function () {
            var named_params = arguments[arguments.length - 1];
            if (typeof named_params === 'object') {
                var params = [].slice.call(arguments, 0, -1);
                if (params.length < args.length) {
                    for (var i = params.length, l = args.length; i < l; i++) {
                        params.push(named_params[args[i]]);
                    }
                    return func.apply(this, params);
                }
            }
            return func.apply(null, arguments);
        };
    };
}());

// draws chart in div with all of the parameters added.
var drawChart = parameterfy(function (container, chart_type, data, double_questions, static_question) {
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

    var title = "";
    var e = document.getElementById("main-indicator-select");
    var question_id = e.options[e.selectedIndex].value;
    if (static_question != undefined) {
        title = getChartTitle(static_question.replace("q", ""), translation_data[static_question][window.language]);
    } else {
        var question_title = e.options[e.selectedIndex].text;
        title = getChartTitle(question_id.replace("q", ""), question_title);
    }

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
            drillUpText: translation_data['Back'][window.language]
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
                    var totalSum = 0;
                    $.each(this.series.yData ,function() {
                        totalSum += this;
                    });
                    if (chart_type == "pie") {
                        var percentage = this.point.percentage.toString();
                        formatter = name.length > 30 ? name.substring(0, 30) + '...: ' + Highcharts.numberFormat(percentage) + '%' : name + ': ' + Highcharts.numberFormat(percentage) + "%";
                    } else {
                        var pcnt;
                        if (over_percentage_questions.indexOf(question_id) != -1) {
                            var total_docs = 0;
                            if (question_id == "q128") {
                                total_docs = 51;
                            }
                            else if (question_id == "q77") {
                                total_docs = totalSum;
                            }
                            else {
                                total_docs = 101;
                            }
                            pcnt = (value / total_docs) * 100;
                        } else {
                            pcnt = (value / totalSum) * 100;
                        }
                        formatter = Highcharts.numberFormat(pcnt) + '%';
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
        var totalSum = 0;
        $.each(this.series.yData ,function() {
            totalSum += this;
        });
        if (chart_type == "pie") {
            var percentage = this.point.percentage.toString();
            formatter = name + ': <b>' + Highcharts.numberFormat(percentage) + "%</b>";
        } else {
            var pcnt;
            if (over_percentage_questions.indexOf(question_id) != -1) {
                var total_docs = 0;
                if (question_id == "q128") {
                    total_docs = 51;
                } else {
                    total_docs = 101;
                }
                pcnt = (value / total_docs) * 100;
            } else {
                pcnt = (value / totalSum) * 100;
            }
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
            labels: {
                enabled: false
            },
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
            showInLegend: false,
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
    $(".highcharts-yaxis").remove();
    var buttons = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
    if (buttons[buttons.length - 1]['textKey'] == "viewData") {
        buttons.pop(buttons.length - 1);
    }
    return chart;
});

// grabs the question title by question ID and adds title to the chart title.
function getChartTitle(question_id, chart_title) {
    var cso_questions = ["76_1", "76_2", '136_1'];
    if (cso_questions.indexOf(question_id) == -1) {
        if (question_id.length == 3) {
            if (question_id.charAt(0) == "1") {
                return chart_title + " - <i>" + translation_data["CSO"][window.language] + "</i>";
            } else if (question_id.charAt(0) == "2") {
                return chart_title + " - <i>" + translation_data["Development-Partners"][window.language] + "</i>" ;
            } else if (question_id.charAt(0) == "3") {
                return chart_title + " - <i>" + translation_data["CSO-Network"][window.language] + "</i>";
            } else if (question_id.charAt(0) == "4") {
                return chart_title + " - <i>" + translation_data["External"][window.language] + "</i>";
            } else if (question_id.charAt(0) == "5") {
                return chart_title + " - <i>" + translation_data["UNDP"][window.language] + "</i>";
            }
        } else if (question_id.length < 3) {
            return chart_title + " - <i>" + translation_data["CSO"][window.language] + "</i>";
        } else {
            return chart_title + " - <i>" + translation_data["UNDP"][window.language] + "</i>";
        }
    } else {
        return chart_title + " - <i>" + translation_data["CSO"][window.language] + "</i>";
    }
}

// displays multiple series static chart.
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
    $(".highcharts-yaxis").remove();
}

// build the json series data for chart.
function getSerieJson(data, item, type) {
    var name = data[item][type];
    var count = data[item]['count'];
    return {
        "name": name,
        "y": count
    };
}

// sort json results.
function sortResults(json_array, prop, asc) {
    return json_array.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}