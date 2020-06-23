var express = require('express');
var router = express.Router();
var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "donghyeon.synology.me",
    port: 3307,
    user : "maskteam",
    password : "aktmzmxla1Q!",
    database : "mask"
});
connection.connect();

router.post('/api/loadPharm/', function(req, res, next) {
  var id = req.body.id;
  var day = req.body.day;
  connection.query("SELECT * FROM pharm LEFT JOIN "+day+" ON pharm.id = "+day+".id WHERE pharm.id = ?",id, function (err, result, fields){
    res.send(result);
    console.log(result)
    if (err) throw err;
  });
});


/**
 * 06 06
 * json 에서 약국 데이터를 가져오던 기존 방식에서
 * db에 존재하는 약국 데이터를 로드.
 * (db와 json에 있는 데이터가 일치 해서 더 성능이 좋은 db에서 가져오는게 좋음)
 * 
 * db에서 쿼리문을 통해 위동 경도가 중심 마커 기준 위도 경도 0.04 범위 안에 존재하는 약국만 로드
 * 
 * 
*/
router.post('/api/getPharmByGPS/', function(req, res, next) {
  var lat = req.body.lat;
  var lng = req.body.lng;
  var day = req.body.day;
  
  connection.query("SELECT * FROM pharm LEFT JOIN "+day+" ON pharm.id = "+day+".id WHERE (lng BETWEEN ? AND ?) AND (lat BETWEEN ? AND ?) ",[Number(lng-0.04), Number(lng+0.04),Number(lat-0.05), Number(lat+0.05) ], function (err, result, fields){
    res.send(result);
    console.log(result.length)
    if (err) throw err;
    //console.log(result);
  });
});

module.exports = router;
