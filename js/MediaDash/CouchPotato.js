MediaDash.CouchPotato = {};

MediaDash.CouchPotato.Update = function() {
    var settings = MediaDashSettings;
    var state = MediaDash.State;
    var cp = this;

    // Get available movies
    $.get(settings.couchpotato_url + "/" + settings.couchpotato_api_key + "/media.list/", { release_status: "available" }, function(data) {
        var movie_table = [];

        for(m in data.movies) {
            var movie = data.movies[m];

            movie_table.push([ movie.library.info.original_title, "" ]);
        }

        $("#available_movies").html(MediaDash.Util.BuildTable("Available Movies", ["Name", ""], movie_table));
    }, "json");

    setTimeout(MediaDash.CouchPotato.Update, settings.couchpotato_refresh_interval);
}

// register self
if(MediaDashSettings.enable_couchpotato) {
    MediaDash.RegisterStartupFunction(MediaDash.CouchPotato.Update);
}