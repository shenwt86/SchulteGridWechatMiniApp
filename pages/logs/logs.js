//logs.js
const app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var logs = (wx.getStorageSync(app.globalData.practiceLogStorageKey) || []);
    this.setData({
      logs: (logs)
    })
  }
})
