// pages/integral_detail/integral_detail.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0
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
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},

  //显示对话框
  showModal: function() {
    // 显示遮罩层
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /* 点击减号 */
  bindMinus: function() {
    let num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    let minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    let num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    let minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  //加入购物车
  addToCart: function() {
    let that = this;
    let id = that.data.goodId;
    let orderPath = that.data.orderPath;
    let goodName = that.data.goodName;
    let goodPrice = that.data.goodPrice;
    let integral = that.data.integral;
    let number = that.data.num
    console.log("当前数量是：" + number);
    let cartResult = new Array();

    let detailArray = {
      id: id,
      goodPrice: goodPrice,
      goodName: goodName,
      orderPath: orderPath,
      active: true,
      integral: integral,
      number: number
    };
    let oldcartResult = new Array;
    oldcartResult = wx.getStorageSync('cartResult');
    if (!oldcartResult) {
      cartResult.push(detailArray);
      wx.setStorage({
        key: "cartResult",
        data: cartResult
      })
    } else {
      oldcartResult.push(detailArray);
      wx.setStorage({
        key: "cartResult",
        data: oldcartResult
      })
    }
    common.showTip("添加成功", "success");
    that.hideModal();
    // wx.reLaunch({
    //   url: '../cart/cart'
    // })
  },
  //立即购买
  buyNow: function(e) {
    let that = this;
    that.hideModal();
    let id = that.data.goodId;
    let url = "https://mall.cmdd.tech/mall/api/createOrder";
    let openId = wx.getStorageSync("openId");
    let orderList = new Array();
    let shop = {
      id: id,
      number: that.data.num
    }
    orderList.push(shop);
    console.log("orderList:" + orderList[0].number + "openId:" + openId);
    let params = {
      orderList: orderList,
      //orderList: JSON.stringify(orderList),
      openId: openId
    }
    let method = "POST";
    let contentType = 'application/json'
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method, contentType).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data.orderId);
        if (res.data.orderId > 0) {
          wx.navigateTo({
            url: '../payOrder/payOrder?orderId=' + res.data.orderId,
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

})