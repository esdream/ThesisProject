/**
 * Created by Faizal on 2016/5/8.
 */
/**
 * 导航结果仓库模块 
 */
define(['jquery'], function ($) {
    var NaviRepo = function () {
       this.para = {
           map : null,
           naviObject : null,
           naviName : null
       };
    };
    //导航仓库
    NaviRepo.prototype.naviResultRepo = {
        navi : []
    };
    NaviRepo.addNaviResult = function (para) {
        var PARA = $.extend(this.para, para);
        var naviRepo = NaviRepo.prototype.naviResultRepo,
            naviObject = PARA.naviObject,
            map = PARA.map;
        if (naviRepo.navi.length === 0) {
            naviRepo.navi.push(naviObject);
        }
        else {
            naviRepo.navi.shift().clearResults();
            naviRepo.navi.push(naviObject);
        }
        console.log(naviRepo);
    };
    NaviRepo.clearAllResults = function () {
        var naviRepo = NaviRepo.prototype.naviResultRepo;
        naviRepo.navi.shift().clearResults();
        console.log(naviRepo);
    };
    return NaviRepo;
});