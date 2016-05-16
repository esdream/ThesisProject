/**
 * Created by Faizal on 2016/5/4.
 */
/**
 * 信息窗口模块
 */
define(['jquery', 'navi/Navigation', 'bMapMarker/MarkerRepo', 'user/SearchOrientation', 'rasterSystem/Raster', 'navi/NaviRepo'], function ($, navi, MarkerRepo, SearchOrientation, raster, NaviRepo) {
    function InfoPane() {
        this.para = {
            map : null
        };
    }
    InfoPane.prototype = {
        //所有信息面板初始化
        init : function (para) {
            var PARA = $.extend(this.para, para);
            var map = PARA.map;
            //导航信息面板
            var infoPane = $('<div class="infoPane_main"><div class="infoPane_main_tabContainer"><div class="infoPane_main_tabControl" id="driving">驾车</div><div class="infoPane_main_tabControl" id="publicTransit">公交</div><div class="infoPane_main_tabControl" id="walking">步行</div><div class="infoPane_main_clear" id="clear">×</div></div><div class="infoPane_main_orgAndDes"><div class="infoPane_main_origin"><input placeholder="输入起点" type="text" class="infoPane_main_input" id="orgInput"/></div><div class="infoPane_main_destination"><input placeholder="输入终点" type="text" class="infoPane_main_input" id="desInput"/></div></div></div>');
            infoPane.appendTo('body');

            //数据面板
            this.addDataPane();
            var dataPaneToggle = $('<div class="dataPaneToggle">数据面板</div>');
            //给数据面板开关绑定事件
            dataPaneToggle.on('click', function (e) {
                $('#dataPane').slideToggle('slow');
            });
            dataPaneToggle.appendTo('body');

            //给所有交通方式选项卡绑定查询事件
            var transBtn = $('.infoPane_main_tabControl');
            for(var i = 0; i < transBtn.length; i++) {
                this.transportResult(infoPane, map, $(transBtn[i]).attr('id'));
            }
            //绑定清空按钮事件
            this.clear(infoPane, map);
            var searchOriPara = [
                {
                    map : map,
                    inputElementId : 'orgInput' //绑定起点输入框
                },
                {
                    map : map,
                    inputElementId : 'desInput' //绑定终点输入框
                }
            ];
            for(var i = 0; i < searchOriPara.length; i++) {
                new SearchOrientation.SearchOrientation().search(searchOriPara[i]);
            }


        },
        //清空按钮事件
        clear : function (infoPane, map) {
            var clearBtn = infoPane.find('#clear');
            clearBtn.on('click', function (e) {
                if($('#panel')) {
                    $('#panel').remove();
                }
                $('#orgInput')[0].value = '';
                $('#desInput')[0].value = '';
                NaviRepo.clearAllResults();
            });
        },
        //交通方式查询事件绑定与结果面板
        transportResult : function (infoPane, map, naviTypeName) {
            var naviBtn = document.getElementById(naviTypeName);
            naviBtn.addEventListener('click', function (e) {
                if($('#panel')) {
                    $('#panel').remove();
                }
                var orgPoints = MarkerRepo.getPoints({
                        map: map,
                        pointTypeName : 'origin'
                    }),
                    desPoints = MarkerRepo.getPoints({
                        map: map,
                        pointTypeName : 'destination'
                    });
                if(orgPoints.length === 0) {
                    alert('请选择起点');
                }
                else if(orgPoints.length !== 0 && desPoints.length === 0) {
                    alert('请选择终点');
                }
                else if(orgPoints.length > 0 && desPoints.length > 0) {
                    var panel = $('<div class="infoPane_display" id="panel"></div>');
                    panel.appendTo('body');
                    var navigation = new navi.Navigation();
                    navigation.selection({
                        naviTypeName : naviTypeName,
                        origin : orgPoints[0],
                        map : map,
                        destination : desPoints[0],
                        waypoint : null,
                        panel : "panel"
                    });
                }
            });
        },
        //添加数据面板方法
        addDataPane : function (para) {
            var PARA = $.extend(this.para, para);
            var map = PARA.map;
            //数据面板
            // 默认状态下位置数据选项卡处于激活状态
            var dataPane = $('<div class="dataPane_main" id="dataPane"><div class="dataPane_main_Tab Tab_active" id="pointTab">位置数据</div><div class="dataPane_main_Tab Tab_inactive" id="rasterTab">栅格数据</div><div class="dataPane_main_List" class="dataPane_main_content" id="dataList"></div></div>');
            dataPane.appendTo('body');
            dataPane.hide();    // 初始状态下是隐藏的
            
            // 默认状态下数据面板显示位置内容
            var pointContent = $('<div class="dataPane_main_content" id="dataList"><button class="addDataBtn">添加位置点</button></div>');
            pointContent.appendTo($('#dataList'));

            // 给位置数据选项卡绑定点击事件
            $('#pointTab').on('click', function (e) {
                //切换数据类型选项卡激活状态
                $('#pointTab').removeClass('Tab_inactive').addClass('Tab_active');
                $('#rasterTab').removeClass('Tab_active').addClass('Tab_inactive');
                //清除内容区所有内容
                $('#dataList').remove();
                //添加内容区数据列表与添加数据按钮
                var pointContent = $('<div class="dataPane_main_content" id="dataList"><button class="addDataBtn" id="addPointMarkerBtn">添加位置点</button></div>');
                pointContent.appendTo($('#dataPane'));

            });

            // 给栅格数据选项卡绑定点击事件
            $('#rasterTab').on('click', function (e) {
                $('#rasterTab').removeClass('Tab_inactive').addClass('Tab_active');
                $('#pointTab').removeClass('Tab_active').addClass('Tab_inactive');
                $('#dataList').remove();
                var rasterContent = $('<div class="dataPane_main_content" id="dataList"><button class="addDataBtn"  id="addRasterBtn">添加栅格</button></div>');
                rasterContent.appendTo($('#dataPane'));

                //绑定添加栅格数据按钮操作
                var addRasterBtn = $('#addRasterBtn');
                addRasterBtn.on('click', function (e) {

                });
                new InfoPane().initRasterDataPane(PARA);
            });
        },
        //初始化栅格数据面板
        initRasterDataPane : function (infoPanePara) {
            var initRasterDataPane = $('<div class="dataPane_initRasterData" id="initRasterDataPane"><form id="fileUpload-form" action=""><label for="NELocation">请输入东北角坐标</label><input type="text" name="NELocation" placeholder="东北角经度" id="NELng"><input type="text" name="NELocation" placeholder="东北角纬度" id="NELat"><br><label for="NELocation">请输入西南角坐标</label><input type="text" name="NELocation" placeholder="西南角经度" id="SWLng"><input type="text" name="NELocation" placeholder="西南角纬度" id="SWLat"><br><a class="initRasterData_upload"><input id="fileUpLoad" type="file" name="file">选择栅格数据</a><br><input type="submit"></form></div>');
            var addRasterBtn = $('#addRasterBtn');
            initRasterDataPane.appendTo('body');
            initRasterDataPane.hide();
            // 给添加栅格按钮绑定初始化栅格数据面板的显示事件
            addRasterBtn.on('click', function (e) {
                $('#initRasterDataPane').toggle('slow');
            });

            // 绑定选择栅格数据按钮事件
            var fileInput = document.getElementById('fileUpLoad');
            if(typeof FileReader === 'undefined') {
                alert('您的浏览器不支持实时添加图片');
            } else {
                fileInput.addEventListener('change', readFile, false);
            }
            
            function readFile() {
                // 之后需要写一个ajax请求，将图片先发送到服务器，然后从服务器获取图片在服务器中的url，再放入rasterDataPara中加载
                var SWLat = $('#SWLat').val(),
                    SWLng = $('#SWLng').val(),
                    NELat = $('#NELat').val(),
                    NELng = $('#NELng').val();
                console.log(SWLat);
                //正确的做法应该是使用正则
                if( SWLat === '' || SWLng === '' || NELat === '' || NELng === '') {
                    alert('请输入完整的位置信息!');
                } else {
                    // 生成一个栅格数据需要的参数
                    var rasterDataPara = {
                        url : 'http://localhost:63342/BMap/testImg/event1.png', //之后将通过ajax从服务器获取URL
                        map : infoPanePara.map,
                        NELng : parseFloat(NELng),  //118.809565
                        NELat : parseFloat(NELat), //32.048672
                        SWLng : parseFloat(SWLng),  //118.78
                        SWLat : parseFloat(SWLat)  //32.06789
                    };
                    console.log(rasterDataPara);
                    var rasterData = new raster.Raster().createRaster(rasterDataPara);
                    var fileList = this.files;
                    console.log(fileList[0]);
                }
            }
        },
        //ajax提交文件方法
        ajaxSubmit : function () {

        }
    };
    return {
        InfoPane : InfoPane
    };
});