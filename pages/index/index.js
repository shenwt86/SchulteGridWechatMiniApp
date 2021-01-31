//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用舒尔特方格练习程序',
    enterText: '去练习',
    userInfo: {},
    hasUserInfo: false,
    info:[
    '舒尔特方格 (Schulte Grid) 是在一张方形卡片上画上25个方格，格子内任意填写上阿拉伯数字1~25等共25个数字。',
    '训练时，要求被测者用手指按1~25的顺序依次指出其位置，同时诵读出声，施测者一旁记录所用时间。',
    '数完25个数字所用时间越短，注意力水平越高。'
  ],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  doPractice: function() {
    wx.navigateTo({
      url: '../practice/practice',
    })
  },
  showHistory:function() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '专注力训练，试试舒尔特方格',
      path: '/pages/index/index'
    }
  }
})
