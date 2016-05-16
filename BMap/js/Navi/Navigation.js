/**
 * Created by Faizal on 2016/5/5.
 */
/**
 * 导航模块
 */
define(['baiduAPI', 'jquery', 'bMapMarker/MarkerRepo', 'navi/NaviRepo', 'rasterSystem/RasterRepo'], function (BMap, $, MarkerRepo, NaviRepo, RasterRepo) {
    function Navigation() {
        //导航模块参数
        this.naviPara = {
            naviTypeName : '',  //导航类型名称
            map : null, //底图
            origin : null,  //起点
            destination : null, //终点
            waypoint : null,    //途经点
            panel : null    //显示路径信息的面板
        };
        //地理坐标转像素坐标参数
        this.geoToPixelPara = {
            raster : null, //所在栅格对象
            pixelSize : {    //像素大小
                pixelLenX : null,  //经度（横方向）像素大小
                pixelLenY : null   //纬度（纵方向）像素大小
            },
            lat : 0,  //需要转化的点的纬度
            lng : 0   //需要转化的点的经度
        };
        //像素坐标转地理坐标参数
        this.pixelToGeoPara = {
            pixelSize : {    //像素大小
                pixelLenX : null,  //经度（横方向）像素大小
                pixelLenY : null   //纬度（纵方向）像素大小
            },
            pixelX : 0,  //横方向上的像素坐标
            pixelY : 0   //纵方向上的像素坐标
        }
    }
    Navigation.prototype = {
        //导航方式选择
        selection : function (naviPara) {
            var NAVIPARA = $.extend(this.naviPara, naviPara);
            var rasterRepo = RasterRepo.getRasters('raster');
            // 判断起点终点位置并存储
            new Navigation().isInRaster();

            // 第一次循环，判断起点是否在栅格内
            for(var i = 0, lenOfOrg = rasterRepo.length; i < lenOfOrg; i++) {
                
                // 当起点位于第i个栅格内
                if(rasterRepo[i].org !== null) {
                    // 当终点与起点位于同一个栅格内
                    if(rasterRepo[i].des !== null) {
                        var points = {
                            org : rasterRepo[i].org,
                            des : [rasterRepo[i].des]
                        };
                        new Navigation().findShortestPath(pointsOfOrg, rasterRepo[i]);
                    }
                    // 当终点与起点不在同一个栅格内
                    else {
                        for(var j = 0, lenOfDes = rasterRepo.length; j < lenOfDes; j++) {
                            // 当终点位于另一个栅格内
                            if(rasterRepo[j].des !== null && i !== j) {
                                var pointsOfOrg = {
                                    org : rasterRepo[i].org,
                                    des : rasterRepo[i].rasterPara.exit
                                };
                                new Navigation().findShortestPath(pointsOfOrg, rasterRepo[i]);
                                /**
                                 * var nearestExit = ...
                                 * 这里写一个方法，提取返回的json对象里最后一个点的坐标，并生成一个Marker作为百度导航的起点；
                                 * 并重新设置百度导航的起点为刚才生成的Marker
                                 * NAVIPARA.origin = nearestExit;
                                 */
                                var pointsOfDes = {
                                    org : rasterRepo[j].des,
                                    des : rasterRepo[j].rasterPara.exit
                                }
                                new Navigation().findShortestPath(pointsOfDes, rasterRepo[j]);
                                /**
                                 * var nearestExit = ...
                                 * 这里写一个方法，提取返回的json对象里最后一个点的坐标，并生成一个Marker作为百度导航的终点；
                                 * 并重新设置百度导航的终点为刚才生成的Marker
                                 * NAVIPARA.destination = nearestExit;
                                 */
                                new Navigation().baiduNaviSearch(NAVIPARA);

                            }
                            // 当终点不在栅格内
                            else {
                                var pointsOfOrg = {
                                    org : rasterRepo[i].org,
                                    des : rasterRepo[i].rasterPara.exit
                                };
                                new Navigation().findShortestPath(pointsOfOrg, rasterRepo[i]);
                                /**
                                 * var nearestExit = ...
                                 * 这里写一个方法，提取返回的json对象里最后一个点的坐标，并生成一个Marker作为百度导航的起点；
                                 * 并重新设置百度导航的起点为刚才生成的Marker
                                 * NAVIPARA.origin = nearestExit;
                                 */
                                new Navigation().baiduNaviSearch(NAVIPARA);
                            }
                        }
                    }
                }
            }

            // 第一次循环后，如果没有在任何一个栅格内找到起点，进入第二次循环，判断终点的情况
            for(var i = 0, lenOfDes = rasterRepo.length; i < lenOfDes; i++) {
                // 当终点存在于一个栅格内时
                if(rasterRepo[i].des !== null) {
                    var pointsOfDes = {
                        org : rasterRepo[i].des,
                        des : rasterRepo[i].rasterPara.exit
                    };
                    new Navigation().findShortestPath(pointsOfDes, rasterRepo[i]);
                    /**
                     * var nearestExit = ...
                     * 这里写一个方法，提取返回的json对象里最后一个点的坐标，并生成一个Marker作为百度导航的终点；
                     * 并重新设置百度导航的终点为刚才生成的Marker
                     * NAVIPARA.destination = nearestExit;
                     */
                    new Navigation().baiduNaviSearch(NAVIPARA);
                }
                // 终点也不在任何一个栅格内，即起点和终点都在栅格外
                else {
                    new Navigation().baiduNaviSearch(NAVIPARA);
                }
            }
        },
        /**
         * 其他需要完善的方法！！！
         */
        // 查询栅格内两个点最短路径的方法
        findShortestPath : function (points, raster) {
            var orgPixelSize = new Navigation().calPixelSize(raster);
            // 地理坐标向像素坐标转换
            var geoToPixelParaOfOrg = {
                raster : raster, //所在栅格对象
                pixelSize : {    //像素大小
                    pixelLenX : orgPixelSize.pixelLenX,  //经度（横方向）像素大小
                    pixelLenY : orgPixelSize.pixelLenY   //纬度（纵方向）像素大小
                },
                lat : points.org.point.lat,  //需要转化的点的纬度
                lng : points.org.point.lng   //需要转化的点的经度
            };
            var orgPoint = new Navigation().geoToPixel(geoToPixelParaOfOrg);
            
            var desPoints = [];

            for(var i = 0, len = points.des.length; i < len; i++) {
                var geoToPixelParaOfDes = {
                    raster : raster, //所在栅格对象
                    pixelSize : {    //像素大小
                        pixelLenX : orgPixelSize.pixelLenX,  //经度（横方向）像素大小
                        pixelLenY : orgPixelSize.pixelLenY   //纬度（纵方向）像素大小
                    },
                    lat : points.des[i].lat,  //需要转化的点的纬度
                    lng : points.des[i].lng  //需要转化的点的经度
                };
                var desPoint = new Navigation().geoToPixel(geoToPixelParaOfDes);
                desPoints.push(desPoint);
            }

            console.log(orgPoint, desPoints);



            // 转换完成后，向服务器端发送起点和终点素组的像素坐标数据
            $.post('/sendPoints', {orgPoint: orgPoint, desPoints: desPoints}, function (data, textStatus) {
                console.log(textStatus + ',' + data.result);    
            });
            // 服务器端处理完成后，发送像素坐标路径数组给浏览器端，进行转码
            // 查找完成后绘制,记得添加到NaviRepo中便于删除
            
            // return JSON 路径点数组
        },
        // 计算像素大小
        calPixelSize : function (raster) {
            console.log(raster);
            // Y表示纬度方向，纵向
            var pixelLenY = (raster.rasterPara.NELat - raster.rasterPara.SWLat) / raster.G0,
            // X表示经度方向，横向
                pixelLenX = (raster.rasterPara.NELng - raster.rasterPara.SWLng) / raster.H0;
            return {
                pixelLenX : pixelLenX,
                pixelLenY : pixelLenY
            }
        },
        // 地理坐标转化成像素坐标
        geoToPixel : function (geoToPixelPara) {
            /** 地理坐标转化成像素坐标需要的参数
             * geoToPixelPara = {
             *      raster : raster, //所在栅格对象
             *      pixelSize : {    //像素大小
             *          pixelLenX : pixelLenX,  //经度（横方向）像素大小
                        pixelLenY : pixelLenY   //纬度（纵方向）像素大小
             *      },
             *      lat : num,  //需要转化的点的纬度
             *      lng : num   //需要转化的点的经度
             * }
             */
            var geoToPixelPARA = $.extend(this.geoToPixelPara, geoToPixelPara);
            var pixelY = parseInt((geoToPixelPARA.raster.rasterPara.NELat - geoToPixelPARA.lat) / geoToPixelPARA.pixelSize.pixelLenY),
                pixelX = parseInt((geoToPixelPARA.lng - geoToPixelPARA.raster.rasterPara.SWLng) / geoToPixelPARA.pixelSize.pixelLenX);
            return {
                pixelX : pixelX,
                pixelY : pixelY
            }
        },
        // 像素坐标转化成地理坐标
        pixelToGeo : function (pixelToGeoPara) {
            /** 像素坐标转化成地理坐标需要的参数
             * pixelToGeoPara = {
             *      pixelSize : {    //像素大小
             *          pixelLenX : pixelLenX,  //经度（横方向）像素大小
                        pixelLenY : pixelLenY   //纬度（纵方向）像素大小
             *      },
             *      pixelX : pixelX,  //横方向上的像素坐标
             *      pixelY : pixelY   //纵方向上的像素坐标
             * }
             */
            var pixelToGeoPARA = $.extend(this.pixelToGeoPara, pixelToGeoPara);
            var lat = pixelToGeoPARA.pixelY * pixelToGeoPARA.pixelSize.pixelLenY;
            var lng = pixelToGeoPARA.pixelX * pixelToGeoPARA.pixelSize.pixelLenY;
            return {
                lat : lat,
                lng : lng
            }
        },

        // 使用百度api查询路径
        baiduNaviSearch : function (naviPara) {
            var naviObject = null;
            var NAVIPARA = naviPara;
            switch (NAVIPARA.naviTypeName) {
                case 'driving' :
                    naviObject = this.driving(NAVIPARA);
                    break;
                case 'publicTransit' :
                    naviObject = this.publicTransit(NAVIPARA);
                    break;
                case 'walking' :
                    naviObject = this.walking(NAVIPARA);
                    break;
            }
            NaviRepo.addNaviResult({
                map : NAVIPARA.map,
                naviObject : naviObject
            });
        },
        // 判断起点终点位置
        isInRaster : function () {
            var origin = MarkerRepo.getPoints({pointTypeName : 'origin'}),
                destination = MarkerRepo.getPoints({pointTypeName : 'destination'});
            var rasterRepo = RasterRepo.getRasters('raster');
            var orgLng = origin[0].point.lng,   //起点经度
                orgLat = origin[0].point.lat,   //起点纬度
                desLng = destination[0].point.lng,  //终点经度
                desLat = destination[0].point.lat;  //终点纬度
            for(var i = 0, len = rasterRepo.length; i < len; i++) {
                    //第i个栅格东北角
                var NELng = rasterRepo[i].rasterPara.NELng,
                    NELat = rasterRepo[i].rasterPara.NELat,
                    //第i个栅格西南角
                    SWLng = rasterRepo[i].rasterPara.SWLng,
                    SWLat = rasterRepo[i].rasterPara.SWLat;
                // 判断起点是否在某个栅格范围内
                if(SWLng < orgLng && orgLng < NELng && SWLat < orgLat && orgLat < NELat) {
                    rasterRepo[i].org = origin[0];
                } else {
                    rasterRepo[i].org = null;
                }
                // 判断终点是否在某个栅格范围内
                if(SWLng < desLng && desLng < NELng && SWLat < desLat && desLat < NELat) {
                    rasterRepo[i].des = destination[0];
                } else {
                    rasterRepo[i].des = null;
                }
                console.log(rasterRepo);
            }
        },
        //驾车
        driving : function (para) {
            //初始化起点和终点
            if(para.origin === null) {
                alert('请选择起点');
            }
            if(para.origin !== null && para.destination === null) {
                alert('请选择终点');
            }
            var org = new BMap.Point(para.origin.getPosition().lng, para.origin.getPosition().lat),
                des = new BMap.Point(para.destination.getPosition().lng, para.destination.getPosition().lat);

            //实例化导航查询并显示
            var driving = new BMap.DrivingRoute(para.map, {
                renderOptions: {
                    map: para.map,
                    autoViewport: true,     //允许地图自动放大至合适大小
                    enableDragging : true,   //起终点可以拖拽
                    panel : para.panel
                }
            });
            driving.search(org, des);
            return driving;
        },
        //公交
        publicTransit : function (para) {
            //初始化起点和终点
            if(para.origin === null) {
                alert('请选择起点');
            }
            if(para.origin !== null && para.destination === null) {
                alert('请选择终点');
            }
            var org = new BMap.Point(para.origin.getPosition().lng, para.origin.getPosition().lat),
                des = new BMap.Point(para.destination.getPosition().lng, para.destination.getPosition().lat);
            //实例化导航查询并显示
            var publicTransit = new BMap.TransitRoute(para.map, {
                renderOptions: {
                    map: para.map,
                    autoViewport: true,     //允许地图自动放大至合适大小
                    panel : para.panel,
                    enableDragging : true //起终点可进行拖拽
                }
            });
            publicTransit.search(org, des);
            return publicTransit;
        },
        //步行
        walking : function (para) {
            //初始化起点和终点
            if(para.origin === null) {
                alert('请选择起点');
            }
            if(para.origin !== null && para.destination === null) {
                alert('请选择终点');
            }
            var org = new BMap.Point(para.origin.getPosition().lng, para.origin.getPosition().lat),
                des = new BMap.Point(para.destination.getPosition().lng, para.destination.getPosition().lat);
            //实例化导航查询并显示
            var walking = new BMap.WalkingRoute(para.map, {
                renderOptions: {
                    map: para.map,
                    autoViewport: true,     //允许地图自动放大至合适大小
                    panel : para.panel,
                    enableDragging : true //起终点可进行拖拽
                }
            });
            walking.search(org, des);
            return walking;
        }
    };
    return {
        Navigation : Navigation
    };
});