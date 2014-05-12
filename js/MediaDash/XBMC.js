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