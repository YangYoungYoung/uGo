// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    // canIUse: wx.canIUse('button.open-type.getUserInfo')\
    phone:'',
    password:''
  },
  onLoad: function() {
    let that = this;

  },
  //获取手机号
  phoneInput: function(e) {
    console.log('phone is:',e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },
  //获取密码
  passwordInput: function(e) {
    console.log('password is:', e.detail.value);
    this.setData({
      password: e.detail.value
    })
  },

  //用户登录
  userLogin: function() {
    let that = this;
    // let openId = that.data.openId;
    let mobile = that.data.phone;
    let password = that.data.password;
    // let wxUnionid = taht.data.wxUnionid;
    let wxUnionid = wx.getStorageSync('unionId');
    console.log('wxUnionid is:', wxUnionid);

    let url = "login";
    var params = {
      mobile: mobile,
      password: password,
      wxUnionid: wxUnionid
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          let userId = res.data.data.user.userId;
          // console.log('userId is:', userId);
          wx.setStorageSync('userId', userId);
          common.showTip(res.data.msg);
          wx.redirectTo({
            url: '../home/home',
          })
        } else {
          common.showTip(msg, 'loading');
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1000,
        })
      });
  },
  //到注册页面
  toRegister:function(){
      wx.redirectTo({
        url: '../register/register',
      })
  },
  //跳转到找回密码页面
  toGetPwd:function(){
    
  }
})