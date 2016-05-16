/**
 * Created by Faizal on 2016/5/4.
 */
/**
 * 右键菜单模块
 */
define(['baiduAPI','bMapMarker/PointMarker'], function (BMap,pointMarker) {
    //为避免右键菜单模块实例化方法与百度地图API中ContextMenu类冲突，将模块类函数命名为ContextMenuBar
    function ContextMenuBar() {}
    ContextMenuBar.prototype = {
        init: function (map) {
            //实例化右键菜单对象
            var menu = new BMap.ContextMenu();
            //打开右键菜单时事件，可以获取右键菜单的对象、位置
            var openEvent = new Object();
            menu.addEventListener('open', function (e) {
                openEvent = e;
            });
            //右键菜单内容
            var txtMenuItem = [
                    {
                        //右键菜单选项
                        text: '以此为起点',
                        //选项触发方法
                        callback: function () {
                            //字典类型参数，传递右键菜单事件位置对象pos和地图对象map
                            var para = {
                                pos : openEvent.point,
                                map : map,
                                pointTypeName : 'origin'
                            };
                            var orgPoint = new pointMarker.PointMarker().createPoint(para);
                        }
                    },
                    {
                        text: '以此为途经点',
                        callback: function () {
                            var para = {
                                pos : openEvent.point,
                                map : map,
                                pointTypeName : 'waypoint'
                            };
                            var wapPoint = new pointMarker.PointMarker().createPoint(para);
                        }
                    },   
                    {
                        text: '以此为终点',
                        callback: function () {
                            var para = {
                                pos : openEvent.point,
                                map : map,
                                pointTypeName : 'destination'
                            };
                            var desPoint = new pointMarker.PointMarker().createPoint(para);
                        }
                    },
                    {
                        text: '以此为出口',
                        callback: function () {
                            var para = {
                                pos : openEvent.point,
                                map : map,
                                pointTypeName : 'rasterExit'
                            };
                            var exPoint = new pointMarker.PointMarker().createPoint(para);
                        }
                    }
                ];
            for(var i = 0; i < txtMenuItem.length; i++) {
                txtMenuItem[i].callback = menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback,100));
            }
            map.addContextMenu(menu);
        }
    };
    return {
        ContextMenuBar: ContextMenuBar
    }
});