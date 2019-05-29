// pages/toMerchant/consult/consult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
    showMore: true,
    showModal: false
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

  //获取姓名
  nameInput: function(e) {
    let that = this;
    let name = e.detail.value;
    that.setData({
      name: name
    })
    // console.log(name);
  },
  //更多区域
  moreArea: function() {

  },
  //获取手机号
  phoneInput: function(e) {
    let that = this;
    let phone = e.detail.value;
    // console.log(phone);
    that.setData({
      phone: phone
    })
  },
  bindPickerSeatChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    let that = this;
    let array = that.data.array;
    // console.log(array[e.detail.value]);
    this.setData({
      showMore: false,
      index: e.detail.value
    })
  },
  //提交监听
  summit: function() {
    let that = this;
    that.showModal();
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
  showModal:function(){
    this.setData({
      showModal: true
    });
  }
})