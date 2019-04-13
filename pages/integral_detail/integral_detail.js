// pages/integral_detail/integral_detail.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let goodsId = options.goodsId;
    that.setData({
      goodsId: goodsId
    })
    let index = that.data.index;
    // let url = "goods/goods?goodsId=" + goodsId;
    let url = "goods?goodsId=" + goodsId;
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let goods = res.data.data.goods;
        let imagList = res.data.data.goods.listPicUrl.split(",");

        that.setData({
          goods: goods,
          imagList: imagList
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
    let goodsId = that.data.goods.id;
    // let orderPath = that.data.orderPath;
    // let goodName = that.data.goodName;
    // let goodPrice = that.data.goodPrice;
    let integral = that.data.integral;
    let number = that.data.num;
    let goodsName = that.data.goods.name;
    let index = that.data.index;
    let price = that.data.goods.integral;
    let userId = wx.getStorageSync('userId');
    // let url = "goods/goods?goodsId=" + goodsId;
    let url = "shoppingCart/add";
    var params = {
      sIntegralShop: 1,
      goodsId: goodsId,
      number: number,
      userId: 1,
      price: price
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          common.showTip("添加成功", "success");
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

    // console.log("当前数量是：" + number);
    // let cartResult = new Array();

    // let detailArray = {
    //   id: id,
    //   goodPrice: goodPrice,
    //   goodName: goodName,
    //   orderPath: orderPath,
    //   active: true,
    //   integral: integral,
    //   number: number
    // };
    // let oldcartResult = new Array;
    // oldcartResult = wx.getStorageSync('cartResult');
    // if (!oldcartResult) {
    //   cartResult.push(detailArray);
    //   wx.setStorage({
    //     key: "cartResult",
    //     data: cartResult
    //   })
    // } else {
    //   oldcartResult.push(detailArray);
    //   wx.setStorage({
    //     key: "cartResult",
    //     data: oldcartResult
    //   })
    // }
    // common.showTip("添加成功", "success");
    // that.hideModal();
    // wx.reLaunch({
    //   url: '../cart/cart'
    // })
  },
  //立即购买
  buyNow: function(id) {
    let that = this;
    // let id = that.data.goodId;
    let url = "shoppingCart/settleAccounts?userId=32" + "&orderItemId=" + id + "&isIntegralShop=1";
    // let userId = wx.getStorageSync("userId");

    let params = {
      // userId: 32,
      // orderItemId: id,
      // isIntegralShop: 1
    }
    let method = "POST";
    let contentType = 'application/json'
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method, contentType).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data.orderId);
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../integral_payOrder/integral_payOrder?orderId=' + res.data.orderId,
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
  //获取orderItem
  getOrderItem: function() {
    let that = this;
    let goodsId = that.data.goods.id;
    let goodName = that.data.goods.name;
    let price = that.data.goods.integral;

    let number = that.data.num;
    let url = "shoppingCart/add";
    let userId = wx.getStorageSync("userId");

    let params = {
      userId: 32,
      goodName: goodName,
      goodsId: goodsId,
      price: price,
      number: 1,
      isIntegralShop: 1
    }
    let method = "POST";
    let contentType = 'application/json'
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method, contentType).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let orderItemId = res.data.data.orderItem.id;
          that.buyNow(orderItemId);

        }

        // if (res.data.orderId > 0) {
        //   wx.navigateTo({
        //     url: '../payOrder/payOrder?orderId=' + res.data.orderId,
        //   })
        // }

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