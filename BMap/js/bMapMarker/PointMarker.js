/**
 * Created by Faizal on 2016/5/4.
 */
/**
 * 点覆盖物模块(位置点)
 */
define(['baiduAPI', 'jquery', 'bMapMarker/MarkerRepo', 'rasterSystem/RasterRepo'], function (BMap, $, MarkerRepo, RasterRepo) {
   function PointMarker() {
       //PointMarker对象参数列表
       this.para = {
           map : null,  //BMap对象
           pos : null,  //事件触发时事件位置对象
           pointTypeName : ''   //位置对象类型名
       }
   }
   PointMarker.prototype = {
        //点类型
        pointType : {
            origin : {
                icon : 'public/Icon/org.ico'    //该类型点的图标
            },
            destination : {
                icon : 'public/Icon/des.ico'
            },
            waypoint : {
                icon : 'public/Icon/wap.ico'
            },
            searchMarker : {
                icon : 'public/Icon/searchMarker.ico'
            },
            rasterExit : {
                icon : 'public/Icon/exit.ico'
            }
        },
       //创建位置点
       createPoint : function (para) {
           var PARA = $.extend(this.para, para);
           var map = PARA.map,
               lat = PARA.pos.lat,
               lng = PARA.pos.lng,
               iconSize = new BMap.Size(36,48),    //点图标大小
               pointType = this.pointType[PARA.pointTypeName],
               pIcon = new BMap.Icon(pointType.icon, iconSize),    //实例化图标
               marker = new BMap.Marker(new BMap.Point(lng, lat),{icon: pIcon}),    //实例化位置对象
               removeMarker = function (e, ee, marker) {
                   //从仓库中删除位置点
                   MarkerRepo.deletePoint({
                       map : map,
                       pointTypeName : PARA.pointTypeName,
                       pointMarker : marker
                   });
               },
               markerMenu = new BMap.ContextMenu();

           //将位置点添加到覆盖物仓库MarkerRepo中
           MarkerRepo.addPoint({
               map : map,
               pointTypeName : PARA.pointTypeName,
               pointMarker : marker
           });

           //添加位置点右键菜单
           markerMenu.addItem(new BMap.MenuItem('删除', removeMarker.bind(marker)));
           //将位置点设置为可拖拽
           marker.enableDragging();
           marker.addContextMenu(markerMenu);
           map.addOverlay(marker);

       }
   };
    return {
        PointMarker : PointMarker
    };
});