// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync(' ')
        if (app.globalData.userInfo) {
          wx.getUserInfo({
            success: function(res) {
              // userInfo 只存储个人的基础数据
              console.log('userInfo :', userInfo);
              wx.setStorageSync('userInfo', res.userInfo);
            }
          })
          that.setData({
            authorization: false
          })
        }
        //wx.getuserinfo接口不再支持
        wx.getSetting({
          success: (res) => {
            //判断用户已经授权。不需要弹框
            if (!res.authSetting['scope.userInfo']) {
              that.setData({
                showModel: true
              })
            } else { //没有授权需要弹框
              that.setData({
                showModel: false
              })
              wx.showLoading({
                title: '加载中...'
              })
              // console.log('userInfo :', app.globalData.userInfo);
              // wx.setStorageSync('userInfo', res.userInfo);
              wx.getUserInfo({
                withCredentials: true,
                success: (obj) => {
                  console.log('encryptedData is:', obj.encryptedData);

                  // wx.request({
                  //   url: openIdUrl,
                  //   data: {
                  //     code: data.code,
                  //     encryptedData: obj.encryptedData,
                  //     iv: obj.iv,
                  //   },
                  //   success: function (res) {
                  //     self.globalData.openid = res.data.openid
                  //   },
                  //   fail: function (res) {
                  //     console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                  //   }
                  // })
                }
              })
              that.getOP(app.globalData.userInfo)
            }
          },
          fail: function() {
            wx.showToast({
              title: '网络错误',
              icon: 'warn',
              duration: 1000,
            })
          }
        })
      },
      fail: function() {
        wx.showToast({
          title: '网络错误',
          icon: 'warn',
          duration: 1000,
        })
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      let that = this;
      // console.log('bindGetUserInfo userInfo is:', e.detail.userInfo);
      // wx.setStorageSync('userInfo', e.detail.userInfo);
      wx.getUserInfo({
        withCredentials: true,
        success: (obj) => {
          console.log('encryptedData is:', obj.encryptedData);

          // wx.request({
          //   url: openIdUrl,
          //   data: {
          //     code: data.code,
          //     encryptedData: obj.encryptedData,
          //     iv: obj.iv,
          //   },
          //   success: function (res) {
          //     self.globalData.openid = res.data.openid
          //   },
          //   fail: function (res) {
          //     console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
          //   }
          // })
        }
      })

      that.getOP(e.detail.userInfo)
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户openId接口
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo;
    wx.showLoading({
        title: '加载中...',
      }),
      wx.request({
        // url: "http://ugo365.eicp.vip/api/common/weiXIn/openId?code=" + app.globalData.code,
        url: "https://api.ugo365.xyz/api/common/weiXIn/openId?code=" + app.globalData.code,
        data: {
          // code: app.globalData.code
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET", //get为默认方法/POST
        success: function(res) {
          wx.hideLoading();
          // console.log("openId的结果是：" + res.data.data.openId); //正确返回结果
          if (res.data.data.openId != undefined) {
            wx.setStorageSync('openId', res.data.data.openId); // 单独存储openid
            that.setData({
              openId: res.data.data.openId
            })
            that.getUserId();
            // wx.redirectTo({
            //   url: '../home/home',
            // })
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
  //getWXuserInfo
  // getUserInfo: function() {
    
  // },

  //获取用户信息
  getUserId: function() {
    let that = this;
    let openId = that.data.openId;

    let url = "userInfo?openId=" + openId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
          if (res.data.data != null) {
            let userId = res.data.data.userId;
            wx.setStorageSync('userId', userId);
            wx.redirectTo({
              url: '../home/home',
            })
          } else {
            that.register();
          }
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1000,
        })
      });
  },
  //用户注册
  register: function() {
    let that = this;
    let openId = that.data.openId;

    let url = "register?openId=" + openId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
          wx.redirectTo({
            url: '../setPassword/setPassword',
          })
          // that.userLogin();
        } else {
          common.showTip(msg, 'loading');
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
  //用户登录
  userLogin: function() {
    let that = this;
    let openId = that.data.openId;

    let url = "login?openid=" + openId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
          let userId = res.data.data.user.userId;
          // console.log('userId is:', userId);
          wx.setStorageSync('userId', userId);
          common.showTip(res.data.msg);
          wx.redirectTo({
            url: '../home/home',
          })
        } else {
          common.showTip(msg, 'loading');
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1000,
        })
      });
  }
})