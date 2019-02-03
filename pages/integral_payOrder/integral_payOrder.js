// pages/integral_payOrder/integral_payOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddr: true,
    showAddAddr:true
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

  //获取用户地址
  getAddress() {
    if (wx.chooseAddress) {

      wx.chooseAddress({
        success: (res) => {
          this.setData({
            showAddAddr: false,
            showAddr: true,
            name: res.userName,
            addrdetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            tel: res.telNumber
          })

        },
      })
    } else {
      common.showTip("当前微信版本不支持获取地址", "loading");
    }
  },
})