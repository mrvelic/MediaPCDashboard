var MediaDashSettings = {
    // Base addresses
    base_address     : "http://192.168.1.200",

    // Page title
    page_title       : "Ze Media PC",

    // Max speed for net graph (in MB/s)
    internet_max_speed : 12,

    // Turn dashboard on / off
    enable_dashboard : true,

    // Turn on / off API checks
    enable_sab          : false,
    enable_nzbget       : true,
    enable_sickbeard    : false,
    enable_nzbdrone     : true,
    enable_couchpotato  : false,
    enable_disk_check   : true,
    enable_temps_check  : true,
    enable_fans_check   : true,

    // API Addresses / Keys
    sabnzbd_url                  : "/media/sab_api",
    sabnzbd_api_key              : "xx",
    sab_refresh_interval         : 2000,

    nzbget_json_url              : "/media/nzbget_api",
    nzbget_refresh_interval      : 2000,

    xbmc_json_url                : "/media/xbmc_api",

    phpsysinfo_json_url          : "/media/sysinfo/xml.php?plugin=complete&json",
    phpsysinfo_refresh_interval  : 20000,

    sickbeard_url                : "/media/sickbeard_api",
    sickbeard_api_key            : "xx",
    sickbeard_refresh_interval   : 20000,

    nzbdrone_url                 : "/media/nzbdrone_api",
    nzbdrone_api_key             : "xx",
    nzbdrone_refresh_interval    : 20000,

    couchpotato_url              : "/media/couchpotato_api",
    couchpotato_api_key          : "xx",
    couchpotato_refresh_interval : 20000,


    // PHPSysInfo Settings
    sysinfo_mount_points : 
    [
        { name: "NAS02 Video", mountpoint: "/media/NAS02/Video" },
        { name: "NAS01 Video", mountpoint: "/media/Stuff/Video" }
    ],

    sysinfo_temps   : ["CPUTIN", "AUXTIN"],
    sysinfo_fans    : ["fan3"],

    // Site Links
    site_map : [],

    // Container ID's
    frame_id            : "#site",
    nav_container_id    : "#main_nav_container",
    nav_links_id        : "#main_nav"
};

if(MediaDashSettings.enable_dashboard) {
    MediaDashSettings.site_map["dashboard"]       = { name: "Dashboard",      address: "#" };
}

// site links map
MediaDashSettings.site_map["nzbget"]              = { name: "NZBGet",         address: MediaDashSettings.base_address + ":6789" };
MediaDashSettings.site_map["nzbdrone"]            = { name: "NZBDrone",       address: MediaDashSettings.base_address + ":8990" };
MediaDashSettings.site_map["couchpotato_local"]   = { name: "CouchPotato",    address: MediaDashSettings.base_address + ":5050" };
MediaDashSettings.site_map["transmission"]        = { name: "Transmission",   address: MediaDashSettings.base_address + ":9091" };
MediaDashSettings.site_map["xbmc"]                = { name: "XBMC",           address: MediaDashSettings.base_address + ":8152" };
MediaDashSettings.site_map["sysinfo"]             = { name: "System Info",    address: "/media/sysinfo" };
MediaDashSettings.site_map["NAS01"]               = { name: "NAS01",          address: "http://192.168.1.202" };
MediaDashSettings.site_map["NAS02"]               = { name: "NAS02",          address: "http://192.168.1.203" };
MediaDashSettings.site_map["Trakt"]               = { name: "Trakt",          address: "http://trakt.tv/user/--" };

