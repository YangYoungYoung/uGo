import {
  LETTERS,
  HOT_CITY_LIST
} from '../../locale/citydata'
import {
  AutoPredictor
} from '../../utils/autoPredictor'
import utils from '../../utils/utils'

const {
  isNotEmpty,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl
} = utils;
const appInstance = getApp();

Page({
  data: {
    sideBarLetterList: [],
    winHeight: 0,
    cityList: [],
    hotCityList: HOT_CITY_LIST,
    showChosenLetterToast: false,
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    city: "定位中",
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: false,
  },
  onLoad: function() {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({
      name: letter
    }));
    this.setData({
      winHeight,
      sideBarLetterList,
      cityList: cityListSortedByInitialLetter
    });
    // 定位
    this.getLocation();
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function() {
    // 生命周期函数--监听页面显示

  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  },

  touchSideBarLetter: function(e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
    this.setData({
      toastShowLetter: chosenLetter,
      showChosenLetterToast: true,
      scrollTopId: chosenLetter,
    })
    // close toast of chosenLetter
    setTimeout(() => {
      this.setData({
        showChosenLetterToast: false
      })
    }, 500)
  },
  //选择城市
  chooseCity: function(e) {
    const {
      city,
      code
    } = safeGet(['currentTarget', 'dataset'], e)
    this.setData({
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
      county: ''
    })
    this.getCountyList()

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    // console.log(appInstance.globalData.defaultCity)
  },
  //选择区县
  chooseCounty: function(e) {
    const county = safeGet(['currentTarget', 'dataset', 'city'], e)
    this.setData({
      county
    })
    appInstance.globalData.defaultCounty = county
    // 返回首页

    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

    let prevPage = pages[pages.length - 2];

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。

      district: county

    })

    //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。


    //最后就是返回上一个页面。

    wx.navigateBack({

      delta: 1 // 返回上一级页面。

    })

    // wx.switchTab({ url: getIndexUrl() })
  },

  //点击热门城市回到顶部
  hotCity: function() {
    this.setData({
      scrollTop: 0
    })
  },
  bindScroll: function(e) {
    // console.log(e.detail)
  },
  getCountyList: function() {
    // console.log("正在获取区县");
    const code = this.data.currentCityCode

    wx.request({
      url: getCountyListUrl(code),
      success: res => {
        const resultArray = safeGet(['data', 'result'], res)
        const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
        // console.log(countyList)
        this.setData({
          countyList
        })
      },
      fail: () => {
        // console.error("请求区县失败，请重试")
      }
    })
  },
  getLocation: function() {
    // console.log("正在定位城市");
    this.setData({
      county: ''
    })

    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const {
          latitude,
          longitude
        } = res
        wx.request({
          url: getLocationUrl(latitude, longitude),
          success: res => {
            const {
              city,
              adcode,
              district
            } = safeGet(['data', 'result', 'ad_info'], res)
            this.setData({
              city,
              currentCityCode: adcode,
              county: district
            })
            // console.log(city)
            appInstance.globalData.defaultCity = city
            // this.getCountyList();
          }
        })
      },
      fail: () => {
        // console.error("定位失败，请重试")
      }
    })
  },
  reGetLocation: function() {
    const {
      city,
      county
    } = this.data
    appInstance.globalData.defaultCity = city
    appInstance.globalData.defaultCounty = county
    // console.log(appInstance.globalData.defaultCity);
    //返回首页
    wx.switchTab({
      url: getIndexUrl()
    })
  },
  // 失焦时清空输入框
  bindBlur: function(e) {
    this.setData({
      inputName: '',
      completeList: []
    })
  },
  // 输入框输入时
  bindKeyInput: function(e) {
    let inputName = e.detail.value.trim()
    this.setData({
      inputName
    })
    if (!inputName) {
      this.setData({
        completeList: []
      })
    }
    this.useAutoPredictor(inputName)
  },
  // 输入框自动联想搜索
  useAutoPredictor: function(content) {
    let autoPredictor = new AutoPredictor(content)
    let completeList = autoPredictor.associativeSearch()
    this.setData({
      completeList
    })
  },
})