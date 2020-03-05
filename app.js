var version ="V0.1";

var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 5000

var url;
var response;
var inputParam;

console.log("Version:", version);

// express 設定開始
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});

app.listen(port, function () {
  console.log('App listening on port: ', port);
});

app.get('/', function (req, res) {
  //console.log(req.query);
  inputParam = req.query;
  response = res;

  // 若無 API 參數，無效退出
  if (typeof inputParam.API == "undefined") {
    console.log("Error: No API Specified");
    response.send("Error: No API Specified");
    return 0;
  }    
  
  // 處理 API
  //   API:00 ECHO 讓 ping process 來 keep alive
  switch(inputParam.API) {
    case "00":
      console.log("呼叫 API:00 ECHO");
      response.send("ECHO");
      break;      
    case "01":
      console.log("呼叫 API:00 讀取訂單", inputParam.Order_NO);
      getCurvesOrder();
      break;
    default:
      console.log("呼叫 未知API:"+inputParam.API);
      response.send("呼叫 未知API:"+inputParam.API);
  }

});
// express 設定結束

function getCurvesOrder() {
  // 檢查 Order_NO
  //console.log(inputParam);
  if (inputParam.Order_NO == undefined) {
    console.error('error:', "未指定 Order_NO"); 
    response.send('API:01 未指定 Order_NO');
    return 1;
  }

//  url = "https://cvoscloud.azurewebsites.net/api/HC_Order_Main?OrderNo=A161000436&Code=debug123&VM=false"; 
  url = "https://cvoscloud.azurewebsites.net/api/HC_Order_Main?OrderNo="+inputParam.Order_NO+"&Code=debug123&VM=false"; 

  request(url, function (error, res, body) {
    if (error!=null) {
      console.error('error:', error); 
      response.send('API:01 訂單讀取失敗');
    } else {
      console.log('statusCode:', res && res.statusCode); 
      //console.log('body:', body);
      response.send(JSON.stringify(body));
    }
  }); 
  
}

