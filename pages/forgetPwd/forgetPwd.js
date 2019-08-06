// pages/forgetPwd/forgetPwd.js
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
    confirmPwd: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  //确认密码
  confirmPwd: function(e) {
    let confirmPwd = e.detail.value;
    console.log('confirmPwd is:', confirmPwd);
    this.setData({
      confirmPwd: confirmPwd
    })
  },

  //修改密码
  changePwd: function() {
    let that = this;

    let mobile = that.data.mobile;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    //密码
    let password = that.data.pwd;
    if (password == undefined || password.length == 0 || password == '') {
      common.showTip("请输入密码", "loading");
      return;
    }
    //确认密码
    let confirmPwd = that.data.confirmPwd;
    if (confirmPwd == undefined || confirmPwd.length == 0 || confirmPwd == '') {
      common.showTip("请确认密码", "loading");
      return;
    }
    //验证码
    let code = that.data.code;
    if (code == undefined || code.length == 0 || code == '') {
      common.showTip("请输入验证码", "loading");
      return;
    }
    let url = "updatePassWord"
    // ? mobile = + mobile + "&type=2";
    let method = "PUT";
    var params = {
      password: password, //密码
      captcha: code, //验证码
      confirmPwd: confirmPwd, //确认密码
      mobile: mobile, //手机号

    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互

        if (res.data.code == 200) {
          common.showTip('修改成功', success);
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
})