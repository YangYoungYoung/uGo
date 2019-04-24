// pages/moreShop/moreShop.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
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
    let district = wx.getStorageSync('district');
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');
    this.setData({
      district: district,
      latitude: latitude,
      longitude: longitude
    })
  },

  onShow: function() {
    this.getShopList();
  },
  //获取商铺信息
  getShopList: function() {
    let that = this;
    let url = "dg/shop/list"
    var params = {
      type: 3,
      district: that.data.district,
      latFrom: that.data.latitude, //纬度
      lngFrom: that.data.longitude //经度
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("商铺列表返回值是：" + res.data);
        let shopList = res.data.data.shops;
        that.setData({
          shopList: shopList
        })
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });

  },
  //跳转到商铺详情
  toShop: function (event) {
    let id = event.currentTarget.dataset.id;
    console.log("id is", id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },

})