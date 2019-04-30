// pages/securitySetting/phoneSetting/verification/verification.js
var network = require("../../../../utils/network.js")
var common = require("../../../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputLen: 4,
    iptValue: "",
    isFocus: false,
    time: "60",
    currentTime: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //1为修改手机号，2为修改支付密码
    // let mobile = wx.getStorageSync('mobile');
    if (options.mobile != undefined) {
      // console.log('options.mobile is:', options.mobile);
      that.setData({
        mobile: options.mobile
      })
    }

    if (options.temp != undefined) {
      // console.log('options.temp is:', options.temp);
      that.setData({
        temp: options.temp
      })
    }
    that.getCode();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onFocus: function(e) {
    var that = this;
    that.setData({
      isFocus: true
    });
  },
  setValue: function(e) {
    // console.log(e.detail.value);
    var that = this;
    let iptValue = e.detail.value;
    that.setData({
      iptValue: e.detail.value
    });
    if (iptValue.length == 4) {

      that.verify();
    }
  },
  // //倒计时方法
  // countdown: function(that) {
  //   var second = that.data.second;
  //   if (second == 0) {
  //     // console.log("Time Out...");
  //     that.setData({
  //       selected: false,
  //       selected1: true,
  //       second: 60,
  //       nullHouse1: false,
  //       nullHouse2: true
  //     });
  //     return;
  //   }
  //   var time = setTimeout(function() {
  //     that.setData({
  //       second: second - 1,
  //       nullHouse1: true,
  //       nullHouse2: false
  //     });
  //     countdown(that);
  //   }, 1000)
  // }
  //验证码倒计时函数
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime
    })
    var interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: (currentTime)
      })

      if (currentTime <= 0) {
        // console.log('currentTime is:', currentTime);
        clearInterval(interval)
        that.setData({
          time: '00',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  //重新获取验证码
  resend: function() {
    let that = this;

    let mobile = that.data.mobile;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    let url = "common/smscode?mobile=" + mobile;
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
  //校验验证码
  verify: function() {
    let that = this;

    let mobile = that.data.mobile;
    let code = that.data.code;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    if (code == undefined || code == '') {
      common.showTip("请输入验证码", "loading");
      return;
    }
    let url = "verify?captcha =" + code + "&mobile=" + mobile;
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
          let temp = that.data.temp;
          if (temp == 1) {
            //绑定手机号
            that.bindingMobile()
          } else {
            //跳转到修改支付密码
            wx.navigateTo({
              url: '../../../setNewPwd/setNewPwd',
            })
          }

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
  //绑定手机号
  bindingMobile: function() {
    let that = this;
    let userId = wx.getStorageSync("userId");
    let mobile = that.data.mobile;
    if (mobile == undefined || mobile.length != 11 || mobile == '') {
      common.showTip("请输入正确手机号", "loading");
      return;
    }
    let url = "bindingMobile?userId=" + userId + "&mobile=" + mobile;
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
          common.showTip('绑定成功', 'succcess');
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