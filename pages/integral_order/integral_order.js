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
    that.getorderList();

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

  swichNav: function(e) {

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
  bindChange: function(e) {

    let that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.onShow()
  },
  onPullDownRefresh: function() {
    let that = this
    wx.stopPullDownRefresh();
    that.onShow()
  },
  //确认订单
  confirmOrder: function() {

  },
  //取消订单
  cancelOrder: function() {
    let that = this;
    common.showModal('你确定取消订单吗？', '提示', true, function(e) {
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
              setTimeout(function() {
                that.onShow()
              }, 3000);
            } else {
              common.showTip('取消订单失败');
              setTimeout(function() {
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
  //获取订单列表
  getorderList: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');

    let currentTab = that.data.currentTab;
    let status = 0;
    if (currentTab == 0) {
      var url = "order/list?userId=" + userId;
    } else if (currentTab == 1) {
      //待确认
      var url = "order/list?userId=" + userId + "&status=" + status;
    } else if (currentTab == 2) {
      //待收货
      let status = 10;
      var url = "order/list?userId=" + userId + "&status=" + status;
    } else if (currentTab == 3) {
      //已完成
      let status = 2;
      var url = "order/list?userId=" + userId + "&status=" + status;
    } else if (currentTab == 4) {
      //已取消
      let status = 3;
      var url = "order/list?userId=" + userId + "&status=" + status;
    }

    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("列表返回值是：" + res.data);
        // let orders = res.data.data.orders;
        // that.setData({
        //   orders: orders
        // })
        //订单列表初始化

        var allOrder = [],
          noPayment = [], //待付款
          bought = [], //未发货
          used = [], //已完成
          cancel = []; //已取消


        switch (currentTab) {
          case 0: //待付款
            allOrder = res.data.data.orders;
            break;
          case 1: //未发货
            noPayment = res.data.data.orders;
            break;
          case 2: //已发货
            bought = res.data.data.orders;
            break;
          case 3: //已完成
            used = res.data.data.orders;
            break;
          case 3: //已完成
            cancel = res.data.data.orders;
            break;
          default: //全部状态
        }
        // console.log(noPayment[1].shopInfo.shopName);
        that.setData({
          allOrder: allOrder,
          noPayment: noPayment,
          bought: bought,
          used: used,
          cancel: cancel
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