// page/shou/index.js
const app = getApp();
const api = require('../../utils/util.js');
Page({
  data:{
    isOk : false,
    showClear:false, 
    translate: '',//位移css
    login:false,
    gotop:{//样式绑定
      name:'',
      phone:'',
      address:''
    },
    sList:{//收件人
      name:'',//姓名
      phone:'',//手机
      address:''//详细地址
    },
    sjrId:'',//揽件人id
    city:'',//城市
    region:'',//区域
    hList:[
      // {
      //   name:'王小明',
      //   phone:'15812892594',
      //   address:'hi安徽噶几和公安化工',
      //   gs:'公司名'
      // }
    ],
    hPic:null,//历史记录小图片下标
    sCityList:[],//城市总数组
    multiIndex:[0,0],
    multiArray:[]
    
  },
  onLoad: function(){
    app.login(this.getOpenid);
    this.getCityList();
    //console.log(app.globalData.openId);
    //console.log(111111)
    // this.data.sCityList.forEach((val)=>{
    //   console.log(val)
    // })
    
  },
  getOpenid: function(code){
    if(!code){
      //console.log(111)
      this.getHistory(app.globalData.openId);
    }else{
      api.get('/api/getopenid',{code:code}).then((res)=>{
          //console.log(res);
          if(res.status==200){
            var openId = res.data.openid;
            app.globalData.openId = openId;
            this.getHistory(openId);
          } 
        })
    }
    
  },
  getHistory: function(data){
    api.get('/api/addressee_history',{openid:data}).then((res)=>{
      //console.log(res)
      if(res.status==200){
        var data = res.code;
        for(var i=0;i<data.length;i++){
          var citys = data[i].address.split('，');
          //console.log(citys)
          data[i].name = data[i].shoujian_name;
          data[i].city = citys[0];
          data[i].region = citys[1];
          data[i].address = citys[2];
        }

        this.setData({
          hList:data
        })
      }
    })
  },
  getCityList:function(){
    api.get('/api/get_address').then((res)=>{
      //console.log(res);
      var sCityList = res.code.objectMultiArray,multiArray = [res.code.multiArray,[]],sjrList=[];
      sCityList.forEach((val)=>{
        //console.log(val)
        if(val.parid==1){
          multiArray[1].push(val.regname);
          sjrList.push(val.courier_id);
        }
       
        
      })
      this.setData({
        sCityList:sCityList,
        multiArray:multiArray,
        sjrList:sjrList
      })
        // for(var i=0;i<data.length;i++){
        //   data[i].name = data[i].shoujian_name;
        // }
        // this.setData({
        //   hList:data
        // })
      
    })
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
  },
  goTop: function(e){
    var mark = e.currentTarget.dataset.name;
    //console.log(mark)
    var tap = 'gotop.'+mark;
    this.setData({
      [tap]: 'top:0px;'
    })
  },
  goBottom: function(e){
    var mark = e.currentTarget.dataset.name;
    //console.log(mark)
    var tap = 'gotop.'+mark;
    this.isok();
    this.showClear();
    var list = this.data.sList;
    for(var key in list){
      if(mark == key){
        if(list[key]){
          return;
        }else{
          this.setData({
            [tap]: ''
          })
        }
      }
    }
  
    
  },
  inputData: function(e){
    var mark = e.currentTarget.dataset.name;
    var value = e.detail.value;
    //console.log(mark)
    var tap = 'sList.'+mark;
    this.setData({
      [tap]: value,
      hPic:null
    })
    this.isok();
    this.showClear();
  },
  insertData: function(e){
    var index = e.currentTarget.dataset.index;
    var data = this.data.hList[index];
    //console.log(this.data.hList[index]);
    this.setData({
      sList:data,
      city:data.city,
      region:data.region,
      sjrId: data.courier_id,
      sIndex:true
    })
    var gotop = this.data.gotop;
    for(var key in gotop){
      var tap = 'gotop.'+key;
      //console.log(tap)
      this.setData({
        [tap]: 'top:0px;',
        isOk:true,
        showClear:true,
        hPic:index
      })
    }
  },

  isok: function(){
    var sList = this.data.sList;
    if(sList.name && sList.phone && sList.address){
      this.setData({
        isOk:true
      })
    }else{
      this.setData({
        isOk:false
      })
    }
  },
  showClear:function(){
    var sList = this.data.sList; 
    if(sList.name || sList.phone || sList.address){
      this.setData({
        showClear:true
      })
    }else{
      this.setData({
        showClear:false
      })
    }
  },
  clearData: function(){
    var sList = this.data.sList;
    for(var key in sList){
      var tap = 'sList.'+key;
      this.setData({
        [tap]:''
      })
    }
    var gotop = this.data.gotop;
    for(var key in gotop){
      var tap = 'gotop.'+key;
      this.setData({
        [tap]:''
      })
    }
    this.setData({
      isOk:false,
      hPic:null,
      showClear:false
    })
  },
  goNext:function(){
    app.globalData.sList = this.data;
    wx.navigateTo({
      url:'../ji/index'
    })
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        console.log(111)
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        that.setData({
            login:true
        });
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title: '友情提示',
            content: '寄快递需要微信授权登录!',
            showCancel: false,
            confirmText: '确定',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                }
            }
        });
    }
  },
  bindPicker: function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var multiIndex = this.data.multiIndex;
    var multiArray = this.data.multiArray;
    var sjrList = this.data.sjrList;
    if(multiIndex[0]==0 && multiIndex[1]==0){
      var city = multiArray[0][0];
      var region = multiArray[1][0];
      var sjrId =sjrList[0];
      this.setData({
        city:city,
        region:region,
        sjrId:sjrId
      })
    }
    this.setData({
      sIndex:true
    })

  },
  bindColumnPicker:function(e){
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      sjrId: this.data.sjrId,
      city:this.data.city,
      region:this.data.region
    };
    var sCityList = this.data.sCityList;
    data.multiIndex[e.detail.column] = e.detail.value;
    var sjrList=[]
    switch (e.detail.column) {
      case 0:
            if(e.detail.value==0){
              data.multiArray[1]=[];
              sCityList.forEach((val)=>{
                //console.log(val)
                if(val.parid==1){
                  data.multiArray[1].push(val.regname);
                  sjrList.push(val.courier_id);
                }
              })          
            }else if(e.detail.value==1){
              data.multiArray[1]=[];
              sCityList.forEach((val)=>{
                //console.log(val)
                if(val.parid==4){
                  data.multiArray[1].push(val.regname);
                  sjrList.push(val.courier_id);
                }
              })
                         
            }   
            data.sjrId = sjrList[0];
            data.multiIndex[1] = 0;
            data.city = data.multiArray[0][e.detail.value]
            data.region = data.multiArray[1][0]
            this.setData({sjrList:sjrList});
            break;
      case 1:
            var sjrList = this.data.sjrList; 
            for(var i=0;i<data.multiArray[1].length;i++){
              if(e.detail.value == i){
                data.sjrId = sjrList[i];
                data.region = data.multiArray[1][i]
              }
            }
            break;
      default:
          var sjrList = this.data.sjrList; 
          data.multiIndex[1] = 0;
          data.sjrId = sjrList[0]
          data.region = data.multiArray[1][0]
    }  
    this.setData(data)
  }

})