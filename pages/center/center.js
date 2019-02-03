// pages/center/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerList: [{
        name: '首页',
        src_yes: '../images/footer_home_y.png',
        src_no: '../images/footer_home_n.png',
        // select: true
      },
      {
        name: '积分兑换',
        src_yes: '../images/footer_duihuan_y.png',
        src_no: '../images/footer_duihuan_n.png'
      },
      {
        name: '个人中心',
        src_yes: '../images/footer_center_y.png',
        src_no: '../images/footer_center_n.png',
        select: true
      }
    ],
    orderList: [{
        name: "未支付",
        src: "../images/order_nopay1.png"
      },
      {
        name: "未发货",
        src: "../images/order_unshipped1.png"
      },
      {
        name: "已发货",
        src: "../images/order_shiped1.png"
      },
      {
        name: "已完成",
        src: "../images/order_done1.png"
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

  //底部导航栏切换
  footerChange: function(event) {
    let footeIndex = event.currentTarget.dataset.index;
    console.log('footeIndex is', footeIndex);
    let that = this;
    let footerList = that.data.footerList;
    if (footeIndex == 0) {
      wx.redirectTo({
        url: '../home/home',
      })
    } else if (footeIndex == 1) {
      wx.switchTab({
        url: '../integral_home/integral_home',
      })
    }
    for (var i = 0; i < footerList.length; i++) {
      if (i == footeIndex) {
        footerList[i].select = true;
      } else {
        footerList[i].select = false;
      }
    }
    that.setData({
      footerList: footerList
    })
  },
  //跳转到订单管理
  toOrder:function(event){
    let index = event.currentTarget.dataset.index;
    console.log("index is:",index);
    
      wx.navigateTo({
        url: '../integral_order/integral_order?id='+index,
      })

    
  }
})