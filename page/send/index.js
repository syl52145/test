// page/send/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open : false,
    mark: 0,
    windowWidth:  wx.getSystemInfoSync().windowWidth,
    jList:null,
    sList:null,
    weight:'',
    price:'',
    number:'',
    remark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jList = app.globalData.jList;
    //ji_address = jList.city+'，' + jList.region+ '，'+jList.jList.address
    //ji_phone = jList.jList.phone

    //shou_address = sL
    var sList = app.globalData.sList;
    console.log(jList);
    console.log(sList);
    this.setData({
      jList:jList,
      sList:sList
    })
  },
  tap_ch: function(){ //点击事件
    if(this.data.open){
      this.setData({
          translate: 'width:'+this.data.windowWidth*0.75+'px;transform: translateX(-'+this.data.windowWidth*0.75+'px)',
          open:false
      })
    }else{
      this.setData({
          translate: 'width:'+this.data.windowWidth*0.75+'px;transform: translateX(0px)',
          open:true
      })
    }
  },
  reviseData: function(e){
    var type = e.currentTarget.dataset.type;
    if(type == 'jijian'){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateBack({
        delta: 2
      })
    }
  },
  inputWeight:function(e){
    console.log( e.detail.value);
     var re = /^[0-9]+.?[0-9]*$/;
    if(re.test(e.detail.value)){
      console.log(333333)
    }else{
      wx.showToast({
        title: '请输入正确的重量',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      weight:e.detail.value
    })
  },
  inputNumber: function(e){
   
    console.log( e.detail.value);
   
    this.setData({
      number:e.detail.value
    });
  },
  inputRemark: function(e){
    console.log( e.detail.value)
  }
})