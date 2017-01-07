/**
 * Created by Faizal on 2016/5/6.
 */
/**
 * Raster对象模块
 */
define(['baiduAPI', 'jquery', 'rasterSystem/RasterRepo', 'bMapMarker/PointMarker'], function (BMap, $, RasterRepo, pointMarker) {
    function Raster() {
        this.para = {
            map : null,
            url : '',   //Raster对象的图片地址
            //西南角
            SWLng : null,
            SWLat : null,
            //东北角
            NELng : null,
            NELat : null,
            //出口
            exit : null
        }
    }
    Raster.prototype = {
        //创建栅格数据
        createRaster : function (para) {
            var PARA = $.extend(this.para, para);
            //Raster对象选项
            var groundOverlayOptions = {
                opacity : 0,
                displayOnMinLevel: 10,
                displayOnMaxLevel: 19
            },
                SW = new BMap.Point(PARA.SWLng, PARA.SWLat),
                NE = new BMap.Point(PARA.NELng, PARA.NELat);
            //初始化Raster对象
            var rasterData = new BMap.GroundOverlay(new BMap.Bounds(SW, NE), groundOverlayOptions);

            // 在raterData中绑定一个raterPara属性，用来添加rasterData的所有信息
            rasterData.rasterPara = PARA;
            // 在rasterData中预设起点和终点为null，在导航时进行起点终点判断
            rasterData.org = null;
            rasterData.des = null;
            // 设置Raster对象的图片地址
            rasterData.setImageURL(PARA.url);
            //在地图上显示Raster对象
            PARA.map.addOverlay(rasterData);

            // 如果是初始化时直接给栅格指定了出入口，则直接将出入口创建出来
                for (var i = 0, len = PARA.exit.length; i < len; i++) {
                    var exitPara = {
                        map : PARA.map,
                        pos : PARA.exit[i],
                        pointTypeName : 'rasterExit'
                    };
                    new pointMarker.PointMarker().createPoint(exitPara);
                }

            // 绑定Raster对象的单击事件为设定出口点
            // rasterData.addEventListener('click', function (e) {
            //     new Raster().addExit(PARA, rasterData, e);
            //     console.log(e);
            // });

            //将Raster对象添加到RasterRepo中
            RasterRepo.addRaster({
                rasterData : rasterData
            });

            // var imgs = $('img').eq(0);
            // console.log(imgs.style.zIndex());
        },
        //添加出入口函数
        addExit : function (para, rasterData) {

        }
    };

    // // 使用canvas绘制的栅格对象SquareOverlay
    // function RasterOverlay(para) {
    //     this.para = {
    //         map : null,
    //         url : '',   //Raster对象的图片地址
    //         //西南角
    //         SWLat : null,
    //         SWLng : null,
    //         //东北角
    //         NELat : null,
    //         NELng : null,
    //         //出口
    //         exit : []
    //     };
    //     this.para = para;
    // }
    // // 继承baiduAPI的BMap.Overlay
    // RasterOverlay.prototype = new BMap.Overlay();
    // // 实例化时会自动调用initialize方法
    // RasterOverlay.prototype.initialize = function (map) {
    //     var PARA = this.para;
    //     var raster = new Image();
    //     raster.src = PARA.url;
    //     var canvas = $('<canvas></canvas>');
    //     canvas.style.width = raster.width;
    //     canvas.style.height = raster.height;
    //     canvas.style.position = 'absolute';
    //     var context = canvas.getContext('2d');
    //     // 将画布添加到覆盖物容器中
    //     map.getPanes().markerPane.appendChild(canvas);
    //     context.drawImage(raster, 0, 0);
    //     // 保存画布实例
    //     this._canvas = canvas;
    //     // 保存图像实例
    //     this._raster = raster;
    //     // 返回画布对象，可以对其进行show、hide、remove等操作
    //     return canvas;
    // };
    // // 在地图上绘制时会自动调用draw方法
    // RasterOverlay.prototype.draw = function () {
    //     var position = this.para.map.pointToOverlayPixel(this.para.map.getCenter());
    //     this._canvas.style.left = position.x - this._raster.width / 2 + 'px';
    //     this._canvas.style.top = position.y - this._raster.height / 2 + 'px';
    // };
    return {
        Raster : Raster
    };
});
