// pages/uploadingData/uploadingData.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasfeedback: true,
    imageFrontPath: "",
    imageReversePath: "",
    certificate: "",
    items: [{
        value: '是',
        checked: true
      },
      {
        value: '否'
      },

    ],
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
    let that = this;
    let userId = wx.getStorageSync("userId");
    if (userId.length == 0 || userId == undefined) {
      common.showTip('请先登录', "loading");
      return;
    }
    let applicantName = that.data.name;
    let applicantMobile = that.data.phone;
    let applicantDistrict = wx.getStorageSync('district');//申请区域
    let authorization = '';
    let businessLicense = that.data.certificate;//营业执照
    let legalPersonIdCardContrary = that.data.imageReversePath;//身份证背面
    let legalPersonIdCardFront = that.data.imageFrontPath;//身份证正面
    let rejectReason = '';
    let status = 0;
    let isLegalPerson = that.data.seleted;

    var locatedApply = {
      applicantDistrict: applicantDistrict,
      applicantMobile: applicantMobile,
      applicantName: applicantName,
      authorization: authorization,
      businessLicense: businessLicense,
      isLegalPerson: isLegalPerson,
      legalPersonIdCardContrary: legalPersonIdCardContrary,
      legalPersonIdCardFront: legalPersonIdCardFront,
      rejectReason: rejectReason,
      status:0,
      userId: userId
    };

    let url = "locatedApplyRepository/userId"
    // var params = {
    //   // categoryPId: id,
    //   // categoryPName: typeName,
    //   // district: district,
    //   // latFrom: latitude, //纬度
    //   // lngFrom: longitude //经度
    //   locatedApply: locatedApply
    // }
    var params=locatedApply;
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("商铺列表返回值是：" + res.data);
       if(res.data.code==200){
         common.showTip('提交成功','success');
       }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
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
        let imageReversePath = res.tempFilePaths[0];
        // console.log(imageReversePath);
        that.setData({
          imageReversePath: imageReversePath
        })
      }
    })
  },
  //上传正面身份证照片
  chooseImageFront: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let imageFrontPath = res.tempFilePaths[0];
        that.setData({
          imageFrontPath: imageFrontPath
        })
        // console.log(imageFrontPath);
      }
    })
  },
  //上传营业执照
  chooseCertificate: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let certificate = res.tempFilePaths[0];
        that.setData({
          certificate: certificate
        })
        // console.log(imageFrontPath);
      }
    })
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
  //获取手机号
  phoneInput: function(e) {
    let that = this;
    let phone = e.detail.value;
    // console.log(phone);
    that.setData({
      phone: phone
    })
  },
  //单选按钮切换
  radioChange: function(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    let value = e.detail.value;
    this.setData({
      seleted: value
    })
  }
})