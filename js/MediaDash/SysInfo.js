MediaDash.SysInfo = {};

MediaDash.SysInfo.GetDisplayMountPoint = function(mount_point)
{
    for(m in MediaDashSettings.sysinfo_mount_points)
    {
        if(MediaDashSettings.sysinfo_mount_points[m].mountpoint == mount_point) 
            return MediaDashSettings.sysinfo_mount_points[m];
    }

    return undefined;
}

MediaDash.SysInfo.Update = function() {
    var settings = MediaDashSettings;
    var state = MediaDash.State;
    var sysinfo = this;


    $.get(settings.phpsysinfo_json_url, function(data) {
        console.log(data);

        // If enabled disk checking
        if(settings.enable_disk_check) 
        {
            // clear existing data
            state.disk_usage_data = [];

            // filter out mount points we dont care about
            var disk_data = [];

            for(m in data.FileSystem.Mount)
            {
                var mount = data.FileSystem.Mount[m]["@attributes"];

                var mount_def = sysinfo.GetDisplayMountPoint(mount.MountPoint);
                if(mount_def != undefined)
                {
                    mount["DisplayName"] = mount_def.name;
                    disk_data.push(mount);
                }
            }

            // format data / create charts etc
            var width = 12 / disk_data.length;

            for(m in disk_data) {
                var mount = disk_data[m];

                state.disk_usage_data.push([{ title: "Used", value: (((mount.Used / 1024) / 1024) / 1024).toFixed(2) }, { title: "Available", value: (((mount.Free / 1024) / 1024) / 1024).toFixed(2) }]);

                if(!state.disk_charts_created) {
                    MediaDash.Util.CreateDiskSpaceChart(mount.DisplayName, state.disk_usage_data[m], m, width);
                }

                state.disk_charts[m].dataProvider = state.disk_usage_data[m];
                state.disk_charts[m].validateData();

                $("#disk_chart_sizes_" + m).html(state.disk_usage_data[m][1].value + " GB Free | " + state.disk_usage_data[m][0].value + " GB Used");
            }

            if(!state.disk_charts_created) state.disk_charts_created = true;
        }

        // Check temperatures
        if(settings.enable_temps_check)
        {
            var temps_table = [];

            for(var t in data.MBInfo.Temperature.Item)
            {
                var temp = data.MBInfo.Temperature.Item[t]["@attributes"];

                if($.inArray(temp.Label, settings.sysinfo_temps) >= 0)
                {
                    temps_table.push([ temp.Label, temp.Value + "&deg;", temp.Max + "&deg;" ]);
                }
            }

            if(temps_table.length > 0)
            {
                $("#temperatures_list").html(MediaDash.Util.BuildTable("Temperatures", ["Name", "Current", "Max"], temps_table));
            }
        }

        // Check fan speeds
        if(settings.enable_fans_check)
        {
            var fans_table = [];

            for(var t in data.MBInfo.Fans.Item)
            {
                var fan_info = data.MBInfo.Fans.Item[t]["@attributes"];

                if($.inArray(fan_info.Label, settings.sysinfo_fans) >= 0)
                {
                    fans_table.push([ fan_info.Label, fan_info.Value + " RPM" ]);
                }
            }

            if(fans_table.length > 0)
            {
                $("#fans_list").html(MediaDash.Util.BuildTable("Fan Speeds", ["Name", "Speed"], fans_table));
            }
        }

    }, "json");


    setTimeout(MediaDash.SysInfo.Update, settings.phpsysinfo_refresh_interval);
}

// register self
if(MediaDashSettings.enable_fans_check 
    || MediaDashSettings.enable_temps_check 
    || MediaDashSettings.enable_disk_check) 
{
    MediaDash.RegisterStartupFunction(function() { MediaDash.SysInfo.Update(); });
}