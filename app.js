var express = require('express');
var bodyParser = require('body-parser');
app = express();

app.use(express.static(__dirname + '/BMap'));
app.post('/sendPoints', bodyParser(), function (req, res) {
    if(req.body) {
        var Points = req.body;  //body中包含了post请求的请求体
        console.log('org:' + parseInt(Points.orgPoint.pixelX) + ',' + parseInt(Points.orgPoint.pixelY));

        for(var i = 0, len = Points.desPoints.length; i < len; i++) {
            console.log('des:' +parseInt(Points.desPoints[i].pixelX) + ',' + parseInt(Points.desPoints[i].pixelY));
        }
        
        res.send({'status':'ok', 'message':'Data receive succeed!'});
    }
});
app.listen(8080);
console.log('BMap Server started at localhost:8080...');