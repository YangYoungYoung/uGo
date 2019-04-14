// pages/setPassword/setPassword.js
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

  firstInput: function(e) {
    let firstPwd = e.detail.value;
    this.setData({
      firstPwd: firstPwd
    })

  },
  checkInput: function(e) {
    let checkPwd = e.detail.value;
    this.setData({
      checkPwd: checkPwd
    })
  },
  submit: function() {
    let that = this;
    let firstPwd = that.data.firstPwd;
    let checkPwd = that.data.checkPwd;
    let userId = wx.getStorageSync('userId');
    console.log('firstPwd is:', firstPwd);
    if (firstPwd ==undefined||firstPwd.length != 6) {
      common.showTip('密码长度需为6位', 'success');
      return;
    }
    if (checkPwd ==undefined||checkPwd.length != 6) {
      common.showTip('密码长度需为6位', 'success');
      return;
    }
    if (checkPwd != firstPwd) {
      common.showTip('两次密码不一致', 'success');
      return;
    }
    let url = "updateIntegralPassword?userId=" + userId + "&integralPassword=" + checkPwd
    var params = {}
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("积分设置返回值是：" + res.data);
        that.userLogin();

      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //用户登录
  userLogin: function() {
    let that = this;
    let openId = wx.getStorageSync('openId');

    let url = "login?openid=" + openId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
          let userId = res.data.data.user.userId;
          console.log('userId is:', userId);
          wx.setStorageSync('userId', userId);
          common.showTip(res.data.msg);
          wx.redirectTo({
            url: '../home/home',
          })
        } else {
          common.showTip(res.data.msg, 'loading');
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }
})