// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://api-test.ugo365.xyz/#/register',
    // url: 'https://api.ugo365.xyz/#/register',
    userId: '',
    phone: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('phone is:', options.phone);
    if (options.userId != undefined) {
      let userId = options.userId;
      this.setData({
        userId: userId
      })
    }
    if (options.phone != undefined) {
      let phone = options.phone;
      this.setData({
        phone: phone
      })
    }
  },


})