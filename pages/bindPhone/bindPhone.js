// pages/bindPhone/bindPhone.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    // console.log('mobile is:', mobile);
    this.setData({
      mobile: mobile
    })
  },
  //获取验证码
  getCode: function(e) {
    let code = e.detail.value;
    // console.log('mobile is:', code);
    this.setData({
      code: code
    })
  },

  //获取验证码
  getVerificationCode: function() {
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
      type:2
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
  //提交
  submit: function() {

  },
  //绑定手机号
  bindingMobile: function() {
    let that = this;
    let userId = wx.getStorageSync("userId");
    if (userId == '' || userId == undefined) {
      common.showTip("请先登录", "loading");
      return;
    }
    let mobile = that.data.mobile;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    let url = "bindingMobile?userId=" + userId + "&mobile=" + mobile;
    let method = "GET";
    var params = {

    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互

        if (res.data.code == 200) {
          common.showTip('绑定成功', 'succcess');
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

  //校验验证码
  verify: function() {
    let that = this;

    let mobile = that.data.mobile;
    let code = that.data.code;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    if (code == undefined || code == '') {
      common.showTip("请输入验证码", "loading");
      return;
    }
    let url = "common/verify?captcha=" + code + "&mobile=" + mobile;
    let method = "GET";
    var params = {

    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互

        if (res.data.code == 200) {
          that.bindingMobile();
        }else{
          common.showTip(res.data.msg,'loading');
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