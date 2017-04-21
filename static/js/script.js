---
---

var url = {{ site.requesturl }} +"comparison";
$.support.cors = true;
var language = window.language;

// json to name the comparison buttons by survey ID
var static_compare_buttons = {
    "2": translation_data["Development-Partners"][window.language],
    "3": translation_data["CSO-Network"][window.language],
    "4": translation_data["External"][window.language]
};

// questions which total is more than 100%;
var over_percentage_questions = ["q77", "q22", "q7", "q128"];

// questions which have another questions from another surveys that can be compared.
var comparison_questions = {
    "q35": ["313", "229"],
    "q77": ["220"],
    "q112": ["207", "208"],
    "q138": ["414", "235"]
};

// questions with static data.
var static_questions = ["q34", "q35", "q50", "q80", "q117", "q119", "q217", "q222", "q226", "q228", "q407"];

// structure of topics and the questions within the topics with their dis-aggregate by questions
var main_indicators = {
    "6": {
        "q9": ["q2", "q7", "q11", "q15", "q75"],
        "q7": ["q2", "q9", "q11", "q15", "q14", "q75"]
    },
    "2": {
        "q18": ["q9", "q2", "q7", "q11", "q15", "q14", "q75"],
        "q22": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q23": ["q9", "q2", "q7", "q11", "q15", "q75"]
    },
    "3": {
        "q34": [],
        "q35": []
    },
    "4": {
        "q50": [],
        "5N1": ["0", "Gender", "Age", "Ethnicity"],
        "5N3": ["0", "Gender", "Age", "Ethnicity" ,"Membership"]
    },
    "5": {
        "q51": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q54": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q56": ["q9", "q2", "q7", "q11", "q15", "q75"]
    },
    "1": {
        "q72": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q73": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q74": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q75": ["q9", "q2", "q7", "q11", "q15", "q36", "q37", "q75", "q124", "q129"],
        "q76_1": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q76_2": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q77": ["q9", "q2", "q7", "q11", "q15", "q36", "q37", "q75"],
        "q80": [],
        "q82": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q84": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q88": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q104": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q109": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q217": [],
        "q222": [],
        "q226": [],
        "q228": []
    },
    "7": {
        "q112": ["q9", "q2", "q7", "q11", "q15", "q75", "q113"],
        "q117": []
    },
    "8": {
        "q118": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q119": [],
        "q120": ["q9", "q2", "q7", "q11", "q15", "q75", "q118", "q124", "q136_1"],
        "q121": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q122": ["q9", "q2", "q7", "q11", "q15", "q75"]
    },
    "9": {
        "q124": ["q9", "q2", "q7", "q11", "q15", "q75", "q136_1", "q118"],
        "q126": ["q9", "q2", "q7", "q11", "q15", "q75", "q124", "q136_1"],
        "q127": ["q9", "q2", "q7", "q11", "q15", "q75", "q118"],
        "q128": ["q9", "q2", "q7", "q11", "q15", "q75", "q118"]
    },
    "10": {
        "q65": ["q9", "q2", "q7", "q11", "q15", "q75"]
    },
    "11": {
        "q136_1": ["q9", "q2", "q7", "q11", "q15", "q75"]
    },
    "12": {
        "q138": ["q9", "q2", "q7", "q11", "q15", "q75"],
        "q407": [],
        "5A7_5": ["0","Gender", "Age", "Ethnicity" ,"Membership"],
        "5N4": ["0","Gender", "Age", "Ethnicity" ,"Membership"],
        "5C15": ["0","Gender", "Age", "Ethnicity" ,"Membership"]
    }
};

// adds all of the topics in the left side div of topics.
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

// populates main indicator select box based on the topic they belong.
function populateMainIndicatorSelectBoxes(topic) {
    $("#main-indicator-select").empty();
    for (var indicator in main_indicators[topic]) {
        var indicator_str = indicator.replace("q", "");
        var option = translation_data[indicator_str][language];
        var option_html = "<option value='" + indicator + "'>" + option + "</option>";
        $("#main-indicator-select").append(option_html);
    }
}

// populates the dis-aggregate select box based on the main indicator and topic.
function populateDisaggregateSelectBox(indicator, topic, is_undp_data) {
    $("#disaggregate-select").empty();
    if (is_undp_data != true) {
        var option_html = "<option value='0'>" + translation_data[0][window.language] + "</option>";
    }
    $("#disaggregate-select").append(option_html);
    for (var i = 0; i < main_indicators[topic][indicator].length; i++) {
        var q_id = main_indicators[topic][indicator][i];
        var option = translation_data[q_id.replace("q", "")][language];
        var option_html = "<option value='" + q_id + "'>" + option + "</option>";
        $("#disaggregate-select").append(option_html);
    }
}

// if question in main indicator can be compared to another survey questions than display a button to compare
function addButtonsToCompareCharts(chart_type_container, chart_type, main_indicator) {
    if (main_indicator in comparison_questions){
        $(".compare-buttons-div").empty();
        $(".compare-buttons-div").append("<h6>"+translation_data["Comparison"][window.language]+"</h6>");
        for (var item in comparison_questions[main_indicator]){
            var q_id = comparison_questions[main_indicator][item];
            var button_html = "<button id='"+ q_id +"' class='btn btn-default btn-compare'>"+static_compare_buttons[q_id.charAt(0)]+"</button><br>";
            $(".compare-buttons-div").append(button_html);
        }
        $(".compare-buttons-div").show(350);
    } else {
        $(".compare-buttons-div").hide(350);
        $(".comparison-container").remove();
        $(".chart").css({
            "width": "",
            "float": "none"
        });
        if (static_questions.indexOf(main_indicator) != -1) {
            displayStaticChart(chart_type_container, static_data[main_indicator], chart_type, main_indicator.replace("q", ""));
        }
    }
}

// json for posting the attributes to retrieve data from the MongoDB.
function getPostData(main_indicator, disaggregate_by) {
    return {
        "q1_id": main_indicator,
        "q2_id": disaggregate_by,
        "lang": window.language
    }
}

// displays chart based on the attributes given.
function displayChart(){
    var active_topic = $(".topic-ul").find(".active").val();
    var main_indicator = $("#main-indicator-select").val();
    var chart_type = $('input[name=tabs]:checked').val();
    var chart_type_container = chart_type + "-container";

    addButtonsToCompareCharts(chart_type_container, chart_type, main_indicator);

    if (static_questions.indexOf(main_indicator) != -1) {
        $("#tab3").click();
        $("#tab1").prop("disabled", true);
        if (window.screen.width > 768) {
            setTimeout(function () {
                $("#main-indicator-select").parent().parent().css("margin-top", "30px");
            }, 350);
        }
        $("#disaggregate-select").parent().parent().hide(350);
        displayStaticChart("column-chart-container", static_data[main_indicator], "column-chart", main_indicator.replace("q", ""));
    } else {
        $("#tab1").prop("disabled", false);
        $("#main-indicator-select").parent().parent().css("margin-top", "0px");
        $("#disaggregate-select").parent().parent().show(350);
        if (main_indicator.charAt(0) == "5"){
            $("#tab3").click();
            populateDisaggregateSelectBox(main_indicator, active_topic, true);
            displayStaticChart("column-chart-container", static_data[main_indicator], "column-chart", main_indicator.replace("q", ""), translation_data["0"][window.language]);
        } else {
            if (over_percentage_questions.indexOf(main_indicator) != -1){
                $("#tab3").click();
                $("#tab1").prop("disabled", true);
                chart_type = "column-chart";
                chart_type_container = "column-chart-container";
            }
            populateDisaggregateSelectBox(main_indicator, active_topic);
            var disaggregate_by = $("#disaggregate-select").val();
            var post_data = getPostData(main_indicator, "");
            if (disaggregate_by != "0") {
                post_data["q2_id"] = disaggregate_by;
                postRequest(url, post_data, chart_type, chart_type_container, "y");
            } else {
                postRequest(url, post_data, chart_type, chart_type_container);
            }
        }
    }
}

$(function () {
    addTopicList();
    populateMainIndicatorSelectBoxes("1");
    displayChart();
    mainIndicatorSelectBoxChange();
    initChartRadioButtonsClick();
    disaggregateSelectBoxChange();
    initComparisonChartButtonClick();
    initTopicToggleButton();
    initTopicSelection();
});

// initializes the chart radio button click in the document.ready.
function initChartRadioButtonsClick(){
    $("input[name='tabs']").change(function () {
        $(".chart").empty();
        $(".comparison-container").remove();
        var main_indicator = $("#main-indicator-select").val();
        var disaggregate_by = $("#disaggregate-select").val();
        var checked_rb = $(this).val();
        var chart_type_container = checked_rb + "-container";
        $(".chart").css({
            "max-width": "800px",
            "float": "none"
        });
        if (static_questions.indexOf(main_indicator) != -1) {
            $("#tab1").prop("disabled", true);
            displayStaticChart(chart_type_container, static_data[main_indicator], checked_rb, main_indicator.replace("q", ""));
        } else {
            if (main_indicator.charAt(0) == "5"){
                $("#tab1").prop("disabled", true);
                var disaggregate_by_lang = $("#disaggregate-select option:selected" ).text();
                displayStaticChart(chart_type_container, static_data[main_indicator], checked_rb, main_indicator.replace("q", ""), disaggregate_by_lang);
            } else {
                if (over_percentage_questions.indexOf(main_indicator) != -1){
                    $("#tab1").prop("disabled", true);
                } else {
                    $("#tab1").prop("disabled", false);
                }
                var post_data = getPostData(main_indicator, "");
                if (disaggregate_by != "0") {
                    post_data["q2_id"] = disaggregate_by;
                    postRequest(url, post_data, checked_rb, chart_type_container, "y");
                } else {
                    postRequest(url, post_data, checked_rb, chart_type_container);
                }
            }
        }
    });
}

// initializes the charts comparison button click.
function initComparisonChartButtonClick(){
    $(document).on("click", '.btn-compare',function() {
        $(".comparison-container").remove();
        var main_indicator = $("#main-indicator-select").val();
        var chart_type = $('input[name=tabs]:checked').val();
        var q_id = $(this).attr("id");
        var disaggregate_by = $("#disaggregate-select").val();
        var chart_type_container = chart_type + "-container";
        var parent_div = $("#" + chart_type_container).parent();

        var comparison_chart_container_div = "<div class='comparison-container'></div>";
        parent_div.append(comparison_chart_container_div);
        var line_html = "<div style='float: left; height: 450px; width: 1px; margin-left: 20px; border-left: 1px dotted black'></div>";
        var chart_width = "100%";
        if (window.screen.width > 768) {
            chart_width = "47%";
            $(".comparison-container").append(line_html);
        } else $(".comparison-container").append("<br><hr style='height: 1px; width: 100%; background-color: black'><br>");
        var chart_div = "<div id='comparison-chart-container' class='comparison-chart' style='min-width: 250px; max-width: 700px; width: "+chart_width+"; height: 450px; float: left;'></div>";
        $(".comparison-container").append(chart_div);
        $("#" + chart_type_container).css({
            "width": chart_width,
            "float": "left"
        });
        if (static_questions.indexOf(main_indicator) == -1) {
            var post_data = getPostData(main_indicator, "");
            if (disaggregate_by != "0") {
                post_data["q2_id"] = disaggregate_by;
                postRequest(url, post_data, chart_type, chart_type_container, "y");
            } else {
                postRequest(url, post_data, chart_type, chart_type_container);
            }
        } else {
            displayStaticChart(chart_type_container, static_data[main_indicator], chart_type, main_indicator.replace("q", ""));
        }

        displayStaticChart("comparison-chart-container", static_data[q_id], chart_type, q_id.replace("q", ""), {static_question:q_id});
    });
}

// displays chart on dis-aggregate by select box change
function disaggregateSelectBoxChange(){
    $("#disaggregate-select").change(function () {
        var disaggregate_by = $(this).val();
        var chart_type = $('input[name=tabs]:checked').val();
        var chart_type_container = chart_type + "-container";
        var main_indicator = $("#main-indicator-select").val();
        if (main_indicator.charAt(0) == "5"){
            var disaggregate_by_lang = $("#disaggregate-select option:selected" ).text();
            displayStaticChart(chart_type_container, static_data[main_indicator], chart_type, main_indicator.replace("q", ""), disaggregate_by_lang);
        } else {
            var post_data = getPostData(main_indicator, disaggregate_by);
            if (disaggregate_by != "0") {
                postRequest(url, post_data, chart_type, chart_type_container, "y");
            } else {
                post_data['q2_id'] = "";
                postRequest(url, post_data, chart_type, chart_type_container);
            }
        }
    });
}

// displays the chart on main indicator select box change.
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

// returns the json depth to check if it's multiple series chart or single series chart.
function getJsonObjectDepth(parent) {
    var hasNonLeafNodes = false;
    var childCount = 0;

    for (var child in parent) {
        if (typeof parent[child] === 'object') {
            // Parse this sub-category:
            childCount += getJsonObjectDepth(parent[child]);
            // Set the hasNonLeafNodes flag (used below):
            hasNonLeafNodes = true;
        }
    }

    if (hasNonLeafNodes) {
        // Add 'num_children' element and return the recursive result:
        parent.num_children = childCount;
        return childCount;
    } else {
        // This is a leaf item, so return 1:
        return 1;
    }
}

// builds multiple series chart data for displaying in the chart.
function buildMultipleSeriesChartData(categories, title, data, series, chart_container, chart_type, static_q_diss_type){
    var answers = data["answer"][window.language];
    if (static_q_diss_type) {
        if(data["answer"][window.language][static_q_diss_type]){
            answers = data["answer"][window.language][static_q_diss_type];
        }else{
            answers = data["answer"][window.language]["0"];
        }
    }
    for (var category in answers) {
        categories.push(category);
        for (var sub_category in answers[category]) {
            var serie_json = {
                "name": "",
                "data": []
            };
            var index = series.map(function (d) {
                return d['name'];
            }).indexOf(sub_category);
            if (index == -1) {
                serie_json['name'] = sub_category;
                serie_json['data'].push(Number(answers[category][sub_category]));
                series.push(serie_json);
            } else {
                series[index]["data"].push(Number(answers[category][sub_category]))
            }

        }
    }

    var chart_plot_options = {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
            enabled: true,
            format: '{y:,.1f}%'
        }
    };

    if (window.screen.width < 768) {
        chart_plot_options['dataLabels']["enabled"] = false;
    }
    drawMultipleSeriesChart(chart_container, chart_type, title, categories, chart_plot_options, series);
}

// displays static chart based on the attributes given/
var displayStaticChart = parameterfy(function(chart_container, data, chart_type, question_id, static_q_diss_type, static_question) {
    chart_type = chart_type.replace("-chart", "");
    var json_depth = getJsonObjectDepth(data);
    $("#" + chart_container).empty();
    var question_title = data['question'][window.language];
    var title = getChartTitle(question_id, question_title);
    var categories = [];
    var series = [];
    if (json_depth > 4) {
        if (question_id.charAt(0) != "5") {
            buildMultipleSeriesChartData(categories, title, data, series, chart_container, chart_type);
        } else {
            buildMultipleSeriesChartData(categories, title, data, series, chart_container, chart_type, static_q_diss_type);
        }
    } else {
        for (var category in data['answer'][window.language]) {
            var simple_serie = {
                "type1": category,
                "count": Number(data['answer'][window.language][category])
            };
            series.push(simple_serie);
        }
        drawChart(chart_container, chart_type, series, {static_question:static_question});
    }
});

// grabs the first indicator from json object.
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

// on topic select function.
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
        $(".comparison-container").remove();
        $(".chart").css({
            "width": "",
            "float": "none"
        });
        populateMainIndicatorSelectBoxes(topic);
        populateDisaggregateSelectBox(main_indicator, topic);
        mainIndicatorSelectBoxChange();
        displayChart();
    })
}

// displays the div on the left for choosing the topic and the arrow animation for displaying and hiding the div..
function initTopicToggleButton(){
    var left_margin = "255px";
    var left_margin_0 = "0px";
    if (window.screen.width < 858){
        left_margin = "270px";
        left_margin_0 = "2.5%";
    }

    $('#show').click(function(e) {
        e.preventDefault();
        var hidden = $('.hidden');
        var class_name = $(this).attr("class");
        if (class_name == "show") {
            $(this).removeClass("show");
            $(this).addClass("hide");
            hidden.show('slide', {direction: 'left'}, 400);
            $("#show h4").hide('slide', {direction: 'left'}, 400);
            $(this).animate({
                marginLeft: left_margin
            }, 400);
            $("#show img").rotate({endDeg: 540, duration: 0.4, persist: true});
        } else {
            $(this).removeClass("hide");
            $(this).addClass("show");
            hidden.hide('slide', {direction: 'left'}, 400);
            $("#show h4").show('slide', {direction: 'left'}, 400);
            $("#show").animate({
                marginLeft: left_margin_0
            }, 400);
            $("#show img").rotate({endDeg: 360, duration: 0.4});
        }
    });
}
