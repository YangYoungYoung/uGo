// pages/drawings/drawings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:0,
    name:'',
    account:'',
    phone:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取金额
  getNumber:function(e){
    let that = this;
    console.log(e.detail.value);
    that.setData({
      number: e.detail.value
    })
  },
  //全部提现
  allWithdrawal:function(){
    
  },
  //关闭当前页面
  closePage:function(){

  },
  //获取微信账号
  getAccount:function(e){
    let that = this;
    console.log(e.detail.value);
    that.setData({
      account: e.detail.value
    })
  },
  //获取姓名
  getName:function(e){
    let that = this;
    console.log(e.detail.value);
    that.setData({
      name: e.detail.value
    })
  },
  //获取手机号
  getPhone:function(){
    let that = this;
    console.log(e.detail.value);
    that.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getCode:function(){
    let that = this;
    console.log(e.detail.value);
    that.setData({
      code: e.detail.value
    })
  }

})