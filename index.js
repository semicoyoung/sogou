'use strict';

let co = require('co');
let thunkify = require('thunkify-wrap');
let username = 'xxx'; //你在搜狗投放推广的账号
let password = 'xxx'; //你在搜狗投放推广的账户密码
let token = 'xxx'; //申请的API权限Token
let soap = require('soap');
let url = 'http://api.agent.sogou.com/sem/sms/v1/ReportService?wsdl'; //报表服务的wsdl
let namespace = 'v1';
let xmlns = 'http://api.sogou.com/sem/common/v1';

let delay = function (latency) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return resolve;
    },latency)
  })
};

co(function* () {
  let client = null;
  let result = null;
  try {
    //新建soap客户端
    client = yield thunkify(soap.createClient)(url);

    //添加soapHeader，wsdl的Header参数，通过上面的URL参数，看wsdl文件，可以看到命名空间 namespace 为 v1, xmlns为 http://api.sogou.com/sem/common/v1
    client.addSoapHeader({"AuthHeader": {"username": username, "password": password, "token": token}},'',namespace, xmlns);

    //获取报告ID
    result = yield thunkify(client.ReportService.ReportService.getReportId)({
      reportRequestType: {
        performanceData: ['impression','click','cost'],
        reportType: 5,
        startDate: '2017-01-01T00:00:00.000',
        endDate: '2017-05-10T00:00:00.000Z'
      }
    });
  } catch (error) {
    throw new Error('get report id error: ', error);
  }

  if (!result || !result.length || !result[0].hasOwnProperty('reportId') || !result[2]
    || !result[2].hasOwnProperty('ResHeader') || !result[2].ResHeader.hasOwnProperty('desc') || !result[2].ResHeader.desc !== 'success') {
    throw new Error('get report id error');
  }
  let reportId = result[0].reportId;

  //获取报告状态,1:已完成，0，正在生成中，-1：生成报告异常
  let state = yield thunkify(client.ReportService.ReportService.getReportState)({
    reportId: reportId
  });
  let count = 0;
  //轮询获取报告生成状态
  while(state && state.length && state[0] && state[0].hasOwnProperty('isGenerated') && state[0]['isGenerated'] !==1 ) {
    yield delay(500);
    if (++count <= 100) {
      state = yield thunkify(client.ReportService.ReportService.getReportState)({
        reportId: reportId
      });
    } else {
      throw new Error('get report state error: ', state)
    }
  }
  if (!state || !state.length || !state[0].hasOwnProperty('isGenerated') || !state[2]
    || !state[2].hasOwnProperty('ResHeader') || !state[2].ResHeader.hasOwnProperty('desc') || !state[2].ResHeader.desc !== 'success') {
    throw new Error('get report state error');
  }

  //获取报告下载地址
  let file = yield thunkify(client.ReportService.ReportService.getReportPath)({
    reportId: reportId
  });
  if (!file || !file.length || !file[0].hasOwnProperty('isGenerated') || !file[2]
    || !file[2].hasOwnProperty('ResHeader') || !file[2].ResHeader.hasOwnProperty('desc') || !file[2].ResHeader.desc !== 'success') {
    throw new Error('get report state error');
  }

  return file[0].reportFilePath;
}).then(function(data) {
  console.log('report file path: ', data);
}, function(err) {
  console.log('err: ', err)
})