// pages/changePwd/setNewPwd/setNewPwd.js
var common = require("../../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入框参数设置
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: false, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
      height: "98rpx", //输入框高度
      width: "604rpx", //输入框宽度
      see: false, //是否明文展示
      interval: true, //是否显示间隔格子
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    let that = this;
    console.log(e.detail);
    let pwd = e.detail;
    let payPwd = wx.getStorageSync('payPwd');
    if (pwd == payPwd) {
      common.showTip('密码重复', 'loading');
      return;
    } else {
      wx.setStorageSync('payPwd', pwd);
      wx.navigateTo({
        url: '../setAgainPwd/setAgainPwd',
      })
    }

  }
})