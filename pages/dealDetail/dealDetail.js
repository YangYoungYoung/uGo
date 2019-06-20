// pages/dealDetail/dealDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      // { name: '1月',
      // number:1},
      // {
      //   name: '2月',
      //   number: 2
      // },
      // {
      //   name: '3月',
      //   number: 3
      // },
      // {
      //   name: '4月',
      //   number: 4
      // },
      // {
      //   name: '5月',
      //   number: 5
      // },
      // {
      //   name: '6月',
      //   number: 6
      // },
      // {
      //   name: '7月',
      //   number: 7
      // },
      // {
      //   name: '8月',
      //   number: 8
      // },
      // {
      //   name: '9月',
      //   number: 9
      // },
      // {
      //   name: '10月',
      //   number: 10
      // },
      // {
      //   name: '11月',
      //   number: 11
      // },
      // {
      //   name: '12月',
      //   number: 12
      // },
      '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',],
    list: [{
        name: '商品兑换',
        time: '2019-06-22 10:38:53',
        number: 1000
      },
      {
        name: '礼品兑换',
        time: '2019-06-22 10:38:53',
        number: 10000
      },
      {
        name: '商品兑换',
        time: '2019-06-22 10:38:53',
        number: 1000
      },
      {
        name: '商品兑换',
        time: '2019-06-22 10:38:53',
        number: 1000
      },
      {
        name: '商品兑换',
        time: '2019-06-22 10:38:53',
        number: 1000
      },
      {
        name: '商品兑换',
        time: '2019-06-22 10:38:53',
        number: 1000
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      index: e.detail.value
    })
  },
 

})