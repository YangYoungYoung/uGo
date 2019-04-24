// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://share-app.ugo365.xyz/#/register',
    userId: '',
    phone: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.userId != undefined) {
      let userId = options.userId;
      this.setData({
        userId: userId
      })
    }
    if (options.phone != undefined) {
      let userId = options.userId;
      this.setData({
        phone: phone
      })
    }
  },


})