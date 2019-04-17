// pages/integral_subList/integral_subList.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id != undefined) {
      this.setData({
        id: options.id
      })
    }
    this.getGoodsList();
  },
  //获取商品列表
  getGoodsList: function() {
    let that = this;
    // let scroe = index+1;
    let name = that.data.searchText;
    let id = that.data.id;
    console.log('id is :', id);
    if (name.length > 0 || name != '') {
      var url = "goods/list?isIntegralShop=1" + "&name=" + name;
    } else if (id != 0) {
      var url = "goods/list?isIntegralShop=1" + "&categoryId=" + id;
    }


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
  //搜索功能
  onSearch: function(event) {
    // console.log('搜索功能', event.detail);
    let that = this;
    let searchText = that.data.value;
    console.log('搜索功能', searchText);
    that.setData({
      searchText: searchText
    })
    if (searchText != '' && searchText != null) {
      that.getGoodsList();
    }

  },
  onChange: function(event) {
    let that = this;
    let searchText = event.detail;
    that.setData({
      value: searchText
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