// pages/typeInfo/typeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:[
      {
        name:"附近"
      },
      {
        name: "综合排行"
      },
      {
        name: "销量"
      },
      {
        name: "筛选"
      }
    ]
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
  //菜单选择
  selectMenu:function(event){
    let menuIndex = event.currentTarget.dataset.index;
    console.log('menuIndex is:', menuIndex);
  }
  
})