MediaDash.NZBDrone = {};

MediaDash.NZBDrone.Update = function() {
    var settings = MediaDashSettings;
    var state = MediaDash.State;
    var nzbdrone = this;

    // Upcoming TV
    $.ajax(settings.nzbdrone_url + "/Calendar", 
    {
        type: "GET",
        headers: { "X-Api-Key": settings.nzbdrone_api_key }
    })
    .done(function(data) {
        var upcoming_show_table = [];

        for(s in data)
        {
            var show = data[s];
            var show_date = new Date(show.airDateUtc);

            if(!show.hasFile) {
                upcoming_show_table.push([show.series.title, show.title, MediaDash.Util.weekdays[show_date.getDay()] + " " + show_date.toLocaleTimeString()]);
            }
        }

        $("#upcoming_shows").html(MediaDash.Util.BuildTable("Upcoming TV Shows", ["Show", "Name", "Date"], upcoming_show_table));
    });

    $.ajax(settings.nzbdrone_url + "/History",
    {
        type: "GET",
        headers: { "X-Api-Key": settings.nzbdrone_api_key },
        data: 
        {
            page: 1,
            pageSize: 10,
            sortKey: "date",
            sortDir: "desc",
            filterKey: "eventType",
            filterValue: 1
        }
    })
    .done(function(data) {
        var downloaded_table = [];

        for(s in data.records)
        {
            var show = data.records[s];
            var show_date = new Date(show.date);

            downloaded_table.push([show.series.title, show.episode.title, MediaDash.Util.weekdays[show_date.getDay()] + " " + show_date.toLocaleTimeString()]);
        }

        $("#downloaded_shows").html(MediaDash.Util.BuildTable("Recently Downloaded TV Shows", ["Show", "Name", "Date"], downloaded_table));
    });

    setTimeout(MediaDash.NZBDrone.Update, settings.nzbdrone_refresh_interval);
}

// register self
if(MediaDashSettings.enable_nzbdrone) {
    MediaDash.RegisterStartupFunction(MediaDash.NZBDrone.Update);
}
