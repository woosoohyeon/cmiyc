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
    connection.query("SELECT * FROM pharm", function (err, result, fields){
      res.send(result)
      if (err) throw err;
      console.log(result);
    });
  });
});

module.exports = router;
