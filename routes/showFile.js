var express = require('express');
var router = express.Router();
const fs = require('fs');
var csv = require('ya-csv');

// GET
router.get('/', function(req, res, next) {
  fs.readdir('public/files', function(err, files){
    if (err) throw err;
    var data = {
      title: 'showFile',
      fileList: files,
      hidden: true,
    }
    res.header('Access-Control-Allow-Origin','*');
    res.render('showFile',data);
  });
});

// POST
router.post('/', function(req, res, next) {
  var filePath = 'public/files/' + req.body.filename; // csvファイルのパスを指定
  var readerCsv = csv.createCsvFileReader(filePath); // ya-csvでcsvを取り込むためのリーダオブジェクト
  var loadCsvData = []; // 読み込んだcsvファイルのオブジェクトを格納するための変数
  var sendCsvData = []; // クライアントへ送信を考慮して整形csvデータを格納するための変数
  var sendHorizontalAxis = {}; // chart.js グラフ横軸用データを格納するための変数

  //ファイル名未指定の場合のエラー処理
  if(req.body.filename === "ファイルを選択してください" || req.body.filename === "" || req.body.filename=== "undefined" ){
    var data ={
      message: "エラーが発生しました",
      error:{status:"500",stack:"ファイルを選択してください"}
    };
    res.header('Access-Control-Allow-Origin','*');
    res.render('error',data);
    return
  }

  // csvファイルの呼び出し & クライアントへデータを送信
  readerCsv.on('data', function(data) {
    loadCsvData.push(data);
  }).on('end', function() {
    var labelLists = loadCsvData[0];
    var json_obj = {}; //　整形データ一時格納用の変数
    for(i in labelLists){
      if(i === "0"){
        sendHorizontalAxis = rowDataInArray(loadCsvData,i); //csvファイル1列目のみ抽出
      }else{
        json_obj[labelLists[i]] = rowDataInArray(loadCsvData,i);
        sendCsvData.push(json_obj); // [{label1:[data11]},{label2:[data2]}]の形式で格納
      }
    }
    var data = {
      horizontalAxis: sendHorizontalAxis, // chart.js グラフ横軸用データ
      csvData: sendCsvData,　// chart.js 描画用のデータ
    };
    res.header('Access-Control-Allow-Origin','*');
    res.send(data);　// クライアントへデータを送信
    res.end();
  });
});

// 配列から特定の列を抽出する関数　※先頭行はデータのラベルと想定し、返り値からは排除
function rowDataInArray (array, row_num) {
  var data =[];
  for (var i in array){
  data[i-1] = array[i][row_num];
  }
  return data
}

module.exports = router;
