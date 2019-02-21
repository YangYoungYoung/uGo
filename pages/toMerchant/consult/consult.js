// pages/toMerchant/consult/consult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:""
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

  //获取姓名
  nameInput:function(e){
    let that = this;
    let name = e.detail.value;
    that.setData({
      name:name
    })
    console.log(name);
  },
  //更多区域
  moreArea:function(){

  },
  //获取手机号
  phoneInput:function(){
    let  that = this;
    let phone = e.detail.value;
    console.log(phone);
    that.setData({
      phone: phone
    })
  }
})