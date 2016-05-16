/**
 * Created by Faizal on 2016/5/6.
 */
/**
 * Raster仓库模块
 * 用来存放所有Raster(栅格数据)
 * 覆盖物仓库模块被声明为静态成员，在使用时不需要初始化，在需要使用模块的define中声明依赖后，通过"RasterRepo.func()"调用
 */
define(['jquery'], function ($) {
    var RasterRepo = function () {
        //仓库模块存储参数在prototype中
        this.prototype.para = {
            rasterData : null
        };
    };
    //栅格仓库
    RasterRepo.prototype.rasterDataRepo = {
        raster : []
    };
    //将栅格数据添加进入栅格仓库
    RasterRepo.addRaster = function (para) {
        var PARA = $.extend(this.para, para),
            rasterRepo = RasterRepo.prototype.rasterDataRepo;
        rasterRepo.raster.push(PARA.rasterData);
        console.log(rasterRepo);
    };
    //从栅格仓库中删除数据
    RasterRepo.deleteRaster = function (para) {
        var PARA = $.extend(this.para, para),
            rasterRepo = RasterRepo.prototype.rasterDataRepo;
        for(var i = 0; i < rasterRepo.raster.length; i++) {
            if(rasterRepo.raster[i] === PARA.rasterData) {
                PARA.map.removeOverlay(rasterRepo.raster[i]);
                rasterRepo.raster.splice(i, 1);
                break;
            }
        }
        console.log(rasterRepo);
    };
    //从仓库中取出数据
    RasterRepo.getRasters = function (rasterTypeName) {
        var rasterRepo = RasterRepo.prototype.rasterDataRepo;
        return rasterRepo[rasterTypeName];
        console.log(rasterRepo[rasterTypeName]);
    };
    return RasterRepo;
});