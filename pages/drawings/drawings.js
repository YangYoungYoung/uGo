// pages/drawings/drawings.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // number: 0,
    name: '',
    account: '',
    phone: '',
    code: '',
    enableWithdrawBalance: 0,
    balance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getExtractInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获取金额
  getNumber: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      number: e.detail.value
    })
  },
  //全部提现
  allWithdrawal: function() {
    let that = this;
    let number = that.data.enableWithdrawBalance;
    that.setData({
      number: number
    })
  },
  //关闭当前页面
  closePage: function() {
    wx.navigateBack({
      data:1
    })

  },
  //获取微信账号
  getAccount: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      account: e.detail.value
    })
  },
  //获取姓名
  getName: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      name: e.detail.value
    })
  },
  //获取手机号
  getPhone: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getCode: function(e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      code: e.detail.value
    })
  },
  //提现
  extract: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let amount = that.data.number;
    let url = "common/weiXin/pay/entPay?userId=" + userId + "&amount=" + amount;
    var params = {}
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("提现返回值是：" + res.data);
        let msg = res.data.msg;
        if(res.data.code==200){
          common.showTip(msg,'success');
        }else{
          common.showTip(msg, 'loading');
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
  //获取提现信息
  getExtractInfo: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let amount = that.data.number;
    let url = "common/ali/pay/encash/info?userId=" + userId;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("提现返回值是：" + res.data);
        let balance = res.data.data.balance;
        let enableWithdrawBalance = res.data.data.enableWithdrawBalance;
        that.setData({
          balance: balance,
          enableWithdrawBalance: enableWithdrawBalance
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
  //发送验证码
  sendVerificationCode: function() {
    let that = this;
    // let userId = wx.getStorageSync('userId');
    let mobile = that.data.phone;
    if (mobile == undefined || mobile.length != 11) {
      common.showTip("请填写手机号", 'loading');
      return;
    }
    let url = "common/smscode?mobile=" + mobile;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("提现返回值是：" + res.data);
        if (res.data.code == 200) {
          common.showTip('验证码发送成功', 'sueccess');
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
  //校验验证码
  verifyCode: function() {
    let that = this;
    // let userId = wx.getStorageSync('userId');
    let mobile = that.data.phone;
    let account = that.data.account;
    let name = that.data.name;
    let code = that.data.code;
    let number =that.data.number;
    console.log('当前金额是：',number);
    if (parseInt(number) <1 || number == undefined) {
      common.showTip("请填写提现金额", 'loading');
      return;
    }
    if (account.length == 0 || account==undefined){
      common.showTip("请填写微信账号", 'loading');
      return;
    }
    if (name.length == 0 || name == undefined) {
      common.showTip("请填写真实姓名", 'loading');
      return;
    }
    if (mobile == undefined || mobile.length != 11) {
      common.showTip("请填写手机号", 'loading');
      return;
    }
    if (code == undefined) {
      common.showTip('请填写验证码', 'loading');
      return;
    }
    let url = "common/verify?mobile=" + mobile +"&captcha="+code;
    var params = {}
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("提现返回值是：" + res.data);
        if (res.data.code == 200) {
          // common.showTip('验证成功', 'sueccess');
          that.extract();
        }else{
          let msg = res.data.msg;
          common.showTip(msg, 'loading');
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

})