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


aaa = '{"id":"550917ec-3067-49b6-b748-c287b2bc1e35","tableType":1,"order_No":"A161000435","previous_Order_No":"A161000037","sold_Franchise_Code":"A161","sold_Franchise_Name":"石牌店","belonging_Franchise_Code":"A161","belonging_Franchise_Name":"石牌店","member_No":"A161002667","member_Name":"游育慎","mobile_No":"0927299862","monthly_Shipment_Date":20,"order_Date":"2019-11-12T00:00:00","firstShippingMonth":"2019-11-01T00:00:00","coach_Name":"Zero","birthday":"1973-05-20T00:00:00","email_Address":"snowarykimo@yahoo.com.tw","receiver_Name":"洪裴璞","receiver_TEL":"0921125713","receiver_Zip_Code":"112","receiver_City":"","receiver_Town":"","receiver_Address":"台北市北投區寶踐街48巷12號4樓11","member_Type":"有效","fourIn1_Number":5,"lemon_Number":0,"matcha_Number":0,"sesame_Number":0,"pumpkinPeanut_Number":0,"tieguanyin_Number":1,"protein_Recurring_Number":2,"protein_Monthly_Charge":2760,"probiotics_Recurring_Number":0,"probiotics_Monthly_Charge":0,"credit_Card":true,"bank_Transfer":false,"credit_Card_No":"4311951805978103","credit_Card_Period":"2024-04-30T00:00:00","as_Member_Data":false,"credit_Card_Relation":"本人","credit_Card_Sign":null,"protein_Bank_Transfer_People":2,"protein_Bank_Transfer_Charge":33120,"probiotics_Bank_Transfer_People":0,"probiotics_Bank_Transfer_Charge":0,"bank_Transfer_Date":"2001-01-01T00:00:00","bank_Transfer_No":"","depositor_Without_Bankbook_Name":"","confirm_Terms":true,"two_Copies_Invoice":true,"e_Invoice_Vehicle_No":"","e_Invoice_Vehicle_Type":"E-mail寄送","three_Copies_Invoice":false,"tax_ID_Number":"","invoice_Title":"","notice_1":false,"notice_2":false,"notice_3":false,"notice_4":false,"notice_5":false,"notice_6":false,"time_FA":false,"time_FWO":false,"time_2W":false,"time_1WM":false,"time_2_3WM":false,"time_Over_3WM":true,"tools_BK":false,"tools_OpenL":false,"tools_ReservedL":false,"tools_PT":false,"tools_DM":false,"tools_None":true,"order_Sign":null,"order_Remark":"","order_Status":"Z","submission_Date":"2019-11-12T13:09:39","approved_Date":"2019-11-13T10:13:39.6043508+08:00","approved":false,"funtion_Code":"","created_Date":"0001-01-01T00:00:00","creator_ID":"","creator_Name":"","出貨時間歷史記錄":["2019-11-20T00:00:00"],"suspend_Protein":false,"suspend_Probiotics":false,"suspend_Reason":"","suspend_Start_Month":"0001-01-01T00:00:00","suspend_End_Month":"0001-01-01T00:00:00","suspend_Confirm_Terms":false,"recovery_Shipment_Month":"0001-01-01T00:00:00","recovery_Shipment_Day":"0001-01-01T00:00:00","cancel_Reason_Protein":"","cancel_Confirm_Terms_Protein":false,"last_Shipment_Date_Protein":"0001-01-01T00:00:00","cancel_Reason_Probiotics":"","cancel_Confirm_Terms_Probiotics":false,"last_Shipment_Date_Probiotics":"0001-01-01T00:00:00","最後刷卡時間":"2019-11-18T00:00:00","single_Delivery_Box":0,"import_Order_No":"","import_Time":"2019-12-03T10:34:33.3987032+08:00","is_Import":false,"import_Ship_History":["2019-11-20T00:00:00"],"protein_Sold_Count":0,"probiotics_Sold_Count":0,"serverUpdateTime":"0001-01-01T00:00:00"}';

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
  //var requestData = JSON.parse(inputParam.Update_Order);
  bbb = inputParam.Update_Order;
  console.log("aaa:", aaa.length, "bbb:", bbb.length);
  
  for (var i=0; i< aaa.length; i++) {
    if (aaa[i]!=bbb[i]) console.log(i," ", aaa[i], ":", bbb[i]);
  }
  var requestData = JSON.parse(bbb);

  //console.log(requestData);

  
  // fire request
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    url: urlPut,
    method: "PUT",    
    json: requestData,
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