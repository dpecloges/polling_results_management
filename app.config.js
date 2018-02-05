'use strict';

var appConfig = window.appConfig || {};

appConfig.menu_speed = 200;

appConfig.smartSkin = "smart-style-3";

appConfig.skins = [
    {name: "smart-style-3",
        logo: "",
        class: "btn btn-xs btn-block txt-color-white margin-top-5",
        style: "background:#f78c40",
        label: "Google Skin"}
];


appConfig.apiRootUrl = '/api';

window.appConfig = appConfig;
