var version ="V0.1";

var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 5000

var url;
var response;
var inputParam;

var whiteList=[
  "GAg9Zs9XUPY6yts83RvjV9w6VKt1", //aaa
  "FzE2XLA5fGY9gvEZfbyKEkFEnLt1", //curves
];

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
    console.log("Error: No API nor Access Specified");
    response.send("Error: No API nor Access Specified");
    return 0;
  } 
  
  // 若非 WhiteList access，無效退出
  var accessInWhiteList = false;
  for (var i=0; i< whiteList.length; i++) {
      //console.log(inputParam.Access,i,whiteList[i]);    
    if (inputParam.Access == whiteList[i]) {
      accessInWhiteList = true;
      break;
    }     
  }
  
  console.log("access", accessInWhiteList);
  // 處理 API
  //   API:00 ECHO 讓 ping process 來 keep alive
  //   API:01 讀取訂單
  //   API:10 更新訂單
  switch(inputParam.API) {
    case "00":
      console.log("呼叫 API:00 ECHO");
      response.send("ECHO");
      break;      
    case "01":
      console.log("呼叫 API:01 讀取訂單", inputParam.Order_NO);
      if (accessInWhiteList==false){
        console.log("Error: No access");
        response.send("Error: No access");
        return 0;
      } else {  
        getCurvesOrder();
        break;
      }
    case "10":
      console.log("呼叫 API:更新訂單", inputParam.Update_Order);
      if (accessInWhiteList==false){
        console.log("Error: No access");
        response.send("Error: No access");
        return 0;
      } else {  
        putCurvesOrder();
        break;
      }      
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

function putCurvesOrder() {
  // 檢查 Order_NO
  //console.log(inputParam);
  if (inputParam.Update_Order == undefined) {
    console.error('API:10 error:', "未指定 Update_Order"); 
    response.send('API:10 未指定 Update_Order');
    return 1;
  }
  
  url = "http://garytest123.azurewebsites.net/api/HC_Order_Main_Update?Code=debug123";  

  //console.log(inputParam.Update_Order);
  var requestData = JSON.parse(inputParam.Update_Order);

  //console.log(requestData);
  
  // fire request
  request({
    url: url,
    method: "PUT",
    json: requestData
  }, function (error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log(body);
      response.send("API:10 取得"+JSON.stringify(body));
    } else {
      console.log("error: " + error)
      console.log("res.statusCode: " + response.statusCode)
      console.log("res.statusText: " + response.statusText)
      response.send("API:10 失敗"+JSON.stringify(body));
    }
  }) 
  
}