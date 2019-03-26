// pages/detail/detail.js
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
    if (options.id != undefined) {
      var id = options.id;
    }

    console.log("id is... :", id);
    let that = this;
    // let menu = that.data.menu;
    // let openId = wx.getStorageSync('openId');
    let url = "dg/shop/detail?id=1";
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("商铺列表返回值是：" + res.data);
        let shopInfo = res.data.data.shops;
        let pic_detail = shopInfo.pic_detail.split(",");

        that.setData({
          shopInfo: shopInfo,
          pic_detail: pic_detail
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //拨打商家电话
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfo.telephone // 仅为示例，并非真实的电话号码
    })
  },
  //打开地图导航
  toMap: function() {
    let shop = this.data.shopInfo;
    let longitude = shop.lng; //经度
    let latitude = shop.lat; //纬度
    // wx.navigateTo({
    //   url: '../detailMap/detailMap?longitude=' + longitude + '&latitude='+latitude,
    // })
    wx.openLocation({ //​使用微信内置地图查看位置。
      latitude: latitude, //要去的纬度-地址
      longitude: longitude, //要去的经度-地址
      name: shop.name,
      address: shop.detailAddress
    })
  }

})