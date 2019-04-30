// pages/securitySetting/phoneSetting/changePhone/changePhone.js
var network = require("../../../../utils/network.js")
var common = require("../../../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //获取手机号
  phoneInput: function(e) {
    let phoneNumber = e.detail.value;
    // console.log(phoneNumber.length);
    if (phoneNumber.length == 11) {
      // console.log(phoneNumber);
      this.setData({
        clickable: true,
        phoneNumber: phoneNumber
      })
    }
  },
  //下一步
  nextStep: function() {
    let mobile = this.data.phoneNumber;
    wx.navigateTo({
      url: '../verification/verification?mobile=' + mobile + "&temp=1",
    })
  },
  
  //发送验证码
  getVerificationCode: function() {
    let that = this;

    let mobile = that.data.phoneNumber;
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
          that.nextStep();
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