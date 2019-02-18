// pages/integral_order/integral_order.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winHeight: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.id > 0) {
      that.setData({
        currentTab: options.id
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    that.onShow();
  },
  bindChange: function (e) {

    let that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.onShow()
  },
  onPullDownRefresh: function () {
    let that = this
    wx.stopPullDownRefresh();
    that.onShow()
  },
  //确认订单
  confirmOrder:function(){

  },
  //取消订单
  cancelOrder:function(){
    let that = this;
    common.showModal('你确定取消订单吗？', '提示', true, function (e) {
      if (e.confirm) {
        let url = "https://mall.cmdd.tech/mall/api/delOrderStatus";
        var params = {
          orderId: orderId,
          shopId: shopId
        }
        wx.showLoading({
          title: '加载中...',
        }),
          network.POST(url, params).then((res) => {
            wx.hideLoading();
            console.log("取消订单的结果是：" + res.data);
            if (res.data.status == 200) {
              common.showTip('取消订单成功');
              setTimeout(function () {
                that.onShow()
              }, 3000);
            } else {
              common.showTip('取消订单失败');
              setTimeout(function () {
                that.onShow()
              }, 3000);
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
        that.onShow()
      }
    });
  },


})