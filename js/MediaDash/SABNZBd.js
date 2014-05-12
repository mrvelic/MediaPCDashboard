MediaDash.SABNZBd = {};

MediaDash.SABNZBd.UpdateDashboardInfo = function() {
    var settings = MediaDashSettings;
    var state = MediaDash.State;

    if(state.charts_created) {

        MediaDash.Util.UpdateDownloadSpeed(state.sabnzbd_state.kbpersec * 1024);

        if(state.sabnzbd_state.jobs.length > 0) {
            $("#download_queue_row").show();

            var table_html = "";

            for(j in state.sabnzbd_state.jobs) {
                var job = state.sabnzbd_state.jobs[j];

                table_html += "<tr><td>"+ job.filename +"</td><td>" + (job.mb - job.mbleft).toFixed(2) + " / " + job.mb.toFixed(2) + " MB</td></tr>";
            }

            $("#download_queue_body").html(table_html);

        } else {
            $("#download_queue_row").hide();
        }
    }
}

MediaDash.SABNZBd.Update = function() {
    var settings = MediaDashSettings;
    var state = MediaDash.State;
    var sab = this;

    $.get(settings.sabnzbd_url, { mode: "qstatus", output: "json", apikey: settings.sabnzbd_api_key }, function(data) { 
        state.sabnzbd_state = data;

        sab.UpdateDashboardInfo();

        setTimeout(MediaDash.SABNZBd.Update, settings.sab_refresh_interval);
    }, "json");
}

// register self
if(MediaDashSettings.enable_sab) {
    MediaDash.RegisterStartupFunction(MediaDash.SABNZBd.Update);
}