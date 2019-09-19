// pages/integral_exchange/integral_exchange.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: true,
    pageIndex: 1,
    hasNextList: false
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
    let userId = wx.getStorageSync('userId');
    if (userId == '' || userId == undefined) {
      common.showTip("请先登录", "loading");
      return;
    }
    let url = "goods/list";
    var params = {
      userId: userId,
      isIntegralShop: 1,
      integralLevel: 0,
      pageIndex: 1

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let goodsS = res.data.data.goodsS;
        if (goodsS.length == 0) {
          that.setData({
            showList: false
          })
        } else if (goodsS.length == 8) {
          that.setData({
            goodsS: goodsS,
            hasNextList: true
          })
        } else {
          that.setData({
            goodsS: goodsS,
          })
        }
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
  },
  //滚动条滚动到底部触发
  scrollLower: function() {
    let that = this;
    let hasNextList = that.data.hasNextList; //是否还有数据
    console.log('触发底部滚动条 ', hasNextList);
    if (hasNextList) {
      that.loadMoreShop();
    }
  },
  //加载更多商品列表
  loadMoreShop: function() {

    let that = this;
    let pageIndex = that.data.pageIndex;
    let userId = wx.getStorageSync('userId');
    let url = "goods/list?userId=" + userId + "&isIntegralShop=1" + "&integralLevel=0" + "&pageIndex=1";
    var params = {
      userId: userId,
      isIntegralShop: 1,
      integralLevel: 0,
      pageIndex: pageIndex
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let goodsS = res.data.data.goodsS;
        let oldList = that.data.goodsS;
        let newList = oldList.concat(goodsS);

        if (goodsS.length == 10) {
          that.setData({
            goodsS: newList,
            pageIndex: pageIndex,
            hasNextList: true
          })
        } else {
          that.setData({
            goodsS: newList,
            hasNextList: false
          })
        }
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
})