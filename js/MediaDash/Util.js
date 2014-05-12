MediaDash.Util = {
    weekdays :
    [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
};

MediaDash.Util.SwitchSite = function(site_name, button) {
    var settings = MediaDashSettings;
    var state = MediaDash.State;

    if(site_name == "dashboard") {
        $(".container").show();
        $(settings.frame_id).hide();
    } else {
        $(".container").hide();
        $(settings.frame_id).show();

        if(state.active_frame_name != site_name) {
            state.active_frame_name = site_name;
            $(settings.frame_id).attr("src", settings.site_map[site_name].address);   
        }   
    }

    if(button) {
        $(".nav li", settings.nav_container_id).removeClass("active");
        $(button.parentNode).addClass("active");
    } else {
        $(".nav li:first", settings.nav_container_id).addClass("active");
    }

    this.UpdateTitle(settings.site_map[site_name].name);

    this.ResizeFrameView();
}

MediaDash.Util.SetupSiteLinks = function()
{
    var settings = MediaDashSettings;
    var util = this;

    for(s in settings.site_map)
    {
        var site_info = settings.site_map[s];
        $(settings.nav_links_id).append("<li><a href='javascript: void(0)' data-site='" + s + "'>" + site_info.name + "</a></li>");
    }

    $("a", settings.nav_links_id).click(function(e) {
        var link = this;

        util.SwitchSite($(link).attr("data-site"), link);
    });
}

MediaDash.Util.ResizeFrameView = function() {
    var settings = MediaDashSettings;

    var frame = $(settings.frame_id);
    var container = $(".container");

    var viewport_height = window.innerHeight;
    var element_height = viewport_height - frame.offset().top - 5;

    frame.height(element_height);
}

MediaDash.Util.UpdateTitle = function(title) {
    var settings = MediaDashSettings;

    document.title = title + " | " + settings.page_title;
}

MediaDash.Util.CreateCharts = function() {
    if(AmCharts)
    {
        var util = this;

        AmCharts.ready(function() {
            util.CreateSpeedChart();
            util.CreateSpeedHistoryChart();

            MediaDash.State.charts_created = true;
        });
    }
}

MediaDash.Util.CreateSpeedChart = function() {
    var state = MediaDash.State;
    var settings = MediaDashSettings;

    // create angular gauge
    state.speed_chart = new AmCharts.AmAngularGauge();

    // create axis
    state.speed_chart_axis = new AmCharts.GaugeAxis();
    state.speed_chart_axis.startValue = 0;
    state.speed_chart_axis.endValue = settings.internet_max_speed;

    state.speed_chart_axis.radius = "100%";
    state.speed_chart_axis.inside = false;
    state.speed_chart_axis.gridInside = false;
    state.speed_chart_axis.axisColor = "#94dca0";
    state.speed_chart_axis.tickColor = "#94dca0";
    state.speed_chart_axis.axisThickness = 3;

    state.speed_chart_axis.minorTickInterval = 1;
    state.speed_chart_axis.valueInterval = 1;

    // bottom text
    state.speed_chart_axis.bottomTextYOffset = -20;
    state.speed_chart_axis.setBottomText("0 MB/s");
    state.speed_chart.addAxis(state.speed_chart_axis);

    // gauge arrow
    state.speed_chart_arrow = new AmCharts.GaugeArrow();
    state.speed_chart_arrow.color = "#8ec487";
    state.speed_chart.addArrow(state.speed_chart_arrow);

    state.speed_chart.write("speed_chart");
}

MediaDash.Util.CreateSpeedHistoryChart = function() {
    var state = MediaDash.State;
    var settings = MediaDashSettings;

    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.pathToImages = "js/amcharts/images/";
    chart.dataProvider = state.speed_history_data;
    chart.marginLeft = 10;
    chart.categoryField = "time";
    chart.dataDateFormat = "ss";

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "ss"; // our data is yearly, so we set minPeriod to YYYY
    categoryAxis.dashLength = 3;
    categoryAxis.minorGridEnabled = true;
    categoryAxis.minorGridAlpha = 0.1;

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0;
    valueAxis.inside = true;
    valueAxis.dashLength = 3;
    valueAxis.minimum = 0;
    valueAxis.maximum = settings.internet_max_speed;
    chart.addValueAxis(valueAxis);

    // GRAPH                
    graph = new AmCharts.AmGraph();
    graph.type = "smoothedLine"; // this line makes the graph smoothed line.
    graph.lineColor = "#d1655d";
    graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
    graph.bullet = "round";
    graph.bulletSize = 8;
    graph.bulletBorderColor = "#FFFFFF";
    graph.bulletBorderAlpha = 1;
    graph.bulletBorderThickness = 2;
    graph.lineThickness = 2;
    graph.valueField = "value";
    graph.balloonText = "[[value]] MB/s";
    chart.addGraph(graph);

    state.speed_history_chart = chart;

    // WRITE
    chart.write("speed_history_chart");
}

MediaDash.Util.CreateDiskSpaceChart = function(title, data, chart_id, width) {
    // PIE CHART
    var chart = new AmCharts.AmPieChart();
    chart.dataProvider = data;
    chart.titleField = "title";
    chart.valueField = "value";
    chart.outlineColor = "#FFFFFF";
    chart.outlineAlpha = 0.8;
    chart.outlineThickness = 2;
    chart.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> GB ([[percents]]%)</span>";
    chart.labelText = "[[percents]]%";
    
    $("#disk_space_charts").append("<div class='col-md-" + width + "'><p class='text-center'>"+ title +"</p><div id='disk_chart_" + chart_id + "' style='width: 100%; height:200px'></div><p class='text-center' id='disk_chart_sizes_"+chart_id+"'></p></div>");

    MediaDash.State.disk_charts.push(chart);

    // WRITE
    chart.write("disk_chart_" + chart_id);
}

MediaDash.Util.UpdateDownloadSpeed = function(speed) {
    var state = MediaDash.State;

    // B/s to MB/s
    var value = (speed / 1024) / 2014;

    state.speed_chart_arrow.setValue(value);
    state.speed_chart_axis.setBottomText(value.toFixed(2) + " MB/s");

    state.speed_history_data.push({time: new Date(), value: value.toFixed(2)});

    if(state.speed_history_data.length > 50) {
        state.speed_history_data.splice(0, 1);
    }

    state.speed_history_chart.validateData();
}

MediaDash.Util.BuildTable = function(title, headers, data) {
    var table_html = "<h5>" + title + "</h5>";
    table_html += "<table class='table table-condensed table-striped table-hover'>";
    table_html += "<thead><tr>";

    for(h in headers) 
    {
        table_html += "<th>" + headers[h] + "</th>";
    }

    table_html += "</tr></thead><tbody>";

    for(r in data)
    {
        table_html += "<tr>";

        for(c in data[r])
        {
            table_html += "<td>" + data[r][c] + "</td>";
        }

        table_html += "</tr>";
    }

    table_html += "</tbody></table>";

    return table_html;
}

MediaDash.Util.GetFormattedTime = function(seconds) {
    
    var s = Math.floor(seconds % 60);
    var m = Math.floor((seconds / 60 % 60));
    var h = Math.floor((seconds / 3600 % 24));
    var d = Math.floor((seconds / 86400 % 7));
    var w = Math.floor((seconds / 86400 / 7))

    var output = "";
    if (w > 0) output += w + "w ";
    if (w > 0 || d > 0) output += d + "d ";
    if (w > 0 || d > 0 || h > 0) output += h + "h ";
    if (w > 0 || d > 0 || m > 0 || h > 0) output += m + "m ";
    if (w > 0 || d > 0 || s > 0 || m > 0 || h > 0) output += s + "s ";

    return output;
}