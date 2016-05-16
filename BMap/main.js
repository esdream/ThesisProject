require.config({
    baseUrl: './',
    paths: {
        // baiduLib: 'http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min',
        baiduAPI: 'http://api.map.baidu.com/getscript?v=2.0&ak=YugmInOKVc8g8NKIFI6Blh6NIVGEGihv',

        // 自写模块
        bMapFeature: 'js/BMapFeature',
        bMapMarker: 'js/bMapMarker',
        navi: 'js/Navi',
        user: 'js/User',
        rasterSystem: 'js/RasterSystem',

        // 外部引入模块
        jquery: 'public/build/jquery-2.2.3.min',
        trafficControl: 'public/build/TrafficControl'
    },
    shim: {
        'baiduAPI': {
            exports: 'BMap'  //exports值（输出的变量名），表明这个模块外部调用时的名称，即外部调用必须使用该名称
        },
        'trafficControl': {
            deps : ['baiduAPI'],    //BMapLib的依赖应为shim的键名，而不是exports值
            exports : 'BMapLib'
        }
    }
});
require(['baiduAPI','bMapFeature/Init'],function (BMap, start) {
    start(BMap);
});
