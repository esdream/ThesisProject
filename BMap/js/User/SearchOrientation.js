/**
 * 检索定位模块
 */
define(['baiduAPI','jquery', 'bMapMarker/PointMarker'], function (BMap, $, pointMarker) {
    function SearchOrientation() {
        this.para = {
            map : null,
            inputElementId : ''   //输入关键字的input标签id
        }
    }
    SearchOrientation.prototype = {
        search : function (para) {
            function G(id) {
                return document.getElementById(id);
            }
            var PARA = $.extend(this.para, para);
            //建立一个自动完成的对象
            var ac = new BMap.Autocomplete({
                input : PARA.inputElementId,
                location : PARA.map
            });
            ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }
                str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
                G("searchResultPanel").innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                setPlace(PARA.inputElementId);
            });

            function setPlace(inputElementId){
                function myFun(){
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    var pointPara = {};
                    if(inputElementId === 'orgInput') {
                        pointPara = {
                            map : PARA.map,
                            pos : pp,
                            pointTypeName : 'origin'
                        };
                    }
                    else if(inputElementId === 'desInput') {
                        pointPara = {
                            map : PARA.map,
                            pos : pp,
                            pointTypeName : 'destination'
                        };
                    }
                    PARA.map.centerAndZoom(pp, 18);
                    PARA.map.addOverlay(new pointMarker.PointMarker().createPoint(pointPara));    //添加标注
                }
                var local = new BMap.LocalSearch(PARA.map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }
        }
    };
    return {
        SearchOrientation : SearchOrientation
    };
});