// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    console.log("id is... :",id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //拨打商家电话
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  }

})