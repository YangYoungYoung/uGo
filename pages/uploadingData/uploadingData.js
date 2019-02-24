// pages/uploadingData/uploadingData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageFrontPath:"",
    imageReversePath: "",
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

  
  //提交
  submit: function() {

  },
  //上传反面身份证照片
  chooseImageReverse: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let imageReversePath = res.tempFilePaths;
        console.log(imageReversePath);
        that.setData({
          imageReversePath: imageReversePath
        })
      }
    })
  },
  //上传正面身份证照片
  chooseImageFront:function(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let imageFrontPath = res.tempFilePaths;
        that.setData({
          imageFrontPath: imageFrontPath
        })
        console.log(imageFrontPath);
      }
    })
  },
  //获取姓名
  nameInput: function (e) {
    let that = this;
    let name = e.detail.value;
    that.setData({
      name: name
    })
    console.log(name);
  },
  //获取手机号
  phoneInput: function () {
    let that = this;
    let phone = e.detail.value;
    console.log(phone);
    that.setData({
      phone: phone
    })
  },
})