// pages/center/center.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerList: [{
        name: '首页',
        src_yes: '../images/footer_home_y.png',
        src_no: '../images/footer_home_n.png',
        // select: true
      },
      {
        name: '积分兑换',
        src_yes: '../images/footer_duihuan_y.png',
        src_no: '../images/footer_duihuan_n.png'
      },
      {
        name: '个人中心',
        src_yes: '../images/footer_center_y.png',
        src_no: '../images/footer_center_n.png',
        select: true
      }
    ],
    orderList: [{
        name: "待确认",
        src: "../images/order_nopay.png"
      },
      {
        name: "待收货",
        src: "../images/order_shiped.png"
      },
      {
        name: "已完成",
        src: "../images/order_done.png"
      },
      {
        name: "已取消",
        src: "../images/order_canceled.png"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo.avatarUrl);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    // console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //底部导航栏切换
  footerChange: function(event) {
    let footeIndex = event.currentTarget.dataset.index;
    console.log('footeIndex is', footeIndex);
    let that = this;
    let footerList = that.data.footerList;
    if (footeIndex == 0) {
      wx.redirectTo({
        url: '../home/home',
      })
    } else if (footeIndex == 1) {
      wx.switchTab({
        url: '../integral_home/integral_home',
      })
    }
    for (var i = 0; i < footerList.length; i++) {
      if (i == footeIndex) {
        footerList[i].select = true;
      } else {
        footerList[i].select = false;
      }
    }
    that.setData({
      footerList: footerList
    })
  },
  //跳转到订单管理
  toOrder: function(event) {
    let index = event.currentTarget.dataset.index;
    console.log("index is:", index);

    wx.navigateTo({
      url: '../integral_order/integral_order?id=' + index,
    })
  },
  //成为商家
  toMerchant: function() {
    wx.navigateTo({
      url: '../authorizationStatement/authorizationStatement',
    })
  },
  //兑换，跳转到积分商城
  toIntegralShop:function(){
    wx.switchTab({
      url: '../integral_home/integral_home',
    })
  }
})