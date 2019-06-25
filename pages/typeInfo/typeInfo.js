// pages/typeInfo/typeInfo.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
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
    ],
    showList:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.id!=undefined){
      let id = options.id;
      let typeId = options.typeId;
      let typeName = options.typeName;
      let subName = options.subName;
      console.log('typeId is:', typeId);
      this.setData({
        id:id,
        typeId: typeId,
        typeName: typeName,
        subName: subName
      })
      that.getSubTypeList();
    }else{
      let typeId = options.typeId;
      let typeName = options.typeName;
      this.setData({
        typeId: typeId,
        typeName: typeName
        
      })
      that.getTypeList();
    }
    
  },

  //获取一级分类列表
  getTypeList:function(e){
    let that = this;
    let id = that.data.typeId;
    let typeName = that.data.typeName;
    let district = wx.getStorageSync('district');
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');

    // console.log("id is... :", id);
    let url = "dg/shop/list"
    var params = {
      categoryPId: id,
      categoryPName: typeName,
      district: district,
      latFrom: latitude, //纬度
      lngFrom: longitude //经度
    }
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("商铺列表返回值是：" + res.data);
        let shopList = res.data.data.shops;
        if (shopList.length > 0) {
          that.setData({
            shopList: shopList
          })
        } else {
          that.setData({
            showList: false
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
  //获取二级分类
  getSubTypeList:function(){
    let that = this;
    let typeId = that.data.typeId;
    let id = that.data.id;
    let typeName = that.data.typeName;
    let subName = that.data.subName;
    let district = wx.getStorageSync('district');
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');

    // console.log("id is... :", id);
    let url = "dg/shop/list"
    var params = {
      categoryPId: typeId,
      categoryId: id,
      categoryPName:typeName,
      categoryName: subName,
      district: district,
      latFrom: latitude, //纬度
      lngFrom: longitude //经度
    }
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("商铺列表返回值是：" + res.data);
        let shopList = res.data.data.shops;
        if (shopList.length > 0) {
          that.setData({
            shopList: shopList
          })
        } else {
          that.setData({
            showList: false
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //菜单选择
  selectMenu:function(event){
    let menuIndex = event.currentTarget.dataset.index;
    // console.log('menuIndex is:', menuIndex);
  },
  //跳转到商铺详情
  toshopDetail: function (event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  }
  
})