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
// drawschart from static data 

var drawStaticChart = parameterfy(function(main_indicator,disaggregate_by,container,chart_type){
    $("#" + container).empty();
    chart_type = chart_type.replace("-chart", "");
    var series_data = [];
    var drilldown_series = [];
    var duplicates = [];
    var dataSum = 0;
    //console.log(static_data[main_indicator]['answer'][window.language][0]);
    for (var a in static_data[main_indicator]['answer'][window.language][0]){
            var serie={};
                if (a!="num_children"){
                    serie['name'] =a;
                   
                    if (a=="Kanë votuar per JO" || a=="Glasao za NE" || a=="Voted for No" || disaggregate_by==0){
                        serie['drilldown']=null;
                    }else{
                        serie['drilldown']=a;
                    }
                    if (window.language=="en"){
                         serie['y']=parseFloat(static_data[main_indicator]['answer'][window.language][0][a]['Percentage']);
                    }
                    if (window.language=="sq"){
                         serie['y']=parseFloat(static_data[main_indicator]['answer'][window.language][0][a]['Përqindja']);
                    }
                     if (window.language=="sr"){
                         serie['y']=parseFloat(static_data[main_indicator]['answer'][window.language][0][a]['Procenat']);
                    }
                    series_data.push(serie);
                }
        
    }
    if (window.language=="en" && disaggregate_by=="Gender"){
        disaggregate_by="Gender";
    }
    if (window.language=="sq" && disaggregate_by=="Gender"){

        disaggregate_by="Gjinia";

    }
    if (window.language=="sr" && disaggregate_by=="Gender"){
        disaggregate_by="Pol";
    }


    if (window.language=="en" && disaggregate_by=="Age"){
        disaggregate_by="Age";
    }
    if (window.language=="sq" && disaggregate_by=="Age"){

        disaggregate_by="Mosha";

    }
    if (window.language=="sr" && disaggregate_by=="Age"){
        disaggregate_by="Starost";
    }

     if (window.language=="en" && disaggregate_by=="Ethnicity"){
        disaggregate_by="Ethnicity";
    }
    if (window.language=="sq" && disaggregate_by=="Ethnicity"){

        disaggregate_by="Etniciteti";

    }
    if (window.language=="sr" && disaggregate_by=="Ethnicity"){
        disaggregate_by="Etnička pripadnost";
    }


   if (window.language=="en" && disaggregate_by=="Membership"){
        disaggregate_by="Membership";
    }
    if (window.language=="sq" && disaggregate_by=="Membership"){
        disaggregate_by="Anëtar ose vullnetar për një ose më shumë organizatave të shoqërisë civile";
    }
    if (window.language=="sr" && disaggregate_by=="Membership"){
        disaggregate_by="Član ili volonter za jednu ili više organizacija civilnog društva";
    }
    var title = "";
    var e = document.getElementById("main-indicator-select");
    var question_id = e.options[e.selectedIndex].value;

        var question_title = e.options[e.selectedIndex].text;
        title = getChartTitle(question_id.replace("q", ""), question_title);
        for (var element in series_data) {
            var drilldown_serie = {
                "name": series_data[element]["name"],
                "id": series_data[element]["name"],
                "data": []
            };
            for (var json in static_data[main_indicator]['answer'][window.language][0]) {
             if (json!="num_children"){
                if (json== series_data[element]['name']){
              
                    if (disaggregate_by=="Gender"){
                        var percentage_men=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Men']);
                        var percentage_women=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Women']);
                         drilldown_serie['data'].push(['Men',percentage_men],['Women',percentage_women]);
                    }
                   if (disaggregate_by=="Gjinia"){
                        var percentage_men=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Burra']);
                        var percentage_women=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Gra']);
                         drilldown_serie['data'].push(['Burra',percentage_men],['Gra',percentage_women]);
                    }
                    if (disaggregate_by=="Pol"){
                        var percentage_men=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Muškarci']);
                        var percentage_women=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Žene']);
                         drilldown_serie['data'].push(['Muškarci',percentage_men],['Žene',percentage_women]);
                    }

                    if (disaggregate_by=="Age"){
                        var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Age 18-25']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Age 26-35']);
                        var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Age 36-45']);
                        var percentage_fourth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Age 46-55']);
                        var percentage_fifth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Age 56-65']);
                        var percentage_sixth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Age 66+']);
                        
                         drilldown_serie['data'].push(
                            ['Age 18-25',percentage_first],
                            ['Age 26-35',percentage_second],
                            ['Age 36-45',percentage_third],
                            ['Age 46-55',percentage_fourth],
                            ['Age 56-65',percentage_fifth],
                            ['Age 66+',percentage_sixth]
                            );
                    }
                    if (disaggregate_by=="Mosha"){
                       var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Mosha 18-25']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Mosha 26-35']);
                        var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Mosha 36-45']);
                        var percentage_fourth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Mosha 46-55']);
                        var percentage_fifth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Mosha 56-65']);
                        var percentage_sixth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Mosha 66+']);
                        
                         drilldown_serie['data'].push(
                            ['Mosha 18-25',percentage_first],
                            ['Mosha 26-35',percentage_second],
                            ['Mosha 36-45',percentage_third],
                            ['Mosha 46-55',percentage_fourth],
                            ['Mosha 56-65',percentage_fifth],
                            ['Mosha 66+',percentage_sixth]
                            );
                    }
                    if (disaggregate_by=="Starost"){
                        var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Godina 18-25']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Godina 26-35']);
                        var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Godina 36-45']);
                        var percentage_fourth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Godina 46-55']);
                        var percentage_fifth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Godina 56-65']);
                        var percentage_sixth=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Godina 66+']);
                        
                         drilldown_serie['data'].push(
                            ['Godina 18-25',percentage_first],
                            ['Godina 26-35',percentage_second],
                            ['Godina 36-45',percentage_third],
                            ['Godina 46-55',percentage_fourth],
                            ['Godina 56-65',percentage_fifth],
                            ['Godina 66+',percentage_sixth]
                            );
                    }


                     if (disaggregate_by=="Ethnicity"){
                       var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Albanian']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Serb']);
                        var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Other']);
                        
                         drilldown_serie['data'].push(
                            ['Albanian',percentage_first],
                            ['Serb',percentage_second],
                            ['Other',percentage_third]
                            );
                    }
                    if (disaggregate_by=="Etniciteti"){
                       var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Shqiptar']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Serb']);
                        var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Tjerë']);
                        
                         drilldown_serie['data'].push(
                            ['Shqiptar',percentage_first],
                            ['Serb',percentage_second],
                            ['Tjerë',percentage_third]
                            );
                    }
                    if (disaggregate_by=="Etnička pripadnost"){
                       var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Kosovski albanci']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Kosovski srbi']);
                        var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Ostali kosovci']);
                        
                         drilldown_serie['data'].push(
                            ['Kosovski albanci',percentage_first],
                            ['Kosovski srbi',percentage_second],
                            ['Ostali kosovci',percentage_third]
                            );
                    }

                     if (disaggregate_by=="Membership"){
                       var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Member/volunteer in one or more CSOs']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Not a member/volunteer in one or more CSOs']);
                        
                         drilldown_serie['data'].push(
                            ['Member/volunteer in one or more CSOs',percentage_first],
                            ['Not a member/volunteer in one or more CSOs',percentage_second]
                            );
                    }
                    if (disaggregate_by=="Anëtar ose vullnetar për një ose më shumë organizatave të shoqërisë civile"){
                       var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Anëtarë/vullnetarë në një apo më shumë OShC']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Jo anëtarë apo vullnetarë në një apo më shumë OShC']);
                        
                         drilldown_serie['data'].push(
                            ['Anëtarë/vullnetarë në një apo më shumë OShC',percentage_first],
                            ['Jo anëtarë apo vullnetarë në një apo më shumë OShC',percentage_second]
                            );
                    }
                    if (disaggregate_by=="Član ili volonter za jednu ili više organizacija civilnog društva"){

                        if (main_indicator=="5N4"){
                                                   var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Član/volunter jedne ili više OCD-a']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Nije član/volunter jedne ili više OCD-a']);
                            var percentage_third=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Nema odgovora']);
                         drilldown_serie['data'].push(
                            ['Član/volunter jedne ili više OCD-a',percentage_first],
                            ['Nije član/volunter jedne ili više OCD-a',percentage_second]
                     
                            );
                     } else{
                        var percentage_first=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Član/volunter jedne ili više OCD-a']);
                        var percentage_second=parseFloat(static_data[main_indicator]['answer'][window.language][disaggregate_by][json]['Nije član/volunter jedne ili više OCD-a']);
                         drilldown_serie['data'].push(
                            ['Član/volunter jedne ili više OCD-a',percentage_first],
                            ['Nije član/volunter jedne ili više OCD-a',percentage_second]
                            );
                     }                   
                        
                    }
                }
            }
            }
            drilldown_series.push(drilldown_serie);
        }
        console.log("dfgdfg");
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
                        var pcnt = (value / totalSum) * 100;
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
        } else 
        {
            var pcnt = (value / totalSum) * 100;
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
    console.log(drilldown_series);
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
                            var pcnt = (value / totalSum) * 100;
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
        } else 
        {
            var pcnt = (value / totalSum) * 100;
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
