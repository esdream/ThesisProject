/**
 * Created by Faizal on 2016/5/5.
 */
/**
 * 覆盖物仓库模块 
 * 用来存放所有bMapMarker目录中可以创建的Marker(覆盖物)
 * 覆盖物仓库模块被声明为静态成员，在使用时不需要初始化，在需要使用模块的define中声明依赖后，通过"MarkerRepo.func()"调用
 */
define(['jquery'],function ($) {
    var MarkerRepo = function () {
        this.prototype.cfg = {
            map: null,
            pointMarker: null,
            pointTypeName : ''
        };
    };
    //点仓库
    MarkerRepo.prototype.pointMarkerRepo = {
        origin : [],
        destination : [],
        waypoint : [],
        searchMarker : [],
        rasterExit : [] //栅格对象出口点
    };
    //获取点覆盖物仓库中的点
    MarkerRepo.getPoints = function (cfg) {
        var CFG = $.extend(this.cfg, cfg);  //jquery的extend方法，合并两个对象。合并时比较两个参数，如果两个对象有相同的键名，则第二个参数中相同键名的键值会覆盖第一个参数
        var pointTypeName = CFG.pointTypeName;
        return MarkerRepo.prototype.pointMarkerRepo[pointTypeName];
    };
    //添加位置点覆盖物进入仓库
    MarkerRepo.addPoint = function (cfg) {
        var CFG = $.extend(this.cfg, cfg);
        var pointMarkerRepo = MarkerRepo.prototype.pointMarkerRepo;
        var pointTypeName = CFG.pointTypeName,
            pointMarker = CFG.pointMarker,
            map = CFG.map;
        if(pointTypeName === 'origin') {
            if (pointMarkerRepo.origin.length === 0) {
                pointMarkerRepo.origin.push(pointMarker);
            }
            else {
                map.removeOverlay(pointMarkerRepo.origin.shift());
                pointMarkerRepo.origin.push(pointMarker);
            }
        }
        else if(pointTypeName === 'destination') {
            if (pointMarkerRepo.destination.length === 0) {
                pointMarkerRepo.destination.push(pointMarker);
            }
            else {
                map.removeOverlay(pointMarkerRepo.destination.shift());
                pointMarkerRepo.destination.push(pointMarker);
            }
        }
        else if(pointTypeName === 'waypoint'){
            if(pointMarkerRepo.waypoint.length < 5) {
                pointMarkerRepo.waypoint.push(pointMarker);
            }
            else {
                map.removeOverlay(pointMarkerRepo.waypoint.shift());
                pointMarkerRepo.waypoint.push(pointMarker);
            }
        }
        else if(pointTypeName === 'searchMarker'){
            //searchMarker的点数设为多少比较合适?
            if(pointMarkerRepo.searchMarker.length < 1000) {
                pointMarkerRepo.searchMarker.push(pointMarker);
            }
            else {
                map.removeOverlay(pointMarkerRepo.searchMarker.shift());
                pointMarkerRepo.searchMarker.push(pointMarker);
            }
        }
        else if(pointTypeName === 'rasterExit'){
            if(pointMarkerRepo.rasterExit.length < 1000) {
                pointMarkerRepo.rasterExit.push(pointMarker);
            }
            else {
                map.removeOverlay(pointMarkerRepo.rasterExit.shift());
                pointMarkerRepo.rasterExit.push(pointMarker);
            }
        }



        console.log(pointMarkerRepo);
    };
    
    //从仓库中删除位置点覆盖物
    MarkerRepo.deletePoint = function (cfg) {
        var CFG = $.extend(this.cfg, cfg);
        var pointMarkerRepo = MarkerRepo.prototype.pointMarkerRepo;
        var pointTypeName = CFG.pointTypeName,
            pointMarker = CFG.pointMarker,
            map = CFG.map;
        var delPoint = (function (pointTypeName) {
            for(var i =0; i < pointMarkerRepo[pointTypeName].length; i++) {
                if(pointMarkerRepo[pointTypeName][i] === pointMarker) {
                    map.removeOverlay(pointMarkerRepo[pointTypeName][i]);
                    pointMarkerRepo[pointTypeName].splice(i, 1);
                    break;
                }
            }
        })(pointTypeName);

        console.log(pointMarkerRepo);

    }
    return MarkerRepo;
});