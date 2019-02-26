// pages/securitySetting/phoneSetting/changePhone/changePhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickable:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取手机号
  phoneInput:function(e){
    let phoneNumber = e.detail.value;
    console.log(phoneNumber.length);
    if (phoneNumber.length==11){
      console.log(phoneNumber);
      this.setData({
        clickable: true
      })
    }
  },
  //下一步
  nextStep:function(){
    wx.navigateTo({
      url: '',
    })
  }
})