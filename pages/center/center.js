// pages/center/center.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
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
  toIntegralShop: function() {
    wx.switchTab({
      url: '../integral_home/integral_home',
    })
  },
  //扫一扫
  scanCode: function() {
    let that = this;
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {

        let result = res.result;
        // console.log(result);
        var index = result.lastIndexOf("\=");
        let shopId = result.substring(index + 1, result.length);
        console.log(shopId);
        if (shopId != undefined || shopId.length != 0) {
          that.setData({
            shopId:shopId
          })
          that.showDialogBtn();
        }

        // return obj;
      }
    })
  },
  //获取到支付金额
  inputChange: function(e) {
    let that = this;
    let money = e.detail.value;
    console.log("money is:", money);
    that.setData({
      money: money
    })
  },
  //下单支付
  creatOrder: function() {
    // let openId = wx.getStorageSync("openId");
    // console.log("openId is:", openId);
    var timestamp = Date.parse(new Date());
    let shopId = this.data.shopId;
    timestamp = timestamp / 1000;
    let userId = wx.getStorageSync('userId');
    console.log('userId is:',userId);
    console.log("当前时间戳为：" + timestamp);
    let sn = 'ugo365' + shopId + userId + timestamp;
    console.log('sn is :',sn);


  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.creatOrder();
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 提现对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
    let that = this;
    // let url = "http://192.168.0.146:8083/api/putForward"
    let url = "common/weiXin/pay/createWXOrder"
    let method = "GET"
    // let openId = wx.getStorageSync("openId");
    var money = that.data.money;

    console.log("价格是：" + money);
    var params = {
      openId: openId,
      money: money,
      shopId: that.data.shopId,
      parentId: that.data.parentId,
      role: that.data.role
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互
        if (res.data.status == 200) {
          common.showTip("提现申请成功", "success");
        } else {
          var message = res.data.message
          common.showTip(message, "loading");
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