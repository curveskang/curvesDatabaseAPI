var version ="V0.9";

var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 5000

var url;
var response;
var inputParam;

var testerList=[
  "GAg9Zs9XUPY6yts83RvjV9w6VKt1", //aaa
];

var adminsList=[
  "FzE2XLA5fGY9gvEZfbyKEkFEnLt1", //curves
];

console.log("Version:", version);

var usingTestDatabase = false;
var accessInTesterList = false;
var accessInAdminsList = false;

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

  // 檢查 UID 是否是 tester 
  accessInTesterList = false;
  for (var i=0; i< testerList.length; i++) {
      //console.log(inputParam.Access,i,testerList[i]);    
    if (inputParam.UID == testerList[i]) {
      accessInTesterList = true;
      break;
    }     
  }
  
  // 檢查 UID 是否是 admin
  accessInAdminsList = false;
  for (var i=0; i< adminsList.length; i++) {
      //console.log(inputParam.Access,i,adminsList[i]);    
    if (inputParam.UID == adminsList[i]) {
      accessInAdminsList = true;
      break;
    }     
  }  
   
  console.log("test:", accessInTesterList, "admin:", accessInAdminsList);
  // Check if using Test database
  usingTestDatabase = (accessInAdminsList)?false:true;
  console.log("Using test database:", usingTestDatabase);
  
  
  // 若無 API 參數，無效退出
  if (typeof inputParam.API == "undefined") {
    console.log("Error: No API Specified");
    response.send("Error: No API Specified");
    return 0;
  }
  
  console.log("access", accessInTesterList);
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
      if ((accessInTesterList==false) && (accessInAdminsList==false)) {
        console.log("Error: No access");
        response.send("Error: No access");
        return 0;
      } else {  
        getCurvesOrder();
        break;
      }
    case "10":
      console.log("呼叫 API10:更新訂單", inputParam.Update_Order);
      if ((accessInTesterList==false) && (accessInAdminsList==false)) {
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
  var urlCurvesGet = "https://cvoscloud.azurewebsites.net/api/HC_Order_Main?OrderNo="+inputParam.Order_NO+"&Code=debug123&VM=false"; 
  var urlTestGet   = "https://garytest123.azurewebsites.net/api/HC_Order_Main?OrderNo="+inputParam.Order_NO+"&Code=debug123&VM=false"; 
  var urlGet = (usingTestDatabase)?urlTestGet:urlCurvesGet; 
  
  var databaseMessage = (usingTestDatabase)?"GET:使用測試 Database":"GET:使用正式 Database"; 
  console.log(databaseMessage);
  
  request(urlGet, function (error, res, body) {
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
  
  if (usingTestDatabase==false) {
    console.log("正式資料庫寫入尚未開放");
    response.send("正式資料庫寫入尚未開放");
  }
  
  var urlCurvesPut = "尚未開放";
  var urlTestPut   = "http://garytest123.azurewebsites.net/api/HC_Order_Main_Update?Code=debug123";  
  var urlPut = (usingTestDatabase)?urlTestPut:urlCurvesPut; 
  
  var databaseMessage = (usingTestDatabase)?"PUT:使用測試資料庫":"PUT:使用正式資料庫"; 
  console.log(databaseMessage);
  
  //console.log(inputParam.Update_Order);
  var requestData = JSON.parse(inputParam.Update_Order);

  //console.log(requestData);
  
  // fire request
  request({
    url: urlPut,
    method: "PUT",
    json: requestData
  }, function (error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log(body);
      response.send(databaseMessage+"API:10 取得"+JSON.stringify(body));
    } else {
      console.log(error)
//      console.log("res.statusCode: " + response.statusCode)
//      console.log("res.statusText: " + response.statusText)
      response.send(databaseMessage+"API:10 失敗");
    }
  }) 
  
}