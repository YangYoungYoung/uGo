// pages/changePwd/changePwd.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onConfirm();
  },
  /**
   * 获取到用户信息
   */
  onConfirm: function () {

    let that = this;
    let openId = wx.getStorageSync("openId");
    let url = "userInfo?openId=" + openId;
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
          let mobile = res.data.data.mobile;
          console.log('mobile is:', mobile);
          if (mobile == null || mobile.length < 11) {
            //跳转到设置密码
            wx.showModal({
              title: '未绑定手机号',
              content: '是否前往绑定手机号',
              cancelText: '否',
              confirmText: '是',
              success(res) {
                if (res.cancel) {
                  // 用户点击了取消属性的按钮，
                  
                } else if (res.confirm) {
                  // 用户点击了确定属性的按钮
                 wx.navigateTo({
                   url: '../bindPhone/bindPhone',
                 })
                }
              }
            })
          }
          that.setData({
            mobile: mobile
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
  

  forget:function(){
    let that = this;
    let mobile = that.data.mobile;
   
    wx.navigateTo({
      url: '../securitySetting/phoneSetting/verification/verification?mobile=' + mobile+"&temp=2",
    })
  },
  remeber:function(){
    wx.navigateTo({
      url: 'newPayPwd/newPayPwd',
    })
  },
  
  //获取验证码
  getVerificationCode: function () {
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
          thatforget();
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
})