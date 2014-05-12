MediaDash.SickBeard = {};

MediaDash.SickBeard.Update = function() {
    var settings = MediaDashSettings;

    // get upcoming shows
    $.get(settings.sickbeard_url + "/" + settings.sickbeard_api_key + "/", { cmd: "future", sort: "date", type: "today|missed" }, function(data) {
        table_html = "";
        shows = [];

        for(t in data.data.missed) {
            shows.push(data.data.missed[t]);
        }

        for(t in data.data.today) {
            shows.push(data.data.today[t]);
        }

        for(s in shows) {
            var show = shows[s];

            table_html += "<tr><td>"+ show.show_name +"</td><td>" + show.ep_name + "</td><td>" + show.airs + "</td></tr>";
        }

        $("#upcoming_shows").html(table_html);
    }, "json");

    // get downloaded shows
    $.get(settings.sickbeard_url + "/" + settings.sickbeard_api_key + "/", { cmd: "history", limit: 10, type: "downloaded" }, function(data) {
        table_html = "";

        for(s in data.data) {
            var show = data.data[s];

            table_html += "<tr><td>"+ show.show_name +"</td><td>S" + show.season + " E" + show.episode + "</td><td>" + show.date + "</td></tr>";
        }

        $("#downloaded_shows").html(table_html);
    }, "json");

    setTimeout(MediaDash.SickBeard.Update, settings.sickbeard_refresh_interval);
}

// register self
if(MediaDashSettings.enable_sickbeard) {
    MediaDash.RegisterStartupFunction(MediaDash.SickBeard.Update);
}