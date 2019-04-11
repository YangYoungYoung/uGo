// pages/payment/payment.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserId();
  },

  chooseCheck:function(){
    let isChecked = !this.data.isChecked;
    console.log('isChecked is :', isChecked)
    this.setData({
      isChecked: isChecked
    })
  },
  //获取用户余额
  getUserId: function () {
    let that = this;
    let openId = wx.getStorageSync('openId');

    let url = "userInfo?openId=" + openId;
    var params = {}
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
         
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
  },

})