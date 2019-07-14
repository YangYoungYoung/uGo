// pages/changeName/changeName.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let name = options.name;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获取到用户昵称
  getName: function(e) {
    let that = this;
    let name = e.detail.value;
    console.log('name is:', name);
    that.setData({
      name: name
    })
  },
  //提交昵称
  submmit: function() {
    let that = this;
    let name = that.data.name;
    if (name == '') {
      common.showTip('昵称不能为空', 'loading');
      return;
    }
    let url = "updateNickname";
    var params = {
      // userId: userId,
      userId: 22,
      nickName: name,

    }
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip(res.data.msg);
          wx.navigateBack({
            delta: 1
          })
        } else {
          common.showTip(msg, 'loading');
        }

      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1000,
        })
      });
  }
})