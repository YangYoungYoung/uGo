// pages/integral_payOrder/integral_payOrder.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd: '',
    // 输入框参数设置
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: false, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
      height: "98rpx", //输入框高度
      width: "604rpx", //输入框宽度
      see: false, //是否明文展示
      interval: true, //是否显示间隔格子
    },
    showAddr: false,
    showAddAddr: true,
    showModal: false,
    showPwdModal: false,
    address: '',
    name: '',
    tel: '',
    isIntegralShop: 1, //是否是积分商品，默认为是
    integralTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderId != undefined) {
      // console.log('orderId');
      let orderId = options.orderId;
      this.setData({
        orderId: orderId
      })
    }
    this.getAdvanceOrder();
    // let orderId = options.orderId;
    // let that = this;
    // // let scroe = index+1;
    // let url = "goods/list?orderId=1";
    // var params = {}
    // let method = "POST";
    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    //   network.POST(url, params, method).then((res) => {
    //     wx.hideLoading();
    //     console.log("订单返回值是：" + res.data);

    //   }).catch((errMsg) => {
    //     wx.hideLoading();
    //     console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let address = wx.getStorageSync('address');
    // console.log('address is :', address);
    if (address != undefined && address != '') {
      that.setData({
        showAddAddr: false,
        showAddr: true,
        name: address.consignee,
        address: address.district + address.detailInfo,
        tel: address.telNumber
      })
    }
  },

  //获取用户地址
  getAddress() {

    wx.navigateTo({
      url: '../myaddress/myaddress?chooseAddress=1',
    })
  },

  //积分商品提交订单
  payOrder: function() {

    let that = this;
    that.showModal();
  },

  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModal: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  //显示密码弹窗
  // showPwdModal: function() {
  //   // 显示遮罩层
  //   var animation = wx.createAnimation({
  //     duration: 200,
  //     timingFunction: "linear",
  //     delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //     animationData: animation.export(),
  //     showPwdModal: true
  //   })
  //   setTimeout(function() {
  //     animation.translateY(0).step()
  //     this.setData({
  //       animationData: animation.export()
  //     })
  //   }.bind(this), 200)
  // },

  inputPwd: function() {
    let that = this;
    //隐藏兑换弹窗
    that.hideModal();
    that.setData({
      showPwdModal: true
    });
  },
  //隐藏密码弹窗
  hidePwdModal: function() {
    this.setData({
      showPwdModal: false
    });
  },

  //忘记密码
  forgetPwd: function() {
    wx.navigateTo({
      url: '../changePwd/changePwd',
    })
  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    let that = this;
    // console.log(e.detail);
    let pwd = e.detail;
    that.setData({
      pwd: pwd
    })

    that.checkPwd();

  },
  //提交订单
  submitOrder: function() {

    let that = this;
    let cartItems = that.data.cartItems;
    // let scroe = index+1;
    let freightPrice = that.data.freightPrice;
    let description = that.data.description;
    let orderPrice = that.data.orderPrice;
    let integralTotal = that.data.integralTotal;
    let userId = wx.getStorageSync('userId');
    let orderItemId = that.data.orderItemId;
    let url = "order/add?isIntegralShop=1";
    let order = {
      address: that.data.address,
      consignee: that.data.name,
      mobile: that.data.tel,
      userId: userId,
      isIntegralShop: 1,
      freightPrice: freightPrice,
      goodsPrice: integralTotal,
      orderPrice: orderPrice,
      description: description,
      status: 0,
    };

    var params = order;

    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("提交订单返回值是：" + res.data);
        if (res.data.code == 200) {
          let orderId = res.data.data.order.id;
          that.setData({
            orderId: orderId
          })
          that.payOrder();

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
  //校验积分密码
  checkPwd: function() {
    let that = this;
    // let scroe = index+1;
    let userId = wx.getStorageSync('userId');
    let orderId = that.data.orderId;
    let integralTotal = that.data.integralTotal;
    let integralPayPasswordInpt = that.data.pwd;

    let url = "order/modify?orderId=" + orderId + "&type=10" + "&isIntegralShop=1" + "&userId=" + userId + "&integralPayPasswordInpt=" + integralPayPasswordInpt + "&integral=" + integralTotal;
    var params = {

    }
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("校验密码的返回值是：" + res.data);
        if (res.data.code == 200) {
          that.submitOrder();
        } else {
          common.showTip(res.data.msg, 'loading');
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
  //直播提交订单
  liveSubmitOrder: function() {
    var that = this;
    var totalFee = that.data.totalPrice * 100;
    let sn = that.data.sn;
    let orderId = that.data.orderId;
    var openId = wx.getStorageSync("openId");

    // var order_id = "25767795778125825";

    // console.log("当前的订单总价是：" + money);
    wx.request({
      url: 'https://mall.cmdd.tech/api/common/getRepayId?outTradeNo=' + sn + "&money=" + totalFee + "&openId=" + openId + "&orderId=" + orderId,
      data: {},
      header: { //请求头
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST

      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function(res) {
              // console.log("调起支付成功")
              wx.hideLoading();
              wx.showToast({
                title: "支付成功",
                icon: 'succes',
                duration: 1500
              })
              that.payRequest();
            },
            'fail': function(res) {
              // console.log("调起支付失败" + res.err_desc)
              wx.showToast({
                title: "支付失败",
                duration: 1500
              })
            },
            'complete': function(res) {}
          })
        }

      },
      fail: function(err) {
        common.showTip("网络错误", "loading");
      }, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },
  //支付成功回调
  payRequest: function() {
    let that = this;
    // let scroe = index+1;
    let userId = wx.getStorageSync('userId');
    let orderId = that.data.orderId;
    let integral = that.data.integral;
    let integralPayPasswordInpt = that.data.pwd;

    let url = "order/modify?orderId=" + orderId + "&type=10" + "&isIntegralShop=0";
    var params = {

    }
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("校验密码的返回值是：" + res.data);
        if (res.data.code == 200) {
          that.submitOrder();
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
  //获取预订单列表
  getAdvanceOrder: function() {
    let that = this;
    let orderId = that.data.orderId;
    let userId = wx.getStorageSync('userId');
    if (orderId != undefined) {
      var url = "shoppingCart/settleAccounts?userId=" + userId + "&orderItemId=" + orderId + "&isIntegralShop=1";
    } else {
      var url = "shoppingCart/settleAccounts?userId=" + userId + "&isIntegralShop=1"
    }

    let params = {};
    wx.showLoading({
        title: '加载中...',
      }),

      network.POST(url, params, 'POST', 'application/json').then((res) => {
        wx.hideLoading();
        // console.log("提交订单的结果是：" + res.data.code); //正确返回结果
        //返回的是订单Id
        if (res.data.code == 200) {
          let cartItems = res.data.data.cartItems;
          let integralTotal = res.data.data.integralTotal;

          let freightPrice = res.data.data.freightPrice;

          let orderPrice = parseFloat(integralTotal) + parseFloat(freightPrice);
          // console.log('integralTotal is ', integralTotal);
          that.setData({
            cartItems: cartItems,
            freightPrice: freightPrice,
            integralTotal: integralTotal,
            orderPrice: orderPrice
          })
        }

      }).catch((errMsg) => {
        // wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }

})