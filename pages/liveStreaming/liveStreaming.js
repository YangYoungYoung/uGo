// pages/liveStreaming/liveStreaming.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var webim = require('../../utils/webim_wx.js');
var webimhandler = require('../../utils/webim_handler.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 1334,
    showModalStatus: false,
    showModalDetail: false,
    inputSelect: false,
    message: '',
    avChatRoomId: '20190201',
    identifier: '', // 当前用户身份标识，必选
    userSig: 'eJw9j0uPgjAURv8LW4y20DqjiQvUYjA64SE*2DQNlKY6YsViNMb-LuIjuatzFt*5N2Mxi9pMKZlRpqldZkbfAEarwfyiZMkpyzUvawwxxhYAHyszXmiZy8ZV4gDf-CRFDeYkGHnkgv*i49T6h56bbMnaER0NZyxQu26VqE1c2MuJSdw8TDxHDqPYDok79X5stNqEwMTnFA3nfg8HkSl6Sbx1fLH3F50xCgaDz1i2o039sw8BAH8Rgt231HLPX91Wfda3nKXpoSo01VfFm3fvD6ZWTR0_', // 当前用户签名，必选
    nickName: '', // 当前用户昵称，选填
    msgContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
        that.setData({
          windowHeight: windowHeight
        })
      }
    })
    // let userId = options.userId;
    // that.setData({
    //   userId: userId
    // })
    // that.getLiveInfo();
    that.initIM();

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player');
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  // bindPlay() {
  //   this.ctx.play({
  //     success: res => {
  //       console.log('play success')
  //     },
  //     fail: res => {
  //       console.log('play fail')
  //     }
  //   })
  // },
  // bindPause() {
  //   this.ctx.pause({
  //     success: res => {
  //       console.log('pause success')
  //     },
  //     fail: res => {
  //       console.log('pause fail')
  //     }
  //   })
  // },
  // bindStop() {
  //   this.ctx.stop({
  //     success: res => {
  //       console.log('stop success')
  //     },
  //     fail: res => {
  //       console.log('stop fail')
  //     }
  //   })
  // },
  // bindResume() {
  //   this.ctx.resume({
  //     success: res => {
  //       console.log('resume success')
  //     },
  //     fail: res => {
  //       console.log('resume fail')
  //     }
  //   })
  // },
  // bindMute() {
  //   this.ctx.mute({
  //     success: res => {
  //       console.log('mute success')
  //     },
  //     fail: res => {
  //       console.log('mute fail')
  //     }
  //   })
  // },
  //弹出弹窗
  showModel: function() {
    let that = this;
    that.setData({
      showModalStatus: true
    })
  },
  //隐藏弹窗
  hideModal: function() {
    let that = this;
    that.setData({
      showModalStatus: false
    })
  },

  //加入购物车
  joinCart: function() {

  },

  //立即购买
  buyNow: function() {

  },
  //跳转到购物车
  toCart: function() {

  },
  //关闭弹窗
  closeModel: function() {
    let that = this;
    that.setData({
      showModalDetail: false
    })
  },
  //跳转到详情
  toDetail: function() {
    let that = this;
    that.setData({
      showModalDetail: false,
      showModalStatus: false,
    })
  },
  //点击弹出输入框
  inputSelectFunction: function() {
    let that = this;
    that.setData({
      inputSelect: true
    })
  },

  //发送评论
  sendMessage: function() {
    var that = this;
    var content = that.data.message;
    console.log('content is:', content);
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function() {
      that.clearInput();
    })
    that.setData({
      inputSelect: false
    })

  },
  textInput: function(e) {
    let message = e.detail.value;
    console.log(message);
    let that = this;
    that.setData({
      message: message
    })
  },
  //获取商品详情
  getShopDetail: function() {
    let that = this;
    let url = "goods?goodsId=1"
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {


        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
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



  //聊天室初始化
  initIM: function() {
    var that = this;
    var avChatRoomId = that.data.avChatRoomId;

    webimhandler.init({
      accountMode: 0, //帐号模式，0-表示独立模式，1-表示托管模式(已停用，仅作为演示)
      accountType: '36862',
      sdkAppID: '1400184416',
      avChatRoomId: avChatRoomId, //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      selType: webim.SESSION_TYPE.GROUP,
      selToID: avChatRoomId,
      selSess: null //当前聊天会话
    });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': '1400184416', //用户所属应用id,必填
      'appIDAt3rd': '1400184416', //用户所属应用id，必填
      'accountType': '36862', //用户所属应用帐号类型，必填
      'identifier': 'ugo1', //当前用户ID,必须是否字符串类型，选填
      'identifierNick': that.data.nickName || '', //当前用户昵称，选填
      'userSig': that.data.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };

    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify //用户自定义通知(默认全员接收) 
    };

    //监听连接状态回调变化事件
    var onConnNotify = function(resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          //webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": webimhandler.onConnNotify, //选填
      "onBigGroupMsgNotify": function(msg) {
        webimhandler.onBigGroupMsgNotify(msg, function(msgs) {
          that.receiveMsgs(msgs);
        })
      }, //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify, //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify //监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': true //是否开启控制台打印日志,默认开启，选填
    };

    webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
  },
  onUnload: function() {
    // 登出
    webimhandler.logout();
  },
  //点击小键盘
  bindConfirm: function(e) {
    var that = this;
    var content = e.detail.value;
    console.log('content is:', content);
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function() {
      that.clearInput();
    })
  },
  clearInput: function() {
    this.setData({
      msgContent: ""
    })
  },
  receiveMsgs: function(data) {
    console.log('receiveMsgs', data);
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    if (msgs.length > 7) {
      msgs.splice(0, msgs.length - 7)
    }

    this.setData({
      msgs: msgs
    })
  },
  //获取直播详情
  getLiveInfo: function() {
    let that = this;
    let userId = that.data.userId;

    let url = "zhiBo/room/" + userId;
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let location = res.data.data.location;
        let playUrl = res.data.data.playUrl;
        let pushUrl = res.data.data.pushUrl;
        let avatar = res.data.data.avatar;
        let nikeName = res.data.data.nikeName;
        that.setData({
          location: location,
          playUrl: playUrl,
          pushUrl: playUrl,
          avatar: avatar,
          nikeName: nikeName,
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
  }
})