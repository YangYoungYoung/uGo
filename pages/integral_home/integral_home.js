// pages/integral_home/integral_home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroreList: [{
        score: "0-1000",
        select: true,
      },
      {
        score: "1000-2000",
        select: false,
      },
      {
        score: "2000-3000",
        select: false,
      },
      {
        score: "3000以上",
        select: false,
      },
    ]
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

  selectScore: function(event) {
    let that = this;
    let scroreList = that.data.scroreList;
    let index = event.currentTarget.dataset.index;
    console.log('index is', index);
    for (var i = 0; i < scroreList.length; i++) {
      if (i == index) {
        scroreList[i].select = true;
      } else {
        scroreList[i].select = false;
      }
    }
    that.setData({
      scroreList: scroreList
    })

  }
})