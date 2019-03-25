// pages/integral_cart/integral_cart.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.initEleWidth();
    this.onShow();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var shopList = [];
    // 获取购物车数据
    let that = this;
    that.getCartGoods();
    // var shopCarInfoMem = wx.getStorageSync('cartResult');
    // this.data.goodsList.list = shopCarInfoMem;


  },
  //跳转到首页
  toIndexPage: function() {
    wx.switchTab({
      url: "../index/index"
    });
  },

  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    var index = e.currentTarget.dataset.index;

    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },

  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  //删除商品
  delItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    let that = this;
    let userId = wx.getStorageSync('userId');
    let deleteList = [];

    deleteList.push(list[index].goodsId);
    // deleteList.push(0);
    console.log('goodsId is ....', list[index].goodsId);
    console.log("deleteList is:", deleteList);
    // let url = "shoppingCart/delete"
    // var params = {

    // }
    // let method = "GET";
    // wx.showLoading({
    //   title: '加载中...',
    // }),
    //   network.POST(url, params, method).then((res) => {
    //     wx.hideLoading();
    //     console.log("返回值是：" + res.data);
    //     let addressList = res.data.data.addressS;
    //     that.setData({
    //       addressList: addressList
    //     })


    //   }).catch((errMsg) => {
    //     wx.hideLoading();
    //     console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });
    wx.request({
      url: 'http://132.232.142.23:8088/api/shoppingCart/delete',

      data: deleteList,
      method: 'DELETE',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log("提交返回：" + res.data);
        if (res.data.code == 200) {
          // common.showTip("提交成功", 'success');
          list.splice(index, 1);
          this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

        }
      }
    });



  },
  //勾选或者取消
  selectTap: function(e) {

    let that = this;
    let userId = wx.getStorageSync('userId');
    let url = "shoppingCart/updateGoods"
    let method = "PUT";
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    let scList = [];
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      if (list[parseInt(index)].active) {

        var params = {
          scList: [{
            id: list[parseInt(index)].goodsId,
            isChecked: 1
          }]

        }
      } else {
        var params = {
          scList: [{
            id: list[parseInt(index)].goodsId,
            isChecked: 0
          }]
        }
      }
      wx.showLoading({
          title: '加载中...',
        }),
        network.POST(url, params, method).then((res) => {
          wx.hideLoading();
          console.log("返回值是：" + res.data);
          if (res.data.code == 200) {
            this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
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


    }
  },
  //总价
  totalPrice: function() {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.number;
      }
    }
    return total;
  },
  //全选
  allSelect: function() {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },

  //取消全选
  noSelect: function() {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function(saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    var shopCarInfo = {};
    wx.setStorage({
      key: "cartResult",
      data: list
    })
  },
  bindAllSelect: function() {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;

    let that = this;
    let userId = wx.getStorageSync('userId');
    let url = "shoppingCart/updateGoods"

    let method = "PUT";
    let scList = [];
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        let obj = {
          id: curItem.goodsId,
          isChecked: 1,
        };
        scList.push(obj);

        curItem.active = false;
      }

      var params = {
        scList: scList
      }

    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
        let obj = {
          id: curItem.goodsId,
          isChecked: 0,
        };
        scList.push(obj);
      }
      var params = {
        scList: scList
      }
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("全选返回值是：" + res.data);
        if (res.data.code == 200) {
          this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
        }
        // let addressList = res.data.data.addressS;
        // that.setData({
        //   addressList: addressList
        // })
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
  //数量加
  jiaBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    let that = this;
    let userId = wx.getStorageSync('userId');
    let url = "shoppingCart/updateGoods"

    let method = "PUT";
    let scList = [];
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number < 999) {
        list[parseInt(index)].number++;
        var params = {
          scList: [{
            id: list[parseInt(index)].goodsId,
            number: list[parseInt(index)].number
          }]
        }
        wx.showLoading({
            title: '加载中...',
          }),
          network.POST(url, params, method).then((res) => {
            wx.hideLoading();
            console.log("数量加返回值是：" + res.data);
            if (res.data.code == 200) {
              this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
            }
            // let addressList = res.data.data.addressS;
            // that.setData({
            //   addressList: addressList
            // })
          }).catch((errMsg) => {
            wx.hideLoading();
            console.log(errMsg); //错误提示信息
            wx.showToast({
              title: '网络错误',
              icon: 'loading',
              duration: 1500,
            })
          });
      }
    }
  },
  //数量减
  jianBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    let that = this;
    let userId = wx.getStorageSync('userId');
    let url = "shoppingCart/updateGoods"

    let method = "PUT";
    let scList = [];
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;

        var params = {
          scList: [{
            id: list[parseInt(index)].goodsId,
            number: list[parseInt(index)].number
          }]
        }
        wx.showLoading({
            title: '加载中...',
          }),
          network.POST(url, params, method).then((res) => {
            wx.hideLoading();
            console.log("数量减返回值是：" + res.data);
            if (res.data.code == 200) {
              this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
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
      }
    }
  },
  //编辑
  editTap: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  //完成
  saveTap: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  //完成隐藏
  getSaveHide: function() {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  deleteSelected: function() {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        list.splice(i--, 1);
      }
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  //提交订单
  toPayOrder: function() {
    var that = this;
    if (this.data.goodsList.noSelect) {
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    wx.showLoading();
    // 重新计算价格，判断库存
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('cartResult');
    shopList = shopCarInfoMem;
    if (shopList.length == 0) {
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    var orderResult = new Array();
    for (var i = 0; i < shopList.length; i++) {
      //把选择的放进订单存储中
      if (shopList[i].active) {
        //判断库存
        if (shopList[i].good_number < shopList[i].number) {
          common.showTip(shopList[i].name + "商品库存不足", "loading");
          return;
        } else {
          // console.log("商品的ID是：" + shopList[i].number);
          orderResult.push(shopList[i]);
        }
      }
    }
    //将选择的商品ID传给服务器生成订单
    let userId = wx.getStorageSync('userId');
    let url = "shoppingCart/settleAccounts?userId=" + userId +"&isIntegralShop=1"
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, 'POST', 'application/json').then((res) => {
        wx.hideLoading();
        console.log("提交订单的结果是：" + res.data.code); //正确返回结果
        //返回的是订单Id
       
      }).catch((errMsg) => {
        // wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
    // wx.setStorage({
    //   key: "orderResult",
    //   data: orderResult
    // })
  },
  //跳转到订单页面
  navigateToPayOrder: function() {
    //清除购物车库存
    // wx.removeStorageSync('cartResult')
    wx.hideLoading();
    wx.navigateTo({
      url: "../payOrder/payOrder?orderId=" + orderId
    })
  },
  //获取购物车商品列表
  getCartGoods: function() {

    let that = this;
    let userId = that.data.userId;

    let url = "shoppingCart/detail?userId=1" +"&isIntegralShop=1";
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let orderItem = res.data.data.orderItem;
        that.data.goodsList.list = orderItem;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), this.data.goodsList.list);

      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });

  }
})