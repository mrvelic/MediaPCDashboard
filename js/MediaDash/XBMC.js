MediaDash.XBMC = {};

MediaDash.XBMC.RunCommand = function(command) {
    var settings = MediaDashSettings;

    $.ajax(settings.xbmc_json_url, 
        { 
            method: "POST", 
            data: JSON.stringify({ method: command, params: [], id: 1, jsonrpc: "2.0" }),
            headers: { "Content-Type": "application/json" }
        }
    )
    .done(function(data) {
        console.log(data);
    });
}

MediaDash.XBMC.CreateButtons = function() {
    var settings = MediaDashSettings.XBMC;
    var xbmc = this;

    if(settings.enable_update_library_button) {
        $("#util_buttons").append("<button class='pull-right btn btn-success' id='xbmc_video_library_update_btn'>Update XBMC Video Library</button>");

        $("#xbmc_video_library_update_btn").click(function() {
            xbmc.RunCommand('VideoLibrary.Scan');
        });
    }
}

// register self
MediaDash.RegisterStartupFunction(function() { 
    MediaDash.XBMC.CreateButtons();
});