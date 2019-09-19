var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
var util = require("../../utils/util.js");
var app = getApp();

Page({

  //奖品配置
  awardsConfig: {
    chance: true,
    awards: [{
        'index': 0,
        'name': '28积分'
      },
      {
        'index': 1,
        'name': '38积分'
      },
      {
        'index': 2,
        'name': '58积分'
      },
      {
        'index': 3,
        'name': '68积分'
      },
      {
        'index': 4,
        'name': '88积分'
      },
      {
        'index': 5,
        'name': '100积分'
      }
    ]
  },

  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
  },
  onLoad: function(e) {
    let that = this;
    let numberArr = [];
    for (var i = 0; i < 100; i++) {
      if (i < 59) {
        numberArr.push(28);
      } else if (i < 81 && i >= 59) {
        numberArr.push(38);
      } else if (i < 90 && i >= 81) {
        numberArr.push(58);
      } else if (i < 96 && i >= 80) {
        numberArr.push(68);
      } else if (i < 99 && i >= 86) {
        numberArr.push(88);
      } else if (i < 100 && i >= 89) {
        numberArr.push(100);
      }
    }
    // console.log('numberArr is:', numberArr);
    that.setData({
      numberArr: numberArr
    })
  },

  onReady: function(e) {
    this.drawAwardRoundel();
  },

  //画抽奖圆盘
  drawAwardRoundel: function() {
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length; // 文字旋转 turn 值

    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awards[i].name
      });
    }

    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList
    });
  },

  //发起抽奖
  playReward: function() {
    //中奖index
    //随机获奖结果
    let that = this;
    let numberArr = that.data.numberArr;
    let rand = Math.floor(Math.random() * 100);
    let number = numberArr[rand];
    let rand2 = Math.floor(Math.random() * 100);
    let temp = numberArr[rand2];
    // console.log('number is : ', numberArr[rand]);
    // console.log("rand is:", rand); //取一个随机的旋转角度，使获奖结果随机化。
    if (number == 28) {
      // n = rand - (rand % 60) + 1440; //1440为旋转基数，最低要旋转1440度，即4圈。rand-(rand%60) 这个是让指针永远停在扇形中心的算法。n + 是为了重复点击的时候有足够的旋转角度。
      // console.log(n%360);
      var awardIndex = 0;
    } else if (number == 38) {
      var awardIndex = 1;
    } else if (number == 58 && rand2 > 10) {
      var awardIndex = 2;
    } else if (number == 68 && rand2 > 20) {
      var awardIndex = 3;
    } else if (number == 88 && rand2 > 50) {
      var awardIndex = 4;
    } else if (number == 100 && temp == 5000) {
      var awardIndex = 5;
    }
    that.sineInClick(number);
    // var awardIndex = 2;
    var runNum = 8; //旋转8周
    var duration = 4000; //时长
    // 旋转角度
    this.runDeg = this.runDeg || 0;
    this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))
    //创建动画
    var animationRun = wx.createAnimation({
      duration: duration,
      timingFunction: 'ease'
    })
    animationRun.rotate(this.runDeg).step();
    this.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    });



  },
  //签到按钮
  sineInClick: function(number) {
    let that = this;
    // let integral = that.data.integral;
    // let sineList = that.data.sineList;
    // let signedTimes = that.data.signedTimes;
    // console.log('number is:',number);

    let addedIntegral = number;
    let userId = wx.getStorageSync('userId');

    let url = "dg/sign/sign?userId=" + userId + "&addedIntegral=" + addedIntegral;
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
          // 中奖提示
          var awardsConfig = this.awardsConfig;
          
          setTimeout(function() {
            wx.showModal({
              
              title: '恭喜',
              // content: '获得' + (awardsConfig.awards[awardIndex].name),
              content: '获得' + number+"积分",
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //点击取消,默认隐藏弹框
                  // console.log('navigateBack。。。。。。。。。。。。。。。');
                  wx.navigateBack({
                    delta: 1
                  })
                  // wx.redirectTo({
                  //   url: '',
                  // })
                }
              },
            });
            this.setData({
              btnDisabled: ''
            });
          }.bind(this), 4000);
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        // wx.showToast({
        //   title: '网络错误',
        //   icon: 'loading',
        //   duration: 1500,
        // })
      });
  }
})