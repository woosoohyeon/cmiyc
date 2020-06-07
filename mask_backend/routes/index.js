var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "donghyeon.synology.me",
    port: 3307,
    user : "maskteam",
    password : "aktmzmxla1Q!",
    database : "mask"
  })
  connection.connect(function(err){
    if (err) throw err;
    connection.query("SELECT * FROM pharm WHERE name='수약국'", function (err, result, fields){
      res.send(result)
      if (err) throw err;
      console.log(result);
    });
  });
});

router.post('/api/loadPharm', function(req, res, next) {
  var lat = req.body.lat;
  var lng = req.body.lng;

  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "donghyeon.synology.me",
    port: 3307,
    user : "maskteam",
    password : "aktmzmxla1Q!",
    database : "mask"
  })
  connection.connect(function(err){
    if (err) throw err;
    //console.log(lat);
    //console.log(lng);
    connection.query("SELECT * FROM pharm WHERE lat = ? and lng = ?",[Number(lat), Number(lng)], function (err, result, fields){
      res.send(result);
      if (err) throw err;
      console.log(result);
    });
  });
});

router.post('/api/getWareById/', function(req, res, next) {
  var id = req.body.id;

  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "donghyeon.synology.me",
    port: 3307,
    user : "maskteam",
    password : "aktmzmxla1Q!",
    database : "mask"
  })
  connection.connect(function(err){
    if (err) throw err;

    connection.query("SELECT * FROM ware_predict_time WHERE id = ?",id, function (err, result, fields){
      res.send(result);
      if (err) throw err;
      console.log(result);
    });
  });
});


router.post('/api/getSoldoutById/', function(req, res, next) {
  var id = req.body.id;

  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "donghyeon.synology.me",
    port: 3307,
    user : "maskteam",
    password : "aktmzmxla1Q!",
    database : "mask"
  })
  connection.connect(function(err){
    if (err) throw err;

    connection.query("SELECT * FROM soldout_predict_time WHERE id = ?",id, function (err, result, fields){
      res.send(result);
      if (err) throw err;
      console.log(result);
    });
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
  console.log(lat);

  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : "donghyeon.synology.me",
    port: 3307,
    user : "maskteam",
    password : "aktmzmxla1Q!",
    database : "mask"
  })
  connection.connect(function(err){
    if (err) throw err;
    //console.log(lat);
    //console.log(lng);
    //console.log(Number(lng-1));
    connection.query("SELECT * FROM pharm WHERE (lng BETWEEN ? AND ?) AND (lat BETWEEN ? AND ?) ",[Number(lng-0.04), Number(lng+0.04),Number(lat-0.05), Number(lat+0.05) ], function (err, result, fields){
      res.send(result);
      if (err) throw err;
      //console.log(result);
    });
  });
});



module.exports = router;
