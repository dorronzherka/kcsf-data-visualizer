---
---

var url = {{ site.requesturl }} +"comparison";
$.support.cors = true;
var language = window.language;
var static_questions = ["q34", "q35", "q80", "q117", "q119"];
var main_indicators = {
    "1": {
        "q7": ["q2", "q9", "q11", "q15", "q14"],
        "q9": ["q2", "q7", "q11", "q15"]
    },
    "2": {
        "q18": ["q9", "q2", "q7", "q11", "q15", "q14"],
        "q22": ["q9", "q2", "q7", "q11", "q15"],
        "q23": ["q9", "q2", "q7", "q11", "q15"]
    },
    "3": {
        "q34": [],
        "q35": []
    },
    "4": {
        "q48": ["q9", "q2", "q7", "q11", "q15"]
    },
    "5": {
        "q51": ["q9", "q2", "q7", "q11", "q15"],
        "q54": ["q9", "q2", "q7", "q11", "q15"],
        "q56": ["q9", "q2", "q7", "q11", "q15"]
    },
    "6": {
        "q72": ["q9", "q2", "q7", "q11", "q15"],
        "q73": ["q9", "q2", "q7", "q11", "q15"],
        "q74": ["q9", "q2", "q7", "q11", "q15"],
        "q75": ["q9", "q2", "q7", "q11", "q15", "q36", "q37", "q124", "q129"],
        "q76_1": ["q9", "q2", "q7", "q11", "q15"],
        "q76_2": ["q9", "q2", "q7", "q11", "q15"],
        "q77": ["q9", "q2", "q7", "q11", "q15", "q36", "q37"],
        "q80": [],
        "q81": ["q9", "q2", "q7", "q11", "q15"],
        "q82": ["q9", "q2", "q7", "q11", "q15"],
        "q84": ["q9", "q2", "q7", "q11", "q15"],
        "q88": ["q9", "q2", "q7", "q11", "q15"],
        "q104": ["q9", "q2", "q7", "q11", "q15"],
        "q109": ["q9", "q2", "q7", "q11", "q15"]
    },
    "7": {
        "q112": ["q9", "q2", "q7", "q11", "q15", "q113"],
        "q117": []
    },
    "8": {
        "q118": ["q9", "q2", "q7", "q11", "q15"],
        "q119": [],
        "q120": ["q9", "q2", "q7", "q11", "q15", "q118", "q124", "q136_1"],
        "q121": ["q9", "q2", "q7", "q11", "q15"],
        "q122": ["q9", "q2", "q7", "q11", "q15"]
    },
    "9": {
        "q124": ["q9", "q2", "q7", "q11", "q15", "q136_1", "q118"],
        "q126": ["q9", "q2", "q7", "q11", "q15", "q124", "q136_1"],
        "q127": ["q9", "q2", "q7", "q11", "q15", "q118"],
        "q128": ["q9", "q2", "q7", "q11", "q15", "q118"]
    },
    "10": {
        "q65": ["q9", "q2", "q7", "q11", "q15"]
    },
    "11": {
        "q136_1": ["q9", "q2", "q7", "q11", "q15"]
    },
    "12": {
        "q138": ["q9", "q2", "q7", "q11", "q15"]
    }
};

function addTopicList(){
    for (var topic in main_indicators){
        var topic_name = topics[topic][window.language];
        var list_item = "";
        if (topic == "1"){
            list_item = "<li class='active' value='" + topic + "'><a>" + topic_name + "</a></li>";
        } else {

            list_item = "<li value='" + topic + "'><a>" + topic_name + "</a></li>";
        }
        $(".topic-ul").append(list_item);
    }
}

function populateMainIndicatorSelectBoxes(topic) {
    $("#main-indicator-select").empty();
    for (var indicator in main_indicators[topic]) {
        var indicator_str = indicator.replace("q", "");
        var option = translation_data[indicator_str][language];
        var option_html = "<option value='" + indicator + "'>" + option + "</option>";
        $("#main-indicator-select").append(option_html);
    }
}

function populateDisaggregateSelectBox(indicator, topic) {
    $("#disaggregate-select").empty();
    var option_html = "<option value='0'>" + translation_data[0][window.language] + "</option>";
    $("#disaggregate-select").append(option_html);
    for (var i = 0; i < main_indicators[topic][indicator].length; i++) {
        var q_id = main_indicators[topic][indicator][i];
        var option = translation_data[q_id.replace("q", "")][language];
        var option_html = "<option value='" + q_id + "'>" + option + "</option>";
        $("#disaggregate-select").append(option_html);
    }
}

function displayChart(){
    var active_topic = $(".topic-ul").find(".active").val();
    var main_inicator = $("#main-indicator-select").val();
    var chart_type = $('input[name=tabs]:checked').val();
    var chart_type_container = chart_type + "-container";
    if (static_questions.indexOf(main_inicator) != -1) {
        $("#tab3").click();
        $("#tab1").prop("disabled", true);
        if (window.screen.width > 768) {
            setTimeout(function () {
                $("#main-indicator-select").parent().parent().css("margin-top", "30px");
            }, 350);
        }
        $("#disaggregate-select").parent().parent().hide(350);
        displayStaticChart("column-chart-container", static_data[main_inicator], "column-chart");
    } else {
        $("#tab1").prop("disabled", false);
        $("#main-indicator-select").parent().parent().css("margin-top", "0px");
        $("#disaggregate-select").parent().parent().show(350);
        populateDisaggregateSelectBox(main_inicator, active_topic);
        var disaggregate_by = $("#disaggregate-select").val();
        var post_data = {
            "q1_id": main_inicator,
            "q2_id": "",
            "lang": window.language
        };
        if (disaggregate_by != "0") {
            post_data["q2_id"] = disaggregate_by;
            postRequest(url, post_data, chart_type, chart_type_container, "y");
        } else {
            postRequest(url, post_data, chart_type, chart_type_container);
        }
    }
}

$(function () {
    addTopicList();
    populateMainIndicatorSelectBoxes("1");
    displayChart();
    mainIndicatorSelectBoxChange();

    $("input[name='tabs']").change(function () {
        $(".chart").empty();
        var main_inicator = $("#main-indicator-select").val();
        var disaggregate_by = $("#disaggregate-select").val();
        var checked_rb = $(this).val();
        var chart_type_container = checked_rb + "-container";
        if (static_questions.indexOf(main_inicator) != -1) {
            displayStaticChart(chart_type_container, static_data[main_inicator], checked_rb);
        } else {
            var post_data = {
                "q1_id": main_inicator,
                "q2_id": "",
                "lang": window.language
            };
            if (disaggregate_by != "0") {
                post_data["q2_id"] = disaggregate_by;
                postRequest(url, post_data, checked_rb, chart_type_container, "y");
            } else {
                postRequest(url, post_data, checked_rb, chart_type_container);
            }
        }
    });

    $("#disaggregate-select").change(function () {
        var disaggregate_by = $(this).val();
        var chart_type = $('input[name=tabs]:checked').val();
        var chart_type_container = chart_type + "-container";
        var main_inicator = $("#main-indicator-select").val();
        var post_data = {
            "q1_id": main_inicator,
            "q2_id": disaggregate_by,
            "lang": window.language
        };
        if (disaggregate_by != "0") {
            postRequest(url, post_data, chart_type, chart_type_container, "y");
        } else {
            post_data['q2_id'] = "";
            postRequest(url, post_data, chart_type, chart_type_container);
        }
    });

    initTopicToggleButton();
    initTopicSelection();

});

function mainIndicatorSelectBoxChange() {
    $("#main-indicator-select").off("change").on("change", function () {
        displayChart();
    });
}

/* Making a post request to the back-end and displaying the chart with it's response. */
function postRequest(url_post, post_data, chart_type, chart_container, double_questions) {
    $.ajax({
        type: 'POST',
        url: url_post,
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        crossDomain: true,
        data: JSON.stringify(post_data)
    }).done(function (data) {
        drawChart(chart_container, chart_type, data, double_questions);
    });
}

function displayStaticChart(chart_container, data, chart_type) {
    chart_type = chart_type.replace("-chart", "");
    $("#" + chart_container).empty();
    var title = data['question'][window.language];
    var categories = [];
    var series = [];
    for (var category in data['answer'][window.language]) {
        categories.push(category);
        for (var sub_category in data['answer'][window.language][category]) {
            var serie_json = {
                "name": "",
                "data": []
            };
            var index = series.map(function (d) {
                return d['name'];
            }).indexOf(sub_category);
            if (index == -1) {
                serie_json['name'] = sub_category;
                serie_json['data'].push(Number(data['answer'][window.language][category][sub_category]));
                series.push(serie_json);
            } else {
                series[index]["data"].push(Number(data['answer'][window.language][category][sub_category]))
            }
        }
    }

    var chart_plot_options = {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
            enabled: true,
            format: '{series.name}: <b>{y:,.1f}%</b>'
        }
    };

    if (window.screen.width < 768) {
        chart_plot_options['dataLabels']["enabled"] = false;
    }

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
            categories: categories,
            crosshair: true
        },
        plotOptions: {
            column: chart_plot_options,
            line: chart_plot_options,
            bar: chart_plot_options
        },
        yAxis: {
            title: {
                text: '%'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:12px; text-align: center;"><b>{point.key}</b></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0;"> {series.name}: </td>' +
                '<td style="padding-left: 5px;"><b style="font-weight: bolder;">{point.y:.1f}%</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: series
    });
}

function getFirstIndicator(jsonObj){
    var firstProp;
    for(var key in jsonObj) {
        if(jsonObj.hasOwnProperty(key)) {
            firstProp = key;
            break;
        }
    }
    return firstProp
}

function initTopicSelection(){
    $(".topic-ul li a").click(function(){
        var topic = $(this).parent().val();
        $(".topic-ul li").each(function(){
           if (topic == $(this).val()){
               $(this).addClass("active");
           } else {
               $(this).removeClass("active");
           }
        });
        $("#show").click();
        var main_indicator = getFirstIndicator(main_indicators[topic]);
        populateMainIndicatorSelectBoxes(topic);
        populateDisaggregateSelectBox(main_indicator, topic);
        mainIndicatorSelectBoxChange();
        displayChart();
    })
}

function initTopicToggleButton(){
    var left_margin = "255px";
    var left_margin_0 = "0px";
    if (window.screen.width < 858){
        left_margin = "270px";
        left_margin_0 = "2.5%";
    }

    $('#show').click(function(e){
        e.preventDefault();
    	var hidden = $('.hidden');
        var class_name = $(this).attr("class");
        if (class_name == "show"){
            $(this).removeClass("show");
            $(this).addClass("hide");
            hidden.show('slide', {direction: 'left'}, 400);
            $("#show h4").hide(400);
            $(this).animate({
                marginLeft: left_margin
            }, 400);
            $("#show img").rotate({ endDeg:540, duration:0.4, persist:true });
        } else {
            $("#show h4").show(400);
            $(this).removeClass("hide");
            $(this).addClass("show");
            hidden.hide('slide', {direction: 'left'}, 400);
            $("#show").animate({
                marginLeft: left_margin_0
            }, 400);
            $("#show img").rotate({ endDeg:360, duration:0.4});
        }
    });
}