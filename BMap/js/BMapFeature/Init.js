/**
 * 初始化模块
 */
define(['baiduAPI','bMapFeature/Traffic', 'bMapFeature/ContextMenuBar', 'user/InfoPane', 'rasterSystem/Raster', 'jquery'],function (BMap, traffic, contextMenuBar, infoPane, raster, $) {
    return function (bMap) {
        //百度地图底图初始化
        var map = new bMap.Map('allmap');
        var point = new bMap.Point(118.786218, 32.060879);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();

        //添加地图类型
        (function (map) {
            var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
            var mapType2 = new BMap.MapTypeControl({
                anchor : BMAP_ANCHOR_BOTTOM_LEFT,
                offset : new BMap.Size(20, 30)
            });
            map.addControl(mapType1);          //2D图，卫星图
            map.addControl(mapType2);          //左上角，默认地图控件
            map.setCurrentCity("南京");        //由于有3D图，需要设置城市
            
            map.addEventListener('click', function (point) {
                console.log(point);
            });

        })(map);

        //添加地图控件
        (function () {
            //比例尺
            var scale = new bMap.ScaleControl({
                anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                offset: new BMap.Size(150, 30)
            }),
            //导航栏
                navigation = new bMap.NavigationControl({
                    anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                    type: BMAP_NAVIGATION_CONTROL_ZOOM,
                    offset: new bMap.Size(27, 100)
                }),
            //定位控件
                geolocationControl = new bMap.GeolocationControl({
                    anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                    offset: new bMap.Size(20, 60)
                });
            //绑定定位失败事件
            geolocationControl.addEventListener('locationError', function (e) {
                alert('定位失败，请使用其他方式获取您的位置');
            });
            //添加控件
            map.addControl(scale);
            map.addControl(navigation);
            map.addControl(geolocationControl);
        })();

        //添加右键菜单
        (function (map) {
            new contextMenuBar.ContextMenuBar().init(map);
        })(map);

        //添加路况图层
        (function (map) {
            new traffic.Traffic().init(map);
        })(map);

        //添加信息面板
        new infoPane.InfoPane().init({map: map});

        //地图加载时自动初始化南大仙林校区栅格图像
        (function (map) {
            var para = {
                map : map,
                url : 'testImg/NJUXianLin.jpg',
                NELng : 118.973245,
                NELat : 32.135912,
                SWLng : 118.957363,
                SWLat : 32.112794,
                exit : [
                    {
                        lng : 118.967694,
                        lat : 32.116525
                    },
                    {
                        lng : 118.970838,
                        lat : 32.120455
                    },
                    {
                        lng : 118.958585,
                        lat : 32.123758
                    }
                ]
            };
            var NJUXianLinCampus = new raster.Raster().createRaster(para);
        })(map);

    }
});
