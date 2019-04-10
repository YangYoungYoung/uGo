// pages/integral_search/integral_search.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCategorys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },
  onShow: function() {
    this.getShopCategory();
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
        that.setData({
          shopCategorys: shopCategorys
        })
        var index = wx.getStorageSync('menuIndex');
        console.log('menuIndex is:', index);

        if (index != undefined) {

          this.setData({
            toView: 'order' + index.toString(),
            index: index
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
  },
  //左边栏选择
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString(),
      index: index
    })
    console.log(this.data.toView);
  },
  //跳转到二级分类
  toSubList: function(e) {
    let subId = e.currentTarget.dataset.id;
    console.log("subId is:", subId);
    wx.navigateTo({
      url: '../integral_subList/integral_subList?id=' + subId,
    })
  },
  //搜索
  onSearch: function(event) {
    let value = event.detail;
    wx.navigateTo({
      url: '../integral_subList/integral_subList?value=' + value,
    })
  }

})