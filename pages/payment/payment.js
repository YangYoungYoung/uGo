// pages/payment/payment.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: true,
    balance: 0,
    balanceUse: false,
    number: 0,
    isUsed:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.shopId != undefined) {
      let shopId = options.shopId;
      console.log('shopId:', shopId);
      this.setData({
        shopId: shopId
      })
    }
    this.getUserId();
  },


  // isUsed
  chooseUse: function () {
    let isUsed = !this.data.isUsed;
    // console.log('isChecked is :', isChecked)
    this.setData({
      isUsed: isUsed
    })
  },
  chooseCheck: function() {
    let isChecked = !this.data.isChecked;
    // console.log('isChecked is :', isChecked)
    this.setData({
      isChecked: isChecked
    })
  },
  //获取用户余额
  getUserId: function() {
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
        // console.log("获取用户信息返回值是：" + res.data);

        if (res.data.code == 200) {
          let balance = res.data.data.balance;
          if (balance > 0) {
            that.setData({
              balance: balance,
              balanceUse: true
            })
          }

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
  //获取输入框的值，同时和余额做比较
  getNumber: function(e) {
    let that = this;
    let balance = that.data.balance;
    let number = e.detail.value;
    if (number > balance) {
      that.setData({
        balanceUse: false
      })
    }
    that.setData({
      number: number
    })
  },
  //用户支付
  userPay: function() {
    let that = this;
    // let number = that.data.number;
    let isChecked = that.data.isChecked;
    if (isChecked) {
      that.creatOrder();
    } else {
      that.balancePay();
    }
  },
  //下单支付
  creatOrder: function() {
    let that = this;
    // let openId = wx.getStorageSync("openId");
    // console.log("openId is:", openId);
    var timestamp = Date.parse(new Date());
    let shopId = this.data.shopId;
    timestamp = timestamp / 1000;
    let userId = wx.getStorageSync('userId');
    let openId = wx.getStorageSync('openId');
    let id = openId.substring(18);
    let sn = 'ugo365' + shopId + userId + '-' + id + timestamp;
    // console.log('sn is :', sn);
    let totalFee = that.data.number;
    if (totalFee == 0 || totalFee == '') {
      common.showTip('请输入金额', 'loading');
      return;
    }
    if (isUsed){
      
    }

    let url = "common/getRepayId?outTradeNo=" + sn + "&money=" + totalFee * 100 + "&openId=" + openId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("获取用户信息返回值是：" + res.data.timeStamp);

        if (res.statusCode == 200) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function(res) {
              // console.log("调起支付成功")
              wx.hideLoading();
              wx.showToast({
                title: "支付成功",
                icon: 'succes',
                duration: 1500
              })
              that.payRequest();
            },
            'fail': function(res) {
              // console.log("调起支付失败" + res.err_desc)
              wx.showToast({
                title: "支付失败",
                duration: 1500
              })
            },
            'complete': function(res) {}
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

  //扫码支付成功回调
  payRequest: function() {
    let that = this;
    // let scroe = index+1;
    let userId = wx.getStorageSync('userId');

    let ammount = that.data.number;
    let shopId = that.data.shopId;
    let url = "common/pay/return?userId=" + userId + "&shopId=" + shopId + "&ammount=" + ammount;
    var params = {

    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          let retIntegral = res.data.data.retIntegral;
          console.log('retIntegral: ', retIntegral);
          wx.showModal({
            title: '支付成功',
            content: '恭喜你获得了' + retIntegral + '积分!\n快去积分商城兑换商品吧!',
            cancelText: '立即兑换',
            confirmText: '返回首页',
            success(res) {
              if (res.cancel) {
                // 用户点击了取消属性的按钮，对应选择了'立即兑换'
                wx.switchTab({
                  url: '../integral_home/integral_home',
                })
              } else if (res.confirm) {
                // 用户点击了确定属性的按钮，对应选择了'返回首页'
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
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
  //余额支付
  balancePay: function() {
    let that = this;
    // let scroe = index+1;
    let userId = wx.getStorageSync('userId');

    let ammount = that.data.number;
    let url = "common/pay/balance?userId=" + userId + "&ammount=" + ammount;
    var params = {

    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          common.showTip('支付成功', 'success');
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
  }
})