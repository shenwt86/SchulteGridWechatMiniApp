// pages/practice.js
const app = getApp();
const util = require('../../utils/util.js')
const MAX_NUM = 25;
const NUM_ARR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    numbers: [],
    numbersChecked: [],
    status: 0,
    practiceTimer: 0,
    totalSeconds: 0,
    practiceHour: 0,
    practiceMin: 0,
    practiceSec: 0,
    practiceProgress: 0
  },

  changeNumbers: function () {
    this.setData({
      numbers: this.getNumbers()
    })
  },

  showTipToast:function(tip){
    wx.showToast({
      image:'../../res/images/info.png',
      title: tip
    });
  },

  commitNumber: function (event) {
    if(this.data.status !== 1) {
      this.showTipToast("没开始练习呢~");
      return;
    }

    var currentNum = parseInt(event.currentTarget.dataset.currentnum);

    var _numbersChecked = this.data.numbersChecked;
    if (_numbersChecked.length === 0 && currentNum !== 1) {
      this.showTipToast("错了~");
      return;
    }
    if (_numbersChecked.length > 0) {
      var _last = _numbersChecked[_numbersChecked.length - 1];
      if (currentNum !== _last + 1) {
        this.showTipToast("错了~");
        return;
      }
    }
    this.data.numbersChecked.push(currentNum);
    var _practiceProgress = parseInt((this.data.numbersChecked.length/MAX_NUM)*100);

    this.setData({
      practiceProgress:_practiceProgress
    })

    if (this.data.numbersChecked.length >= MAX_NUM) {
      this.stopTimer();
      var timeArr = this.buildPracticeTime(this.data.totalSeconds);
      var _that = this;
      var userName = this.data.userInfo.nickName;
      var userAvatar = this.data.userInfo.avatarUrl;
      this.savePracticeLog(userAvatar, userName,timeArr, new Date(), this.data.numbers);
      wx.showModal({
        title:'目标达成',
        showCancel: false,
        confirmText:'再试试',
        content: '用时:'+timeArr[0]+"小时"+timeArr[1]+"分"+timeArr[2]+"秒",
        success(res){
          if(res.confirm){
            _that.resetData();
          }
        }
      })
    }
  },

  savePracticeLog:function(userAvatar,userName,practiceTime,dateTime,numbers) {
    var key = app.globalData.practiceLogStorageKey;
    var logData = wx.getStorageSync(key);

    if(!logData) {
      logData = [];
    }

    logData.push({
      userAvatar:userAvatar,
      userName:userName,
      practiceTime:practiceTime,
      dateTime:util.formatTime(dateTime),
      numbers:numbers
    });

    wx.setStorage({
      data: logData,
      key: app.globalData.practiceLogStorageKey,
    })
  },

  startPractice: function () {
    var timer = setInterval(this.processTime, 1000);
    this.setData({
      status: 1,
      practiceTimer: timer
    });
  },

  processTime: function () {
    var _totalSeconds = this.data.totalSeconds;
    _totalSeconds = _totalSeconds + 1;
    var timeArr = this.buildPracticeTime(_totalSeconds);
    this.setData({
      totalSeconds: _totalSeconds,
      practiceSec: timeArr[2],
      practiceMin: timeArr[1],
      practiceHour: timeArr[0]
    })
  },

  buildPracticeTime: function (totalSeconds) {
    var timeArr = [];
    var _sec = totalSeconds % 60;
    var _min = (parseInt(totalSeconds / 60)) % 60;
    var _hour = (parseInt(totalSeconds / 3600)) % 24;
    timeArr.push(_hour);
    timeArr.push(_min);
    timeArr.push(_sec);
    return timeArr;
  },

  stopPractice: function () {
    this.stopTimer();
    this.resetData();
  },

  resetData: function () {
    this.setData({
      status: 0,
      totalSeconds: 0,
      practiceSec: 0,
      practiceMin: 0,
      practiceHour: 0,
      numbersChecked: [],
      practiceProgress:0
    })
  },

  stopTimer: function () {
    var timer = this.data.practiceTimer;
    if (timer === 0) {
      return;
    }
    clearInterval(this.data.practiceTimer);
  },

  getNumbers: function () {
    var numbers = NUM_ARR.sort(function () {
      return Math.random() - 0.5;
    });
    var numbersD2 = [];
    for (let index = 0; index < 5; index++) {
      var begin = index * 5;
      var end = begin + 5;
      numbersD2[index] = numbers.slice(begin, end);
    }
    return numbersD2;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _numbers = this.getNumbers();
    this.setData({
      numbers: _numbers
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '专注力训练，试试舒尔特方格',
      path: '/pages/index/index'
    }
  }
})