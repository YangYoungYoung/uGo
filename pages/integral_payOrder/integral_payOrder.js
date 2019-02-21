// pages/integral_payOrder/integral_payOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    showAddr: true,
    showAddAddr: true,
    showModal: false,
    showPwdModal: false
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

  //获取用户地址
  getAddress() {
    if (wx.chooseAddress) {

      wx.chooseAddress({
        success: (res) => {
          this.setData({
            showAddAddr: false,
            showAddr: true,
            name: res.userName,
            addrdetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
            tel: res.telNumber
          })

        },
      })
    } else {
      common.showTip("当前微信版本不支持获取地址", "loading");
    }
  },

  //提交订单
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
  hidePwdModal: function () {
    this.setData({
      showPwdModal: false
    });
  },

  //忘记密码
  forgetPwd:function(){

  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    let that = this;
    console.log(e.detail);
  
    
    // 模态交互效果
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000
    })
  },
})