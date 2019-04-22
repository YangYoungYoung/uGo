// pages/logistics/logistics.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // steps: [{
    //     text: '步骤一',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤二',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤三',
    //     desc: '描述信息'
    //   },
    //   {
    //     text: '步骤四',
    //     desc: '描述信息'
    //   }
    // ]
    nu: 294788711701,
    tel: 7081
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.nu != undefined) {
      that.setData({
        nu: nu
      })
    }
    if (options.tel != undefined) {
      let tel = options.tel;
      tel = tel.substr(tel.length - 4)
      console.log('tel is:', tel);
      that.setData({
        tel: tel
      })
    }

  },
  onShow:function(){
    this.submitOrder();
  },
  //查看物流
  submitOrder: function () {

    let that = this;
    let nu = that.data.nu;
    let tel = that.data.tel;

    let url = "common/post?nu=" + nu +"&receiverPhone="+tel;
   
    var params = {};

    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        
        if (res.data.code == 200) {
          let expTextName = res.data.data.expTextName;
          console.log('expTextName is:', expTextName);
          let postDetail = res.data.data.postDetail;
          that.setData({
            postDetail: postDetail,
            expTextName: expTextName
          })

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

})