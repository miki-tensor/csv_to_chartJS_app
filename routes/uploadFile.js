var express = require('express');
var router = express.Router();
var formidable = require('formidable');

// GET
router.get('/', function(req, res, next) {
  var data ={
    title: 'uploadFile',
    hidden: true,
    end: false
  };
  res.render('uploadFile', data);
});

// POST
router.post('/', function(req, res, next) {
    var incomming = new formidable.IncomingForm();
    //incomming.uploadDir = 'public/files';
    incomming.on('fileBegin', function(field, file){
      if (file.name) {
        file.path = "public/files/" + file.name;
      }
    }).on('file', function(feild, file) {
      if (!file.size){
        var data ={
            title: 'uploadFile',
            hidden: false,
            end: false
        };
          res.render('uploadFile', data);
          return
      }
    }).on('end', function(){
        var data ={
            title: 'uploadFile',
            hidden: true,
            end: true,
        };
        res.render('uploadFile', data);
    });
    incomming.parse(req);
});

module.exports = router;
