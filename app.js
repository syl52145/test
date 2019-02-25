//app.js
const api = require('/utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    api.sync(wx.login)()
    .then(
      res=>{
        this.globalData.code = res.code;
        console.log(res.code);
      }
    )
      
    
    // wx.login({
    //   success: res => {
    //     this.globalData.code = res.code
    //   }
    // })
    // this.login();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  login:function(callBack){
    if(this.globalData.openId){
      if(callBack){
        typeof callBack == 'function' && callBack();
      }
    }else{
      wx.showLoading({
        title: '页面加载中',
      })
      setTimeout(function(){
        wx.hideLoading()
      },1000)
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          //console.log(res.code+'11111111111111');
          if(callBack){
            typeof callBack == 'function' && callBack(res.code);
          }
          
        }
      })
    }
  },
  globalData: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    code:'',
    userInfo: null,
    openId:null,
    jList:null,
    sList:null
  }
})