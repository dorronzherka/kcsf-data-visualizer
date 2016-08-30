---
---

var url = {{ site.requesturl }} +"comparison";
var language = window.language;

function getQuestionsToPopulateSelectBoxes() {
    return {
        "q9": ["q2", "q7", "q11", "q15"],
        "q18": ["q9", "q2", "q7", "q11", "q15", "q14"],
        "q22": ["q9", "q2", "q7", "q11", "q15"],
        "q75": ["q9", "q2", "q7", "q11", "q15", "q36", "q37", "q37", "q124", "q129"],
        "q77": ["q9", "q2", "q7", "q11", "q15", "q36", "q37"],
        "q80": ["q9", "q2", "q7", "q11", "q15", "q28"],
        "q112": ["q9", "q2", "q7", "q11", "q15", "q113"],
        "q119": ["q9", "q2", "q7", "q11", "q15"],
        "q120": ["q9", "q2", "q7", "q11", "q15"],
        "q122": ["q9", "q2", "q7", "q11", "q15"],
        "q124": ["q9", "q2", "q7", "q11", "q15", "q118"],
        "q126": ["q9", "q2", "q7", "q11", "q15", "q124"],
        "q127": ["q9", "q2", "q7", "q11", "q15", "q118"],
        "q128": ["q9", "q2", "q7", "q11", "q15", "q118"],
        "q138": ["q9", "q2", "q7", "q11", "q15"]
    };
}

function populateMainIndicatorSelectBoxes() {
    var main_indicators = getQuestionsToPopulateSelectBoxes();
    for (var indicator in main_indicators) {
        var indicator_str = indicator.replace("q", "");
        var option = translation_data[indicator_str][language];
        var option_html = "<option value='" + indicator + "'>" + option + "</option>";
        $("#main-indicator-select").append(option_html);
    }
}

function populateDisaggregateSelectBox(indicator) {
    $("#disaggregate-select").empty();
    var main_indicators = getQuestionsToPopulateSelectBoxes();
    var option_html = "<option value='0'>" + translation_data[0][window.language] + "</option>";
    $("#disaggregate-select").append(option_html);
    for (var i = 0; i < main_indicators[indicator].length; i++) {
        var q_id = main_indicators[indicator][i];
        var option = translation_data[q_id.replace("q", "")][language];
        var option_html = "<option value='" + q_id + "'>" + option + "</option>";
        $("#disaggregate-select").append(option_html);
    }
}

$(function () {
    populateMainIndicatorSelectBoxes();
    $.support.cors = true;
    var main_inicator = "q9";
    var post_data = {
        "q1_id": main_inicator,
        "q2_id": "",
        "lang": window.language
    };
    postRequest(url, post_data, "pie-chart", "pie-chart-container");
    displayChart("pie-chart-container", "pie");
    mainIndicatorSelectBoxChange();

    $("input[name='tabs']").change(function () {
        $(".chart").empty();
        var main_inicator = $("#main-indicator-select").val();
        var disaggregate_by = $("#disaggregate-select").val();
        var checked_rb = $(this).val();
        var chart_type_container = checked_rb + "-container";
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


});

function mainIndicatorSelectBoxChange() {
    $("#main-indicator-select").change(function () {
        var chart_type = $('input[name=tabs]:checked').val();
        var chart_type_container = chart_type + "-container";
        var main_inicator = $("#main-indicator-select").val();
        populateDisaggregateSelectBox(main_inicator);
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
        displayChart(chart_container, chart_type, data, double_questions);
    });
}