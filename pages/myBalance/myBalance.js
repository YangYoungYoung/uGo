// pages/myBalance/myBalance.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getExtractInfo();
  },

  //获取提现信息
  getExtractInfo: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let amount = that.data.number;
    let url = "common/ali/pay/encash/info?userId=" + userId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("提现返回值是：" + res.data);
        let balance = res.data.data.balance;
        
        that.setData({
          balance: balance,
          
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
  },
  toDrawings:function(){
    wx.navigateTo({
      url: '../drawings/drawings',
    })
  }
})