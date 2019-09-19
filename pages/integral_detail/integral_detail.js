// pages/integral_detail/integral_detail.js
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

    num: 1,
    goodsSpecifitionValue: ''
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

        var goods = res.data.data.goods;
        var imagList = res.data.data.goods.listPicUrl.split(",");
        let specificationValues = goods.specificationValues;
        var guiGe = [];

        if (specificationValues != null) {
          var strArr = [];
          var allList = [];
          let temp = specificationValues.split(";");
          // console.log("temp is :", temp);
          for (var i = 0; i < temp.length; i++) {
            let str = temp[i];
            strArr = str.split(",");
            allList.push(strArr);
          }

          for (var i = 0; i < allList.length; i++) {
            var list = allList[i];
            var body = [];
            var obj = {};
            for (var j = 0; j < list.length; j++) {
              if (j == 0) {
                obj.name = list[j];
              } else {
                let item = {};
                item.content = list[j];
                item.select = false;
                body.push(item);
              }
              obj.body = body;
            }
            obj.id = i;
            guiGe.push(obj);
            // console.log('guiGe is: ', guiGe);
          }
        }
        that.setData({
          guiGe: guiGe,
          goods: goods,
          imagList: imagList
        })

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
  //获取选择的规格
  getGuiGe: function() {
    let that = this;
    let guiGe = that.data.guiGe;
    let goodsSpecifitionValue = "";
    for (var i = 0; i < guiGe.length; i++) {
      var list = guiGe[i].body;

      for (var j = 0; j < list.length; j++) {
        // console.log('list[j] is:', list[j]);
        if (list[j].select) {
          goodsSpecifitionValue += guiGe[i].name + "," + list[j].content + ";"
        }
      }
    }

    // that.setData({
    //   goodsSpecifitionValue: goodsSpecifitionValue
    // });
    return goodsSpecifitionValue;
  },

  //加入购物车
  addToCart: function() {
    let that = this;
    let userInfo = wx.getStorageSync('wxUserInfo');
    if (userInfo == '' || userInfo == undefined) {
      wx.showModal({
        title: '您还没有登录',
        content: '是否现在就去登录',
        cancelText: '否',
        confirmText: '是',
        success(res) {
          if (res.cancel) {
            // 用户点击了取消属性的按钮

          } else if (res.confirm) {
            // 用户点击了确定属性的按钮，跳转到个人中心登录
            wx.navigateTo({
              url: '../center/center',
            })
          }
        }
      })
      return;
    }
    let goodsId = that.data.goods.id;
    let goodsSpecifitionValue = that.getGuiGe();
    // console.log('goodsSpecifitionValue is:', goodsSpecifitionValue);
    if (goodsSpecifitionValue == '' || goodsSpecifitionValue == undefined) {
      common.showTip('请选择规格', 'loading');
      return;
    }

    let integral = that.data.integral;
    let number = that.data.num;
    let goodsName = that.data.goods.name;
    let index = that.data.index;
    let price = that.data.goods.integral;
    let userId = wx.getStorageSync('userId');
    // let url = "goods/goods?goodsId=" + goodsId;
    let url = "shoppingCart/add";
    let orderItem = {
      isIntegralShop: 1,
      goodsId: goodsId,
      number: number,
      userId: userId,
      price: price,
      goodsName: goodsName,
      goodsSpecifitionValue: goodsSpecifitionValue
    }
    var params = orderItem;
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          common.showTip("添加成功", "success");
          that.hideModal();
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
  // buyNow: function(id) {
  //   let that = this;
  //   let userInfo = wx.getStorageSync('userInfo');
  //   console.log('userInfo:',userInfo);
  //   if (userInfo == '' || userInfo == undefined) {
  //     wx.showModal({
  //       title: '您还没有登录',
  //       content: '是否现在就去登录',
  //       cancelText: '否',
  //       confirmText: '是',
  //       success(res) {
  //         if (res.cancel) {
  //           // 用户点击了取消属性的按钮

  //         } else if (res.confirm) {
  //           // 用户点击了确定属性的按钮，跳转到个人中心登录
  //           wx.navigateTo({
  //             url: '../center/center',
  //           })
  //         }
  //       }
  //     })
  //     return;
  //   }
  //   // let id = that.data.goodId;
  //   let userId = wx.getStorageSync("userId");

  //   let url = "shoppingCart/settleAccounts?userId=" + userId + "&orderItemId=" + id + "&isIntegralShop=1";

  //   let params = {}
  //   let method = "POST";
  //   let contentType = 'application/json'
  //   wx.showLoading({
  //       title: '加载中...',
  //     }),
  //     network.POST(url, params, method, contentType).then((res) => {
  //       wx.hideLoading();
  //       // console.log("返回值是：" + res.data.orderId);
  //       if (res.data.code == 200) {
  //         wx.navigateTo({
  //           url: '../integral_payOrder/integral_payOrder?orderId=' + res.data.orderId,
  //         })
  //       }
  //     }).catch((errMsg) => {
  //       wx.hideLoading();
  //       // console.log(errMsg); //错误提示信息
  //       wx.showToast({
  //         title: '网络错误',
  //         icon: 'loading',
  //         duration: 1500,
  //       })
  //     });
  // },
  //获取orderItem
  getOrderItem: function() {
    let that = this;
    let userInfo = wx.getStorageSync('wxUserInfo');
    console.log('userInfo:', userInfo);
    if (userInfo == '' || userInfo == undefined) {
      wx.showModal({
        title: '您还没有登录',
        content: '是否现在就去登录',
        cancelText: '否',
        confirmText: '是',
        success(res) {
          if (res.cancel) {
            // 用户点击了取消属性的按钮

          } else if (res.confirm) {
            // 用户点击了确定属性的按钮，跳转到个人中心登录
            wx.navigateTo({
              url: '../center/center',
            })
          }
        }
      })
      return;
    }
    let goodsId = that.data.goods.id;
    let goodsName = that.data.goods.name;
    let price = that.data.goods.integral;
    let goodsSpecifitionValue = that.getGuiGe();
    // console.log('goodsSpecifitionValue is:', goodsSpecifitionValue);
    if (goodsSpecifitionValue == '' || goodsSpecifitionValue == undefined) {
      common.showTip('请选择规格', 'loading');
      return;
    }
    let number = that.data.num;
    let url = "shoppingCart/add";
    let userId = wx.getStorageSync("userId");

    let params = {
      isIntegralShop: 1,
      goodsId: goodsId,
      number: number,
      userId: userId,
      price: price,
      goodsName: goodsName,
      goodsSpecifitionValue: goodsSpecifitionValue
    }
    let method = "POST";
    let contentType = 'application/json'
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method, contentType).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let orderItemId = res.data.data.orderItem.id;
          // that.buyNow(orderItemId);
          wx.navigateTo({
            url: '../integral_payOrder/integral_payOrder?orderId=' + orderItemId,
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

  guiGeSelect: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    // console.log('index is:', index);
    // console.log('id is:', id);


    let guiGe = that.data.guiGe;
    for (var i = 0; i < guiGe[id].body.length; i++) {
      if (i == index) {
        guiGe[id].body[i].select = true;

      } else {
        guiGe[id].body[i].select = false;
      }
    }

    that.setData({
      guiGe: guiGe
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    let goodsId = that.data.goodsId;
    let good = that.data.goods;
    let name = good.name;
    let integral = good.integral;
    // let str = '[' + integral+'积分免费拿]'+name;
    let str = `${integral}积分免费兑换 ${name}`;
    // console.log('phone is:', phone);
    return {
      title: str,
      path: '/pages/integral_detail/integral_detail?goodsId=' + goodsId,
      success(e) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
        // console.log("用户取消了分享");
      },
      complete() {}
    }
  },
})