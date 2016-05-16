var fs = require('fs'),
    PNG = require('pngjs').PNG;

fs.createReadStream('C:/Users/Faizal/Desktop/findPath/image/NJUXianLin.png').pipe(new PNG({
    filterType : 4
}))
.on('parsed', function(){
    var height = this.height,
        width = this.width;
    var Img = new Array(height);
    for(var y = 0; y < height; y++) {
        Img[y] = new Array(width);
        for(var x = 0; x < width; x++) {
            var idx = (width * y + x) << 2;
            if(this.data[idx] > 0) {
                Img[y][x] = 1;
            }
            else {
                Img[y][x] = 0;
            }
        }
    }
    /**
    * 此时图像二维数组Img已经获取成功！
    */
    for(var y = 0; y < height; y++) {
        console.log(Img[y]);
    }
});
