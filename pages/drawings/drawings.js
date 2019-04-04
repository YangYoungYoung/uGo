// pages/drawings/drawings.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 0,
    name: '',
    account: '',
    phone: '',
    code: '',
    enableWithdrawBalance:0,
    balance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getExtractInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获取金额
  getNumber: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      number: e.detail.value
    })
  },
  //全部提现
  allWithdrawal: function() {

  },
  //关闭当前页面
  closePage: function() {

  },
  //获取微信账号
  getAccount: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      account: e.detail.value
    })
  },
  //获取姓名
  getName: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      name: e.detail.value
    })
  },
  //获取手机号
  getPhone: function() {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getCode: function() {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      code: e.detail.value
    })
  },
  //提现
  extract: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let amount = that.data.number;
    let url = "common/weiXin/pay/entPay?userId=" + userId + "&amount=" + amount;
    var params = {}
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("提现返回值是：" + res.data);

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
  //
  getExtractInfo: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let amount = that.data.number;
    let url = "common/ali/pay/encash/info?userId=32";
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("提现返回值是：" + res.data);
        let balance = res.data.data.balance;
        let enableWithdrawBalance = res.data.data.enableWithdrawBalance;
        that.setData({
          balance: balance,
          enableWithdrawBalance: enableWithdrawBalance
        })

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