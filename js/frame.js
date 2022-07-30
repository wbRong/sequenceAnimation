function SequenceFrame(options) {
  //获取参数
  this.options = {
    id: document.querySelector(options.id), //canvas的DOM节点
    width: options.width, //canvas高度
    height: options.height, //canvas宽度
    firstImg: options.firstImg, //默认显示的图片
    total: options.total, //长度
    speed: options.speed, //绘制的间隔时间
    loop: options.loop, //是否循环
    autoplay: options.autoplay, //图片加载完后是否播放(默认为true)
    imgType: options.imgType, //图片类型
    callback: options.callback, //动画结束后的回调函数
    img_num: options.img_num, //返回当前帧数，和总帧数
  };

  //初始化参数
  this.source = {};
  this.index = 1;
  this.imgNum = 1;
  this.timer = null;
  this.canvas = this.options.id;
  this.canvas.width = this.options.width;
  this.canvas.height = this.options.height;
  this.ctx = this.canvas.getContext('2d');
  this.srcImg = this.options.firstImg;
  this.imgPath = '';
  this.number;

  //加载图片
  this.imgLoad();
}

SequenceFrame.prototype = {
  constructor: SequenceFrame,

  imgLoad: function () {
    this.source[this.index] = new Image();
    this.number = this.index >= 10 ? this.index : '0' + this.index;
    this.imgPath = this.srcImg.split('_')[0] + '_' + this.number + this.options.imgType;
    this.source[this.index].src = this.imgPath;
    this.source[this.index].onload = function () {
      this.index++;
      if (this.index > this.options.total) {
        if (this.options.autoplay == undefined || this.options.autoplay) {
          //是否自动播放
          this.render();
        }
        if (this.options.firstImg) {
          this.ctx.drawImage(this.source[1], 0, 0, this.options.width, this.options.height);
        }
      } else {
        this.imgLoad();
      }
    }.bind(this);
  },

  render: function () {
    clearInterval(this.timer);
    this.timer = setInterval(this.playing.bind(this), this.options.speed);
  },

  playing: function () {
    //绘图函数
    var imgLength = this.options.total;
    if (this.imgNum <= imgLength) {
      if (typeof this.options.img_num === 'function') {
        this.options.img_num(this.imgNum, imgLength);
      }
      if (this.imgNum == imgLength && this.options.loop) {
        //循环播放
        this.imgNum = 1;
      } else if (this.imgNum == imgLength && !this.options.loop) {
        //播放一次后调用回调函数
        clearInterval(this.timer);
        if (typeof this.options.callback === 'function') {
          this.options.callback();
        }
      }
      //将图片绘制到canvas中
      this.ctx.clearRect(0, 0, this.options.width, this.options.height);
      this.ctx.drawImage(this.source[this.imgNum], 0, 0, this.options.width, this.options.height);
    }
    this.imgNum++;
  },

  replay: function () {
    //停止所有播放,手动调用播放
    clearInterval(this.timer);
    this.imgNum = 1;
    this.timer = setInterval(this.playing.bind(this), this.options.speed);
  },

  play: function () {
    //手动调用播放
    clearInterval(this.timer);
    this.timer = setInterval(this.playing.bind(this), this.options.speed);
  },

  pause: function () {
    //暂停播放
    clearInterval(this.timer);
  },
};

