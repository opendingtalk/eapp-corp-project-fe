let app = getApp();


//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
let url = "http://127.0.0.1:8080";

Page({
    data:{
        corpId: '',
        authCode:'',
        userId:'',
        userName:'',
        deptId:'',
        hideList: true,
    },
    onReady() {
    // 页面加载
    dd.getAuthCode({
            success:(res)=>{
                this.setData({
                    authCode:res.authCode
                })
                dd.httpRequest({
                    url: url+'/login',
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                        // dd.alert({content: "step2"});
                        console.log('success----',res)
                        let userId = res.data.result.userId;
                        let userName = res.data.result.userName;
                        let deptId = res.data.result.deptId;
                        this.setData({
                            userId:userId,
                            userName:userName,
                            deptId:deptId
                        })
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---",res)
                       dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                    
                });
            },
            fail: (err)=>{
                dd.alert({content: "step3"});
                dd.alert({
                    content: JSON.stringify(err)
                })
            }
        })
    },
    formSubmit: function(e) {
      let that = this;
      let form = e.detail.value;
      console.log('form发生了submit事件，携带数据为：', e.detail.value);
      dd.httpRequest({
                    url: url+'/processinstance/start',
                    method: 'POST',
                    data: JSON.stringify({
                        originatorUserId: that.data.userId,
                        deptId: that.data.deptId,
                        textForms: [
                          {name: "交通工具",value:form.vehicle},
                          {name: "出差事由",value:form.reason}
                        ],
                        pictureForms:[{name:"图片",value:[form.picture]}],
                        detailForms: [
                          {
                            name:"行程明细",
                            textForms:[
                              {name:"开始时间",value:form.begin_time},
                              {name:"结束时间",value:form.finish_time},
                              {name:"出差地点",value:form.detail_address}],
	                          pictureForms:[
                              {name:"图片",value:[form.detail_picture]}]}]
                    }),
                    headers:{'Content-Type': 'application/json'},
                    dataType: 'json',
                    success: (res) => {
                        dd.alert({content: "审批实例id：" + JSON.stringify(res)});
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---",res)
                       dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                    
                });
    },
    onLoad(){

        let _this = this;

        this.setData({
            corpId: app.globalData.corpId
        })
        
        //dd.alert({content: "step1"});
         
        
        
    }
})