// pages/integral_exchange/integral_exchange.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
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
    this.getGoodsList();
  },
  //获取商品列表
  getGoodsList: function() {
    let that = this;
    // let scroe = index+1;
    let userId = wx.getStorageSync('userId');
    let index = that.data.index + 1;
    let url = "goods/list?isIntegralShop=1" + "&integralLevel=0" + "&userId="+userId;
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let goodsS = res.data.data.goodsS;
        that.setData({
          goodsS: goodsS
        })
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
  //跳转到商品详情
  toDetail: function(event) {
    let goodsId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../integral_detail/integral_detail?goodsId=' + goodsId,
    })
  }
})