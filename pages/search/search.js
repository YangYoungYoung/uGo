// pages/search/search.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foundList: ["KTV", "温泉", "酒店", "好年纪"],
    localList: ["KTV水电费", "温泉安抚", "酒店东方闪电", "好年纪发送到", "KTV水电费", "温泉安抚", "酒店东方闪电", "好年纪发送到"],
    showList: false
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
  //搜索店铺
  onSearch: function(event) {
    let name = event.detail;
    let that = this;
    // if (options.id != undefined) {
    //   let id = options.id;
    //   this.setData({
    //     id: id
    //   })
    let district = wx.getStorageSync('district');
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');

    // console.log("id is... :", id);
    let url = "dg/shop/list"
    var params = {
      // shopCategoryId: id,
      district: district,
      latFrom: latitude, //纬度
      lngFrom: longitude, //经度
      name: name
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
          shopList: shopList,
          showList: true
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
    // }
  }


})