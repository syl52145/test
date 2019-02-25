//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        isChecked:false,
        gotop:{
            uname:'',
            upwd:''
        },
        user:{
            uname:'',
            upwd:''
        }

    },

    onLoad: function() {
        if('111'){
            // wx.reLaunch({
            //     url: '/page/admin/index'
            //   })
        }
    },
    goTop: function(e){
        var tap = e.currentTarget.dataset.name;
        tap = 'gotop.'+tap;
        this.setData({
            [tap]: 'top:0;'
        })
    },
    goBottom: function(e){
        var type = e.currentTarget.dataset.name;
        var tap = 'gotop.'+type;
        var user = this.data.user;
        for(var key in user){
            if(key==type && !user[key]){
                this.setData({
                    [tap]: ''
                })
            }
        }
        
    },
    inputData: function(e){
        var value = e.detail.value;
        var tap = e.currentTarget.dataset.name;
        var tap1 = 'user.'+tap;
        var tap2 = 'gotop.'+tap;
        this.setData({
            [tap1]:value
        });
        if(!value){
            this.setData({
                [tap2]: ''
            })
        }
    },
    checkboxChange: function(e){
        if(!this.data.isChecked){
            this.setData({
                isChecked:true
            })
        }else{
            this.setData({
                isChecked:false
            })
        }
    }
})