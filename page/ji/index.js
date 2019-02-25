// page/ji/index.js
const app = getApp()
const api = require('../../utils/util.js');
Page({
  data:{
    open : false, 
    mark: 0,
    translate: '',//位移css
    isOk : false,
    showClear:false,
    login:false,
    gotop:{//样式绑定
      name:'',
      phone:'',
      gs:'',
      address:''
    },
    sList:{},
    jList:{
      name:'',
      phone:'',
      address:''
    },
    hList:[
      // {
      //   name:'王小明',
      //   phone:'15812892594',
      //   address:'hi安徽噶几和公安化工',
      //   gs:'公司名'
      // },
      // {name:'王小明',
      // phone:'15812892594',
      // address:'hi安徽噶几和公安化工',
      // gs:'公司名'}
    ],
    hPic:null,//历史记录小图片下标
    sCityList:[],//城市总数组
    multiIndex:[0,0],
    multiArray:[],
    jjrId:''//派送人id
    
  },
  onLoad: function () {
    var sList = app.globalData.sList;
    this.setData({
      sList:sList
    });
    this.jList();
    this.getHistory();
    this.getCityList();

  },
  getHistory: function(){
    var data = {
       openid:app.globalData.openId
      //openid:'ovnr15Xum3N7n6Xno-ixGTyddUns'
    }
    api.get('/api/sender_history',data).then(res=>{
      console.log(res);
      if(res.status==200){
        var data = res.code;
        for(var i=0;i<data.length;i++){
          var citys = data[i].address.split('，');
          data[i].name = data[i].jijian_name;
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
  jList: function(){
    var jList = app.globalData.jList;
    console.log(jList);
    if(!jList){
      return;
    }
    this.setData({
      jList:jList.jList,
      city:jList.city,
      region:jList.region,
      jjrId:jList.jjrId,
      sIndex:jList.sIndex
    })
    if(jList.jList.name){
      this.setData({
        ['gotop.name']:'top:0px;'
      })
    }
    if(jList.jList.phone){
      this.setData({
        ['gotop.phone']:'top:0px;'
      })
    }
    if(jList.jList.address){
      this.setData({
        ['gotop.address']:'top:0px;'
      })
    }
    this.showClear();
    this.isok();
  },
  goBottom: function(e){
    var mark = e.currentTarget.dataset.name;
    //console.log(mark)
    var tap = 'gotop.'+mark;
    this.isok();
    this.showClear();
    var list = this.data.jList;
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
    var tap = 'jList.'+mark;
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
      jList:data,
      city:data.city,
      region:data.region,
      jjrId: data.courier_id,
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
    var jList = this.data.jList;
    if(jList.name && jList.phone && jList.address){
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
    var jList = this.data.jList; 
    if(jList.name || jList.phone || jList.address){
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
    var jList = this.data.jList;
    for(var key in jList){
      var tap = 'jList.'+key;
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
    app.globalData.jList = this.data;
    wx.navigateTo({
      url:'../send/index'
    })
  },
  goBack: function(){
    app.globalData.jList = this.data.jList;
    wx.navigateBack({
      delta: 1
    })
  },
  getCityList:function(){
    api.get('/api/get_address').then((res)=>{
      //console.log(res);
      var sCityList = res.code.objectMultiArray,multiArray = [res.code.multiArray,[]],jjrList=[];
      sCityList.forEach((val)=>{
        //console.log(val)
        if(val.parid==1){
          multiArray[1].push(val.regname);
          jjrList.push(val.courier_id);
        } 
      })
      this.setData({
        sCityList:sCityList,
        multiArray:multiArray,
        jjrList:jjrList
      })
        // for(var i=0;i<data.length;i++){
        //   data[i].name = data[i].shoujian_name;
        // }
        // this.setData({
        //   hList:data
        // })
      
    })
  },
  bindPicker: function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var multiIndex = this.data.multiIndex;
    var multiArray = this.data.multiArray;
    var jjrList = this.data.jjrList;
    if(multiIndex[0]==0 && multiIndex[1]==0){
      var city = multiArray[0][0];
      var region = multiArray[1][0];
      var jjrId =jjrList[0];
      this.setData({
        city:city,
        region:region,
        jjrId:jjrId
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
      jjrId: this.data.jjrId,
      city:this.data.city,
      region:this.data.region
    };
    var sCityList = this.data.sCityList;
    data.multiIndex[e.detail.column] = e.detail.value;
    var jjrList=[]
    switch (e.detail.column) {
      case 0:
            if(e.detail.value==0){
              data.multiArray[1]=[];
              sCityList.forEach((val)=>{
                //console.log(val)
                if(val.parid==1){
                  data.multiArray[1].push(val.regname);
                  jjrList.push(val.courier_id);
                }
              })          
            }else if(e.detail.value==1){
              data.multiArray[1]=[];
              sCityList.forEach((val)=>{
                //console.log(val)
                if(val.parid==4){
                  data.multiArray[1].push(val.regname);
                  jjrList.push(val.courier_id);
                }
              })
                         
            }   
            data.jjrId = jjrList[0];
            data.multiIndex[1] = 0;
            data.city = data.multiArray[0][e.detail.value]
            data.region = data.multiArray[1][0]
            this.setData({jjrList:jjrList});
            break;
      case 1:
            var jjrList = this.data.jjrList; 
            for(var i=0;i<data.multiArray[1].length;i++){
              if(e.detail.value == i){
                data.jjrId = jjrList[i];
                data.region = data.multiArray[1][i]
              }
            }
            break;
      default:
          var jjrList = this.data.jjrList; 
          data.multiIndex[1] = 0;
          data.jjrId = jjrList[0]
          data.region = data.multiArray[1][0]
    }  
    this.setData(data)
  }
})