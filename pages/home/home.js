// pages/home/home.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasNextList: false, //是否还有继续加载的数据
    pageIndex:1,
    subList: [],
    integral: 0,
    clicked: true,
    district: '',
    liveRooomList: [],
    shopCategorys: [],
    swiperList: [],
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
        number: 2,
        select: false
      },
      {
        name: "第2天",
        number: 2,
        select: false
      },
      {
        name: "第3天",
        number: 10,
        select: false
      },
      {
        name: "第4天",
        number: 3,
        select: false
      },
      {
        name: "第5天",
        number: 3,
        select: false

      },
      {
        name: "第6天",
        number: 15,
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

    // that.getLiveRoomList();
    // that.getSwiperList();
    // that.getShopCategory();
    // that.getBanner();

  },
  //获取附近商铺列表
  getShopList: function() {
    let that = this;
    let url = "dg/shop/list"
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');
    var params = {
      type: 3,
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
        // console.log("商铺列表返回值是：");
        let shopList = res.data.data.shops;
        // var jsonTarget = [];

        //提取自己所需要的数据
        // for (var i = 0; i < 10; i++) {
        //   // ids += dataArr[i].id + ",";
        //   jsonTarget.push({
        //     id: dataArr[i].id,
        //     name: dataArr[i].name,
        //     business_hours: dataArr[i].business_hours,
        //     categoryName: dataArr[i].categoryName,
        //     detailAddress: dataArr[i].detailAddress,
        //     distance: dataArr[i].distance,
        //     inStoreNum: dataArr[i].inStoreNum,
        //     pic: dataArr[i].pic,
        //     telephone: dataArr[i].telephone,
        //   });
        // }
      if (shopList.length==10){
        that.setData({
          hasNextList: true,
          shopList: shopList
        })
      }else{
        that.setData({
          shopList: shopList
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

  //获取用户地址
  getUserLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      // type: 'wgs84',
      success: function(res) {
        // console.log(res)
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        // let location = res.latitude
        let qqMapApi = 'https://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + res.latitude + ',' +
          res.longitude + "&key=34NBZ-PON6G-S5RQ3-IGP5R-RFZHZ-DYFUP" + "&get_poi=1";
        wx.request({
          url: qqMapApi,
          data: {

          },
          method: 'GET',
          success: (res) => {
            // console.log(res.data);
            // console.log(res.data.result.address_component.district)
            let district = res.data.result.address_component.district;
            wx.setStorageSync('district', district);

            //取位置名
            that.setData({
              district: district
            })
            if (district.length > 0) {
              that.getSwiperList();
              that.getShopList();
              that.getRecommendShopList();
            }
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
    // console.log('district is:', district);
    wx.setStorageSync('district', district);
    if (district.length != 0) {
      that.getShopList();
      that.getSwiperList();
      that.getRecommendShopList();
    }
    // that.getLiveRoomList();
    that.getShopCategory();
    // that.getBanner();
    that.getSignInfo();

    // that.setData();
  },
  //跳转到不同分类
  navigateToType: function(event) {
    let menuIndex = event.currentTarget.dataset.index;

  },
  //底部导航栏切换
  footerChange: function(event) {
    let footeIndex = event.currentTarget.dataset.index;
    // console.log('footeIndex is', footeIndex);
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
    // console.log('phone is:', telephone);
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
  //获取签到信息
  getSignInfo: function() {
    let that = this;

    let userId = wx.getStorageSync('userId');

    let url = "dg/sign/detail?userId=" + userId;
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          // that.getShopList();
          let isSign = res.data.data.isSign;
          let sineList = that.data.sineList;
          let signedTimes = res.data.data.signedTimes;
          let integral = res.data.data.integral;
          let addIntegral = sineList[signedTimes].number;
          let numberSigned = res.data.data.numberSigned;
          that.setData({
            numberSigned: numberSigned,
            addIntegral: addIntegral,
            integral: integral
          })
          if (isSign == 0) {

            for (var i = 0; i < signedTimes; i++) {
              if (i <= signedTimes) {
                sineList[i].select = true;
              }
            }
            that.setData({
              sineList: sineList,
              signedTimes: signedTimes,
              clicked: false,
            })
          } else {

            for (var i = 0; i < signedTimes; i++) {
              if (i < signedTimes) {
                sineList[i].select = true;
              }
            }
            that.setData({
              sineList: sineList,
              clicked: true,
              signedTimes: signedTimes
            })
          }
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
  //签到按钮
  sineInClick: function() {
    let that = this;
    let integral = that.data.integral;
    let sineList = that.data.sineList;
    let signedTimes = that.data.signedTimes;
    if (signedTimes == 6) {
      wx.navigateTo({
        url: '../convas/convas',
      })
    } else {
      let addedIntegral = sineList[signedTimes].number;
      let userId = wx.getStorageSync('userId');

      let url = "dg/sign/sign?userId=" + userId + "&addedIntegral=" + addedIntegral;
      // let url = "dg/sign/sign";
      var params = {
        userId: userId,
        addedIntegral: addedIntegral
      }
      let method = "PUT";
      wx.showLoading({
          title: '加载中...',
        }),
        network.POST(url, params, method).then((res) => {
          wx.hideLoading();
          if (res.data.code == 200) {
            // that.getShopList();
            // signedTimes = signedTimes+1;
            for (var i = 0; i <= signedTimes; i++) {
              if (i <= signedTimes) {
                sineList[i].select = true;
              }
            }
            that.getSignInfo();
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
          // console.log(errMsg); //错误提示信息
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
            duration: 1500,
          })
        });
      // wx.request({
      //   url: 'http://132.232.142.23:8088/api/dg/sign/sign?userId=1&addedIntegral=1', // 仅为示例，并非真实的接口地址
      //   data: {
      //     // x: '',
      //     // y: ''
      //   },
      //   method:'PUT',
      //   header: {
      //     // 'content-type': 'application/json' // 默认值
      //   },
      //   success(res) {
      //     console.log(res.data);
      //     if (res.data.code == 200) {
      //       // that.getShopList();
      //       // signedTimes = signedTimes+1;
      //       for (var i = 0; i <= signedTimes; i++) {
      //         if (i <= signedTimes) {
      //           sineList[i].select = true;
      //         }
      //       }
      //       that.setData({
      //         sineList: sineList,
      //         clicked: true
      //       })

      //       wx.showToast({
      //         title: '积分+' + addedIntegral,
      //         icon: 'success',
      //         duration: 1500,
      //       })
      //     }
      //   }
      // })
    }

  },
  //选择城市
  toMap: function() {
    wx.navigateTo({
      url: '../switchcity/switchcity',
    })
  },
  //跳转到商铺详情
  toShop: function(event) {
    let id = event.currentTarget.dataset.id;
    // console.log("id is", id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  //获取位置二次授权
  handler: function(e) {
    let that = this;
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
        // console.log(errMsg); //错误提示信息
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
    // console.log('index is:', index);

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
    let district = that.data.district;
    // console.log("district返回值是：", district);
    let url = "dg/carouselPicture/list"
    var params = {
      isIntegralShop: 0,
      district: district
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        let swiperList = res.data.data.carouselPictures;
        that.setData({
          swiperList: swiperList
        })
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
        for (var i = 0; i < shopCategorys.length; i++) {
          let temp = i + 1;
          shopCategorys[i].iconUrl = '../images/menu_' + temp + '.png';
        }
        let category1 = [];
        for (var i = 0; i < 5; i++) {
          category1.push(shopCategorys[i]);
        }
        let category2 = [];
        for (var i = 5; i < 10; i++) {
          category2.push(shopCategorys[i]);
        }

        that.setData({
          // shopCategorys: shopCategorys
          category1: category1,
          category2: category2
        })
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

  // 获取优选商家列表
  getRecommendShopList: function() {
    let that = this;
    let url = "dg/shop/list"
    var params = {
      type: 1,
      district: that.data.district,
      // latFrom: that.data.latitude, //纬度
      // lngFrom: that.data.longitude //经度
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("商铺列表返回值是：" + res.data);
        let shopList = res.data.data.shops;
       
          that.setData({
            bannerList: shopList,
          })
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
  //跳转到类型详情
  navigateToType: function(event) {
    let id = event.currentTarget.dataset.id;
    // console.log('type id is:', id);
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
        // console.log(errMsg); //错误提示信息
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
    // console.log('banner id is :', id);
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  //查看更多附近商家
  moreShop: function() {
    wx.navigateTo({
      url: '../moreShop/moreShop',
    })
  },
  //扫一扫
  scanCode: function() {
    let that = this;
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {

        let result = res.result;
        // console.log(result);
        var index = result.lastIndexOf("\=");
        let shopId = result.substring(index + 1, result.length);
        // console.log(shopId);
        if (shopId != undefined || shopId.length != 0) {
          // that.setData({
          //   shopId: shopId
          // })
          // that.showDialogBtn();
          wx.navigateTo({
            url: '../payment/payment?shopId=' + shopId,
          })
        }

        // return obj;
      }
    })
  },
  //子类一列
  showSub1: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    let typeName = e.currentTarget.dataset.name;
    let category1 = that.data.category1;
    let subList = category1[index].subList;
    if (subList == null) {
      wx.navigateTo({
        url: '../typeInfo/typeInfo?typeId=' + id + '&typeName=' + typeName,
      })
    } else {
      console.log('subList is:', subList);
      that.setData({
        typeId: id,
        subList1: subList,
        typeName: typeName
      })
    }
  },
  //子类二列
  showSub2: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    let typeName = e.currentTarget.dataset.name;
    console.log('id is:', id);
    let category2 = that.data.category2;
    // console.log('shopCategorys is:', shopCategorys);
    let subList = category2[index].subList;
    if (subList.length == 0) {
      wx.navigateTo({
        url: '../typeInfo/typeInfo?typeId=' + id + '&typeName=' + typeName,
      })
    } else {

      console.log('subList is:', subList);
      that.setData({
        typeId: id,
        subList2: subList,
        typeName: typeName
      })
    }
  },
  //根据二类跳转到类别详情
  toSubType: function(e) {
    let that = this;
    let typeId = that.data.typeId;
    let typeName = that.data.typeName;
    console.log('typeId is:', typeId);
    let id = e.currentTarget.dataset.id;
    let subName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../typeInfo/typeInfo?id=' + id + '&typeId=' + typeId + '&typeName=' + typeName + '&subName=' + subName,
    })
  },

  //加载分页
  loadMoreShop: function(e) {
    // let that = this;
    // let url = "dg/shop/list"
    // var params = {
    //   type: 1,
    //   district: that.data.district,
    //   // latFrom: that.data.latitude, //纬度
    //   // lngFrom: that.data.longitude //经度
    // }
    // let method = "GET";
    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    //   network.POST(url, params, method).then((res) => {
    //     wx.hideLoading();
    //     that.setData({
    //       shopList: newList,
    //       pageIndex: pageIndex
    //     })
    //   }).catch((errMsg) => {
    //     wx.hideLoading();
    //     // console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });




    let that = this;
     //获取当前加载的分页
    let pageIndex = that.data.pageIndex;
    pageIndex += 1; //加载当前页的下一页数据
    let url = "dg/shop/list"
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');
    var params = {
      pageIndex: pageIndex,
      type: 3,
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
        // console.log("商铺列表返回值是：");
        let shopList = res.data.data.shops;
        // var jsonTarget = [];

        //提取自己所需要的数据
        // for (var i = 0; i < 10; i++) {
        //   // ids += dataArr[i].id + ",";
        //   jsonTarget.push({
        //     id: dataArr[i].id,
        //     name: dataArr[i].name,
        //     business_hours: dataArr[i].business_hours,
        //     categoryName: dataArr[i].categoryName,
        //     detailAddress: dataArr[i].detailAddress,
        //     distance: dataArr[i].distance,
        //     inStoreNum: dataArr[i].inStoreNum,
        //     pic: dataArr[i].pic,
        //     telephone: dataArr[i].telephone,
        //   });
        // }
      
      //之前加载过的数据
      let oldList = that.data.shopList;
      // 将新一页的数据添加到原数据后面
      let newList = oldList.concat(shopList);
      if (shopList.length == 10) {
          that.setData({
            pageIndex:pageIndex,
            hasNextList: true,
            shopList: newList
          })
        } else {
          that.setData({
            hasNextList: false,
            shopList: newList
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
  //滚动条滚动到底部触发
  scrollLower:function(){
    let that = this;
    let hasNextList = that.data.hasNextList;//是否还有数据
    console.log('触发底部滚动条');
    if (hasNextList){
      that.loadMoreShop();
    }
  }
})