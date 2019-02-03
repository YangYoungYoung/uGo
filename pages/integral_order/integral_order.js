// pages/integral_order/integral_order.js
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
})