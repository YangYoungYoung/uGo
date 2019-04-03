// pages/home/home.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    district: '',
    liveRooomList: [],
    shopCategorys: [],
    swiperList: [],
    clicked: false,
    showModal: false,
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    circular: true,
    addIntegral: 0,
    signedTimes: 0,
    footerList: [{
        name: '首页',
        src_yes: '../images/footer_home_y.png',
        src_no: '../images/footer_home_n.png',
        select: true
      },
      {
        name: '积分兑换',
        src_yes: '../images/footer_duihuan_y.png',
        src_no: '../images/footer_duihuan_n.png'
      },
      {
        name: '个人中心',
        src_yes: '../images/footer_center_y.png',
        src_no: '../images/footer_center_n.png'
      }
    ],
    sineList: [{
        name: "第1天",
        number: 5,
        select: false
      },
      {
        name: "第2天",
        number: 12,
        select: false
      },
      {
        name: "第3天",
        number: 40,
        select: false
      },
      {
        name: "第4天",
        number: 19,
        select: false
      },
      {
        name: "第5天",
        number: 26,
        select: false

      },
      {
        name: "第6天",
        number: 68,
        select: false
      },
      {
        name: "第7天",
        number: 68,
        select: false
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.getUserLocation();

    that.getLiveRoomList();
    that.getSwiperList();
    that.getShopCategory();
    that.getBanner();

  },
  //获取商铺信息
  getShopList: function() {
    let that = this;
    let url = "dg/shop/list"
    var params = {

      district: that.data.district,
      latFrom: that.data.latitude, //纬度
      lngFrom: that.data.longitude //经度
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("商铺列表返回值是：" + res.data);
        let shopList = res.data.data.shops;
        that.setData({
          shopList: shopList
        })
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

  //获取用户地址
  getUserLocation: function() {
    let that = this;
    wx.getLocation({
      success: function(res) {
        // console.log(res)
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        // let location = res.latitude
        let qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + res.latitude + ',' +
          res.longitude + "&key=F24BZ-B5FKQ-6PC5F-GTQJO-RETFK-C7F5M" + "&get_poi=1";
        wx.request({
          url: qqMapApi,
          data: {

          },
          method: 'GET',
          success: (res) => {
            console.log(res.data);
            console.log(res.data.result.address_component.district)

            //取位置名
            that.setData({
              district: res.data.result.address_component.district
            })
            that.getShopList();
            // that.getRecommendShopList();
          }
        });

      },
      fail: function(res) {
        that.setData({
          showModal: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let district = that.data.district;
    console.log("district is :", district);
    that.getLiveRoomList();
    that.getSwiperList();
    that.getShopCategory();
    that.getBanner();
    // that.setData();
  },
  //跳转到不同分类
  navigateToType: function(event) {
    let menuIndex = event.currentTarget.dataset.index;

  },
  //底部导航栏切换
  footerChange: function(event) {
    let footeIndex = event.currentTarget.dataset.index;
    console.log('footeIndex is', footeIndex);
    let that = this;
    let footerList = that.data.footerList;
    if (footeIndex == 2) {
      wx.redirectTo({
        url: '../center/center',
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
  //商家电话
  callPhone: function(event) {
    let telephone = event.currentTarget.dataset.telephone;
    console.log('phone is:', telephone);
    wx.makePhoneCall({
      phoneNumber: telephone // 仅为示例，并非真实的电话号码
    })
  },
  //跳转到搜索页面
  toSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  //签到按钮
  sineInClick: function() {
    let that = this;
    let integral = that.data.integral;
    let sineList = that.data.sineList;
    let signedTimes = that.data.signedTimes;
    let addedIntegral = sineList[signedTimes].number;
    let openId = wx.getStorageSync('openId');

    let url = "sign?userOpenId=" + openId + "&addedIntegral=" + addedIntegral;
    var params = {
      // userOpenId: openId,
      // addedIntegral: addedIntegral
    }
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.getShopList();
          for (var i = 0; i <= signedTimes; i++) {
            if (i <= signedTimes) {
              sineList[i].select = true;
            }
          }
          that.setData({
            sineList: sineList,
            clicked: true
          })

          wx.showToast({
            title: '积分+' + addedIntegral,
            icon: 'success',
            duration: 1500,
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
  toMap: function() {
    wx.navigateTo({
      url: '../switchcity/switchcity',
    })
  },
  //跳转到商铺详情
  toShop: function(event) {
    let id = event.currentTarget.dataset.id;
    console.log("id is", id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  //获取位置二次授权
  handler: function(e) {
    let that = this;
    console.log(";;;;;;;;;;;;;");
    if (e.detail.authSetting["scope.userLocation"]) {
      that.hideModal();
      //返回时重新刷新首页页面
      wx.reLaunch({
        url: '../home/home'
      })
    }

  },


  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },

  //获取直播列表
  getLiveRoomList: function() {
    let that = this;

    let url = "zhiBo/room/list"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let liveRooomList = res.data.data;
        that.setData({
          liveRooomList: liveRooomList
        })

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
  //进入直播室
  toLiveRoom: function(event) {
    let index = event.currentTarget.dataset.index;
    console.log('index is:', index);

    let that = this;
    let liveRooomList = that.data.liveRooomList;
    // let palyUrl = liveRooomList[index].palyUrl;
    let userId = liveRooomList[index].userId;
    wx.navigateTo({
      url: '../liveStreaming/liveStreaming?userId=' + userId,
    })
  },
  //获取轮播图
  getSwiperList: function() {
    let that = this;
    let url = "dg/carouselPicture/list?isIntegralShop=0"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let swiperList = res.data.data.carouselPictures;
        that.setData({
          swiperList: swiperList
        })
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
  //获取类别
  getShopCategory: function() {
    let that = this;
    let url = "dg/shopCategory/list?isIntegralShop=0"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let shopCategorys = res.data.data.shopCategorys;
        that.setData({
          shopCategorys: shopCategorys
        })
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

  //获取商家列表
  // getRecommendShopList: function() {
  //   let that = this;
  //   let url = "dg/shop/list"
  //   var params = {
  //     type: 3,
  //     district: that.data.district,
  //     latFrom: that.data.latitude, //纬度
  //     lngFrom: that.data.longitude //经度
  //   }
  //   let method = "GET";
  //   wx.showLoading({
  //       title: '加载中...',
  //     }),
  //     network.POST(url, params, method).then((res) => {
  //       wx.hideLoading();
  //       console.log("商铺列表返回值是：" + res.data);
  //       let shopList = res.data.data.shops;
  //       that.setData({
  //         shopList: shopList
  //       })
  //     }).catch((errMsg) => {
  //       wx.hideLoading();
  //       console.log(errMsg); //错误提示信息
  //       wx.showToast({
  //         title: '网络错误',
  //         icon: 'loading',
  //         duration: 1500,
  //       })
  //     });
  // },
  //跳转到类型详情
  navigateToType: function(event) {
    let id = event.currentTarget.dataset.id;
    console.log('type id is:', id);
    wx.navigateTo({
      url: '../typeInfo/typeInfo?id=' + id,
    })
  },
  //获取商家优选接口
  getBanner: function() {


    let that = this;
    let url = "dg/banner/list"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);11000
        // let shopCategorys = res.data.data.shopCategorys;
        let bannerList = res.data.data.banners;
        // console.log("返回值是：" + res.data);
        that.setData({
          bannerList: bannerList
        })
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
  //商家优选点击
  bannerItem: function(e) {
    let id = e.currentTarget.dataset.id;
    console.log('banner id is :', id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }

})