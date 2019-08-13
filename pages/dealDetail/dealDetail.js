// pages/dealDetail/dealDetail.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',
    ],
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
    let that = this;

    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var year = date.getFullYear();
    //获取月份  
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    console.log('month is:', month);
    let userId = wx.getStorageSync('userId');
    if(userId==''||userId==undefined){
      common.showTip("请先登录","loading");
      return;
    }
    that.setData({
      year: year,
      month: month,
      userId: userId
    })

    that.getDetailList();
    // let url = "integralTrade/userId";
    // let method = "GET";
    // var params = {
    //   userId:userId,
    //   year: year,
    //   Month: month

    // }
    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    //   network.POST(url, params, method).then((res) => {
    //     wx.hideLoading();
    //     //后台交互
    //     if (res.data.code == 200) {

    //     }
    //   }).catch((errMsg) => {
    //     wx.hideLoading();
    //     // console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });
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

  getDetailList: function() {
    let that = this;
    let userId = that.data.userId;
    let year = that.data.year;
    let month = that.data.month;
    wx.request({
      url: 'https://api-test.ugo365.xyz/api/integralTrade/userId',
      method: 'GET',
      data: {
        userId: userId,
        year: year,
        Month: month
      }, //参数为键值对字符串
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        "Content-Type": "applciation/json"
        // 'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        let sumExpend = res.data.data.sumExpend;
        let sumIncome = res.data.data.sumIncome;
        let integralTradeRecords = res.data.data.integralTradeRecords;
        that.setData({
          sumExpend: sumExpend,
          sumIncome: sumIncome,
          integralTradeRecords: integralTradeRecords
        })
      }

    })

  },



  bindPickerChange: function(e) {
    let that = this;
    
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      month: parseInt(e.detail.value) + 1
    })
    that.getDetailList();
   
  },
})