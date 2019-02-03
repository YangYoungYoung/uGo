// pages/drawings/drawings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取金额
  getNumber:function(e){
    let that = this;
    console.log(e.detail.value);
    that.setData({
      number: e.detail.value
    })
  },
  //全部提现
  allWithdrawal:function(){
    
  }
})