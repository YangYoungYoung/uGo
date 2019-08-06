// pages/center/center.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPermission: false, //是否弹出授权
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: {},
    hasUserInfo: false,
    // showModal: false,
    showShare: false,
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
      // console.log(app.globalData.userInfo.avatarUrl);
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
    this.onConfirm();
  },

  //底部导航栏切换
  footerChange: function(event) {
    let footeIndex = event.currentTarget.dataset.index;
    // console.log('footeIndex is', footeIndex);
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
    let index = event.currentTarget.dataset.index + 1;
    // console.log("index is:", index);

    wx.navigateTo({
      url: '../integral_order/integral_order?id=' + index,
    })
  },
  //成为商家
  toMerchant: function() {
    wx.navigateTo({
      url: '../toMerchant/toMerchant',
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
        // console.log(shopId);
        if (shopId != undefined || shopId.length != 0) {
          // that.setData({
          //   shopId: shopId
          // })
          // that.showDialogBtn();
          wx.navigateTo({
            url: '../payment/payment?shopId=' + shopId,
          })
        }

        // return obj;
      }
    })
  },

  /**
   * 获取到用户信息
   */
  onConfirm: function() {

    let that = this;
    let user = wx.getStorageSync("user");
    let userId = user.id;
    let url = "userInfo?userId=" + userId;
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
          let payPwd = res.data.data.integralPayPassword;
          wx.setStorageSync('payPwd', payPwd);
          let mobile = res.data.data.mobile;
          wx.setStorageSync('mobile', mobile)
          // console.log("balance is:", res.data.data.balance);
          let user = res.data.data;
          wx.setStorageSync('user', user);
          that.setData({
            user: res.data.data
          })
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
  //跳转到余额页面
  toMyBalance: function() {
    wx.navigateTo({
      url: '../myBalance/myBalance',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var userId = wx.getStorageSync("userId");
    let phone = wx.getStorageSync('mobile');
    console.log('userId is:', userId);

    if (phone == undefined || phone == null) {
      phone = '';
    }
    console.log('phone is:', phone);
    return {
      title: '优购365导购平台',
      path: '/pages/share/share?userId=' + userId + "&phone=" + phone,
      success(e) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
        // console.log("用户取消了分享");
      },
      complete() {}
    }
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},

  /**
   * 隐藏分享对话框
   */
  hideShreModal: function() {
    this.setData({
      showShare: false
    });
  },

  /**
   * 分享弹窗
   */
  showShareDialogBtn: function() {
    this.setData({
      showShare: true
    })
  },
  /**
   * 隐藏分享模态对话框
   */
  hideShareModal: function() {
    this.setData({
      showShare: false
    });
  },
  //弹出授权弹窗
  showPermissionDialog: function() {
    console.log('弹出授权询问弹窗');
    let that = this;
    that.showPermissionDialogBtn();
  },

  /**
   * 隐藏授权对话框
   */
  hidePermissionModal: function() {
    this.setData({
      showPermission: false
    });
  },

  /**
   * 弹出授权弹窗
   */
  showPermissionDialogBtn: function() {
    this.setData({
      showPermission: true
    })
  },
  //授权权限
  bindGetUserInfo(res) {
    let that = this;
    let info = res;
    console.log(info);
    if (info.detail.userInfo) {
      console.log("点击了同意授权");
      that.hidePermissionModal();
      wx.login({
        success: function(res) {
          if (res.code) {
            that.setData({
              code: res.code
            })
            that.getOP();

            // wx.request({
            //   url: 'http://www.test.com/test',
            //   data: {
            //     code: res.code,
            //     nickName: info.detail.userInfo.nickName,
            //     city: info.detail.userInfo.city,
            //     province: info.detail.userInfo.province,
            //     avatarUrl: info.detail.userInfo.avatarUrl
            //   },
            //   header: {
            //     'content-type': 'application/json' // 默认值
            //   },
            //   success: function(res) {
            //     var userinfo = {};
            //     userinfo['id'] = res.data.id;
            //     userinfo['nickName'] = info.detail.userInfo.nickName;
            //     userinfo['avatarUrl'] = info.detail.userInfo.avatarUrl;
            //     wx.setStorageSync('userinfo', userinfo);
            //   }
            // })
          } else {
            console.log("授权失败");
            common.showTip('授权失败', loading);
          }
        },
      })

    } else {
      console.log("点击了拒绝授权");
    }
  },

  //获取用户openId接口
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this;
    let code = that.data.code;
    wx.showLoading({
        title: '加载中...',
      }),
      wx.request({
        url: "https://api-test.ugo365.xyz/api/common/weiXIn/openId?code=" + code,
        // url: "https://api.ugo365.xyz/api/common/weiXIn/openId?code=" + code,
        data: {
          // code: app.globalData.code
          // code: code
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET", //get为默认方法/POST
        success: function(res) {
          wx.hideLoading();
          console.log("sessionKey" + res.data.data.sessionKey); //正确返回结果
          if (res.data.data.sessionKey != undefined) {
            var sessionKey = res.data.data.sessionKey
            wx.getUserInfo({
              withCredentials: true,
              success: (obj) => {
                console.log('encryptedData is:', obj.encryptedData);
                console.log('iv is:', obj.iv);
                //获取用户UnionId
                wx.request({
                  url: "https://api-test.ugo365.xyz/wx/miniApp/getUnionIdFirst",
                  data: {
                    sessionKey: sessionKey,
                    encryptedData: obj.encryptedData,
                    ivStr: obj.iv,
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET", //get为默认方法/POST
                  success: function(res) {
                    // self.globalData.openid = res.data.openid;\
                    console.log('unionId is:', res);
                    // wx.setStorageSync('unionId', unionId);
                    //获取到unionId后关闭所有页面跳转到登录账号界面
                    // wx.reLaunch({
                    //   url: '../login/login',

                    // })
                  },
                  fail: function(res) {
                    console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: '网络错误',
              icon: 'loading',
              duration: 1000,
            })
          }

        },
        fail: function(res) {
          wx.hideLoading();
          // console.log(errMsg); //错误提示信息
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
            duration: 1000,
          })
        }
      });

  },

})