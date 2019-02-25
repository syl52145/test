// page/admin/index.js
const app = getApp();
const api = require('../../utils/util.js');
Page({
  data:{
    translate:''
  },
  tap_ch: function(){ //点击事件
    if(this.data.open){
      this.setData({
          translate: 'width:'+app.globalData.windowWidth*0.75+'px;transform: translateX(-'+app.globalData.windowWidth*0.75+'px)',
          open:false
      })
    }else{
      this.setData({
          translate: 'width:'+app.globalData.windowWidth*0.75+'px;transform: translateX(0px)',
          open:true
      })
    }
  }
})