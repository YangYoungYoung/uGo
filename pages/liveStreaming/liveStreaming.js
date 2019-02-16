// pages/liveStreaming/liveStreaming.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:1334,
    showModalStatus:false,
    showModalDetail:false,
    inputSelect:false,
    message:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
        that.setData({
          windowHeight: windowHeight
        })
      }
    })
   
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindPlay() {
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  },
  //弹出弹窗
  showModel:function(){
    let that = this;
    that.setData({
      showModalStatus:true
    })
  },
  //隐藏弹窗
  hideModal: function () {
    let that = this;
    that.setData({
      showModalStatus: false
    })
  },

  //加入购物车
  joinCart:function(){

  },

  //立即购买
  buyNow:function(){

  },
  //跳转到购物车
  toCart:function(){

  },
  //关闭弹窗
  closeModel:function(){
    let that = this;
    that.setData({
      showModalDetail:false
    })
  },
  //跳转到详情
  toDetail:function(){
    let that =this;
    that.setData({
      showModalDetail: false,
      showModalStatus: false,
    })
  },
  //点击弹出输入框
  inputSelectFunction:function(){
    let that = this;
    that.setData({
      inputSelect:true
    })
  },

  //发送评论
  sendMessage:function(){

  },
  textInput:function(e){
    let message = e.detail.value;
    console.log(message);
    let that = this;
    that.setData({
      message: message
    })
  }
})