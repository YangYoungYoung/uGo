// pages/integral_home/integral_home.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    circular: true,
    shopCategorys: [],
    goodsS: [],
    swiperList: [],
    index: 0,
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
    that.getGoodsList();
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
      index: index,
      scroreList: scroreList
    })
    that.getGoodsList();
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
  getShopCategory: function() {
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
        for (var i = 0; i < shopCategorys.length; i++) {
          let temp = shopCategorys[i].iconUrl;
          shopCategorys[i].iconUrl = '../images/' + temp;
        }

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
  //获取商品列表
  getGoodsList: function() {
    let that = this;
    // let scroe = index+1;

    let index = that.data.index + 1;
    console.log('index is:', index);
    let url = "goods/list?isIntegralShop=1" + "&integralLevel=" + index;
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
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });

  },
  //回到首页
  toHome: function() {
    wx.redirectTo({
      url: '../home/home',
    })
  },
  //跳转到商品详情
  toDetail: function(event) {
    let goodsId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../integral_detail/integral_detail?goodsId=' + goodsId,
    })
  },
  navigateToType: function(event) {
    let index = event.currentTarget.dataset.index;
    wx.setStorageSync('menuIndex', index);
    console.log('index is : ', index);
    wx.switchTab({
      url: '../integral_search/integral_search'
    })
  }
})