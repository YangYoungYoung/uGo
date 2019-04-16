// pages/securitySetting/phoneSetting/phoneSetting.js
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
    let mobile = wx.getStorageSync('mobile');
    this.setData({
      mobile: mobile
    })
  },

 

  //更改手机号
  changePhone:function(){
    wx.redirectTo({
      url: 'changePhone/changePhone',
    })
  }
  
})