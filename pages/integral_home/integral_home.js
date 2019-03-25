// pages/integral_home/integral_home.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCategorys:[],
    swiperList:[],
    scroreList: [{
        score: "0-1000",
        select: true,
      },
      {
        score: "1000-2000",
        select: false,
      },
      {
        score: "2000-3000",
        select: false,
      },
      {
        score: "3000以上",
        select: false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.getSwiperList();
    that.getShopCategory();
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  selectScore: function(event) {
    let that = this;
    let scroreList = that.data.scroreList;
    let index = event.currentTarget.dataset.index;
    console.log('index is', index);
    for (var i = 0; i < scroreList.length; i++) {
      if (i == index) {
        scroreList[i].select = true;
      } else {
        scroreList[i].select = false;
      }
    }
    that.setData({
      scroreList: scroreList
    })
  },
  //获取轮播图
  getSwiperList: function() {
    let that = this;
    let url = "dg/carouselPicture/list?isIntegralShop=1"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let swiperList = res.data.data.carouselPictures;
        that.setData({
          swiperList: swiperList
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
  //获取类别
  getShopCategory: function () {
    let that = this;
    let url = "dg/shopCategory/list?isIntegralShop=1"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let shopCategorys = res.data.data.shopCategorys;
        that.setData({
          shopCategorys: shopCategorys
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
})