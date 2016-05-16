/**
 * Created by Faizal on 2016/5/4.
 */
/**
 * 路况信息模块 
 */
define(['baiduAPI','trafficControl'],function (BMap, BMapLib) {
    function Traffic() {
    }
    Traffic.prototype = {
        // displayToggle: function (handler) {
        //     if(handler.toggle === true) {
        //         handler.map.addTileLayer(handler.trafficLayer);
        //     }
        //     else {
        //         handler.map.removeTileLayer(handler.trafficLayer);
        //     }
        // },
        init : function (map) {
            var ctrl = new BMapLib.TrafficControl({
                showPanel: true  //是否显示路况提示面板
            });
            map.addControl(ctrl);
            ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
        }
    };
    return {
        Traffic: Traffic
    };
});