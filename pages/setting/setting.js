// pages/setting/setting.js
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

  },
  //获取用户信息
  getuserInfo: function() {
    let that = this;
    let userId = wx.getStorageSync("userId");
    
    // console.log('user is:', user);
    // let userId = wxUserInfo.id;
    if (userId == '' || userId == undefined) {
      common.showTip("请先登录", "loading");
      return;
    }
    let url = "userInfo?userId=" + userId;
    let method = "GET";
    var params = {

    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互
        if (res.data.code == 200) {
          let user = res.data.data;
          that.setData({
            user: res.data.data
          })
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.getuserInfo();
  },

  //选择图片
  chooseImg: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    if (userId == '' || userId == undefined) {
      common.showTip("请先登录", "loading");
      return;
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log('tempFilePaths:', tempFilePaths);
        // that.uploadImage(tempFilePaths[0]);
        // that.setData({
        //   src: tempFilePaths
        // })


        wx.uploadFile({
          url: 'https://api-test.ugo365.xyz/api/updateHeadUrl',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            usefilerId: 111
          },
          // header: {
          //   "Content-Type": "multipart/form-data" //记得设置
          // },
          success: function(res) {
            console.log('上传成功',res);
            // console.log(res.data)
            // var sss = JSON.parse(res.data)
            // var dizhi = sss.dizhi;
            // 输出图片地址 
            // console.log(dizhi);
            // that.setData({
            //   "dizhi": dizhi
            // })

            //do something  
          },
          fail: function(err) {
            console.log(err)
          }
        });
      }
    })
  },

  //上传图片
  // uploadImage: function(filep) {
  //   let userId = wx.getStorageSync('userId');

  // },
  changeName: function() {
    wx.navigateTo({
      url: '../changeName/changeName',
    })
  }
})