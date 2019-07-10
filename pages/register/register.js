// pages/register/register.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    code: '',
    pwd: '',
    integralPwd: '',
    confirmPwd: '',
    confirmIntegralPwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //获取手机号
  getMobile: function(e) {
    let mobile = e.detail.value;
    console.log('mobile is:', mobile);
    this.setData({
      mobile: mobile
    })
  },
  //获取验证码
  getCode: function(e) {
    let code = e.detail.value;
    console.log('code is:', code);
    this.setData({
      code: code
    })
  },
  //获取密码
  getPwd: function(e) {
    let pwd = e.detail.value;
    console.log('pwd is:', pwd);
    this.setData({
      pwd: pwd
    })
  },
  //确实密码
  confirmPwd: function(e) {
    let confirmPwd = e.detail.value;
    console.log('confirmPwd is:', confirmPwd);
    this.setData({
      confirmPwd: confirmPwd
    })
  },
  //获取积分支付密码
  getIntegralPwd: function(e) {
    let integralPwd = e.detail.value;
    console.log('integralPwd is:', integralPwd);
    this.setData({
      integralPwd: integralPwd
    })
  },
  //获取积分支付密码
  confirmIntegralPwd: function(e) {
    let confirmIntegralPwd = e.detail.value;
    console.log('confirmIntegralPwd is:', confirmIntegralPwd);
    this.setData({
      confirmIntegralPwd: confirmIntegralPwd
    })
  },
  //发送验证码
  sendCode: function() {
    let that = this;

    let mobile = that.data.mobile;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    let url = "common/smscode"
    // ? mobile = + mobile + "&type=2";
    let method = "GET";
    var params = {
      mobile: mobile,
      type: 1
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互

        if (res.data.code == 200) {
          common.showTip('发送成功', "success");
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //注册的接口
  toRegister: function() {
    let that = this;
    let mobile = that.data.mobile;
    let code = that.data.code;
    let pwd = that.data.pwd;
    let confirmPwd = that.data.confirmPwd;
    let integralPwd = that.data.integralPwd;
    let confirmIntegralPwd = that.data.confirmIntegralPwd;
    if (mobile == '') {
      common.showTip('信息不能为空', 'loading');
      return;
    }
    if (code == '') {
      common.showTip('信息不能为空', 'loading');
      return;
    }
    if (pwd == '') {
      common.showTip('信息不能为空', 'loading');
      return;
    }
    if (confirmPwd == '') {
      common.showTip('信息不能为空', 'loading');
      return;
    }
    if (integralPwd == '') {
      common.showTip('信息不能为空', 'loading');
      return;
    }
    if (confirmIntegralPwd == '') {
      common.showTip('信息不能为空', 'loading');
      return;
    }
    let registerParam = {
      mobile: mobile,
      code: code,
      pwd: pwd,
      confirmPwd: confirmPwd,
      integralPwd: integralPwd,
      confirmIntegralPwd: confirmIntegralPwd

    }
    let url = "register";
    var params = {
      registerParam: registerParam
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
          common.showTip('注册成功','success');
          wx.redirectTo({
            url: '../home/home',
          })
          // that.userLogin();
        } else {
          common.showTip(msg, 'loading');
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }
})