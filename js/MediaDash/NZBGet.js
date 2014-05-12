MediaDash.NZBGet = {};

MediaDash.NZBGet.Update = function() {
    var settings = MediaDashSettings;
    var state = MediaDash.State;
    var nzbget = this;

    $.post(settings.nzbget_json_url, JSON.stringify({ method: "status", params: [], id: 0 }), function(data) { 
        MediaDash.Util.UpdateDownloadSpeed(data.result.DownloadRate);

        // Calculate est time left
        if(data.result.DownloadRate > 0 && data.result.RemainingSizeLo > 0) {
            var est_time_left_seconds = data.result.RemainingSizeLo / data.result.DownloadRate;
            $("#download_time_remain").html(sprintf("Time Remaining: %s", MediaDash.Util.GetFormattedTime(est_time_left_seconds)));
            $("#download_time_remain").show();
        }
        else
        {
            $("#download_time_remain").hide();
        }

    }, "json");

    $.post(settings.nzbget_json_url, JSON.stringify({ method: "listgroups", params: [], id: 0 }), function(data) {
        if(data.result.length > 0) {
            $("#download_queue_row").show();

            var table_html = "";

            for(j in data.result) {
                var job = data.result[j];

                var percentage_complete = ((job.FileSizeMB - job.RemainingSizeMB) / job.FileSizeMB) * 100.0;
                var percentage_string = percentage_complete.toFixed(1);

                table_html += sprintf("<tr><td>%s</td><td><div class='progress progress-striped active'><div class='progress-bar' role='progressbar' aria-valuenow='%s' aria-valuemin='0' aria-valuemax='100' style='width: %s%%'><span>%s%%</span></div></div></td></tr>", job.NZBName, percentage_string, percentage_string, percentage_string);
            }

            $("#download_queue_body").html(table_html);

        } else {
            $("#download_queue_row").hide();
        }
    }, "json");

    setTimeout(MediaDash.NZBGet.Update, settings.nzbget_refresh_interval);
}

// register self
if(MediaDashSettings.enable_nzbget) {
    MediaDash.RegisterStartupFunction(MediaDash.NZBGet.Update);
}