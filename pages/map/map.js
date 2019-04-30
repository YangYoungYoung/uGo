// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: [{
        name: "易县"
      },
      {
        name: "保定"
      },
      {
        name: "北京"
      }
    ],
    letters: [
      "A", "B", "C", 'D', "E", "F", "G", "H", "I", "J", 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
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
  //选择不同的字母
  letterClick:function(event){
    let letter = event.currentTarget.dataset.letter;
    // console.log('letter is:', letter);
  }
  
})