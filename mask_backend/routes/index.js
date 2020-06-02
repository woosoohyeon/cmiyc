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
    console.log(lat);
    console.log(lng);
    connection.query("SELECT * FROM pharm WHERE lat = ? and lng = ?",[Number(lat), Number(lng)], function (err, result, fields){
      res.send(result);
      if (err) throw err;
      console.log(result);
    });
  });


  
});



module.exports = router;
