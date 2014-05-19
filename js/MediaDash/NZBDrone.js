MediaDash.NZBDrone = {};

MediaDash.NZBDrone.TruncateEpisodeTitle = function(title) {
    if(title.length > MediaDashSettings.NZBDrone.max_episode_name_legnth)
    {
        return title.substring(0, MediaDashSettings.NZBDrone.max_episode_name_legnth) + "...";
    }

    return title;
}

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
                upcoming_show_table.push(
                    [
                        sprintf("<strong>%s</strong>", show.series.title), 
                        sprintf("S%02dE%02d", parseInt(show.seasonNumber), parseInt(show.episodeNumber)),
                        nzbdrone.TruncateEpisodeTitle(show.title), 
                        MediaDash.Util.weekdays[show_date.getDay()]
                    ]
                );
            }
        }

        $("#upcoming_shows").html(MediaDash.Util.BuildTable("Upcoming TV Shows", ["Show", "#", "Episode", "Day"], upcoming_show_table));
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
            filterValue: 3
        }
    })
    .done(function(data) {
        var downloaded_table = [];

        for(s in data.records)
        {
            var show = data.records[s];
            var show_date = new Date(show.date);

            downloaded_table.push(
                [
                    sprintf("<strong>%s</strong>", show.series.title), 
                    sprintf("S%02dE%02d", parseInt(show.episode.seasonNumber), parseInt(show.episode.episodeNumber)),
                    nzbdrone.TruncateEpisodeTitle(show.episode.title),
                    MediaDash.Util.weekdays[show_date.getDay()] 
                ]
            );
        }

        $("#downloaded_shows").html(MediaDash.Util.BuildTable("Recently Downloaded TV Shows", ["Show", "#", "Episode", "Day"], downloaded_table));
    });

    setTimeout(function() { MediaDash.NZBDrone.Update(); }, settings.nzbdrone_refresh_interval);
}

// register self
if(MediaDashSettings.enable_nzbdrone) {
    MediaDash.RegisterStartupFunction(function() { MediaDash.NZBDrone.Update(); });
}
