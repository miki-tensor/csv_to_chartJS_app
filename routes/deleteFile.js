var express = require('express');
var router = express.Router();
const fs = require('fs');
var formidable = require('formidable');

// GET
router.get('/', function(req, res, next) {
  fs.readdir('public/files', function(err, files){
    if (err) throw err;
    var data = {
      title: 'deleteFile',
      fileList: files,
      hidden: true,
      end: false
    }
    res.header('Access-Control-Allow-Origin','*');
    res.render('deleteFile',data);
  });
});

// POST
router.post('/', function(req, res, next) {
  var filePath = 'public/files/' + req.body.filename; // csvファイルのパスを指定
  //ファイル名未指定の場合のエラー処理
  fs.readdir('public/files', function(err, files){
    if(req.body.filename == "ファイルを選択してください" || req.body.filename == "" || req.body.filename == "undefined" ){
      var data = {
        title: 'deleteFile',
        fileList: files,
        hidden: false,
        end: false
      }
      res.render('deleteFile',data);
    }
  });

  fs.unlink(filePath,(err) => {
    if (err){ 
      //ファイル名未指定の場合のエラー処理
      fs.readdir('public/files', function(err, files){
        if(req.body.filename == "ファイルを選択してください" || req.body.filename == "" || req.body.filename == "undefined" ){
          var data = {
            title: 'deleteFile',
            fileList: files,
            hidden: true,
            end: false
          }
          res.render('deleteFile',data);
        }
      });
    }
    console.log(req.body.filename + "を消去しました。");
    fs.readdir('public/files', function(err, files){
      if (err) throw err;
      var data ={
        title: 'deleteFile',
        fileList: files,
        msg: req.body.filename + "を消去しました",
        hidden: false,
        end: true
      };
      res.render('deleteFile', data);
    });
  });
});
module.exports = router;
