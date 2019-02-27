// pages/securitySetting/phoneSetting/verification/verification.js
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
    console.log(e.detail.value);
    var that = this;
    that.setData({
      iptValue: e.detail.value
    });
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
        console.log('currentTime is:', currentTime);
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

  }
})