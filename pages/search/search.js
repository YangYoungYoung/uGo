// pages/search/search.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    showList: true,
    shopList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   *
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //搜索功能
  onSearch: function (event) {
    // console.log('搜索功能', event.detail);
    let that = this;
    let searchText = that.data.value;
    // console.log('搜索功能', searchText);
    that.setData({
      searchText: searchText
    })
    if (searchText != '' && searchText != null) {
      that.onSearchShop();
    }

  },
  onChange: function (event) {
    let that = this;
    let searchText = event.detail;
    that.setData({
      value: searchText
    })
  },
  //搜索店铺
  onSearchShop: function(event) {
    // let name = event.detail;
    let that = this;
    let name = that.data.searchText;
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
        // console.log("商铺列表返回值是：" + res.data);
        let shopList = res.data.data.shops;
      if (shopList.length>0){
        that.setData({
          shopList: shopList,
          showList: true
        })
      }
      else{
        that.setData({
          // shopList: shopList,
          showList: false
        })
      }
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
  },
  //跳转到商铺详情
  toshopDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }


})