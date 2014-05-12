// Main media dash object
var MediaDash = {
    State: {},
    Util: {}
};

// State data
MediaDash.State = {
    active_frame_name   : "",
    sabnzbd_state       : {},
    speed_chart         : undefined,
    speed_chart_arrow   : undefined,
    speed_chart_axis    : undefined,

    speed_history_data  : [],
    speed_history_chart : undefined,

    disk_usage_data     : [],
    disk_charts         : [],

    charts_created          : false,
    disk_charts_created     : false,
    temps_charts_created    : false,
    fans_charts_created     : false,

    startup_functions       : []
};

MediaDash.RunDashboard = function() {
    var c = this.Util;
    var settings = MediaDashSettings;

    c.SetupSiteLinks();

    c.SwitchSite(Object.keys(settings.site_map)[0]);
    c.ResizeFrameView();

    $(window).resize(function() {
        c.ResizeFrameView();
    });

    if(settings.enable_dashboard)
    {
        c.CreateCharts();

        for(f in this.State.startup_functions)
        {
            this.State.startup_functions[f]();
        }
    }
}

MediaDash.RegisterStartupFunction = function(func) {
    this.State.startup_functions.push(func);
}

