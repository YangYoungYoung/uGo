// pages/authorizationStatement/authorizationStatement.js
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

  },
//跳转到上传资料的页面
  touploadingData:function(){
    wx.navigateTo({
      url: '../uploadingData/uploadingData',
    })
  }
})