var express = require('express');
var bodyParser = require('body-parser');
app = express();

app.use(express.static(__dirname + '/BMap'));
app.post('/sendPoints', bodyParser(), function (req, res) {
    if(req.body) {
        var Points = req.body;  //body中包含了post请求的请求体
        console.log(parseInt(Points.orgPoint.pixelX),parseInt(Points.orgPoint.pixelY));
        



        res.send({'status':'ok', 'message':'Data receive succeed!'});
    }
});
app.listen(8080);
console.log('BMap Server started at localhost:8080...');