<template>
  <div class="z_barrage-container">
    <canvas
      ref="canvasContainer"
      :width="containerWidth"
      :height="containerHeight"
      style="display: none;"
    />
    <div
      class="z_container"
      :style="{height: containerHeight/2+'px'}"
    >
      <canvas
        id="canvas"
        ref="canvas"
        class="z_barrage"
        :width="containerWidth"
        :height="containerHeight"
        :style="{'width': containerWidth/2 + 'px',
                 'height': containerHeight/2 + 'px'}"
      />
    </div>
  </div>
</template>

<script>
// import faceMap from '../../assets/emoji'
export default {
  name: 'Barrage',
  props: {
    barrageList: {
      type: Array,
      default: () => []
    },
    speed: {
      type: Number,
      default: 4
    },
    loop: {
      type: Boolean,
      default: true
    },
    channels: {
      type: Number,
      default: 2
    },
    barrageHeight: {
      type: Number,
      default: 60
    },
    screenPercent: {
      type: Number,
      default: 0.3
    },
    borderColor: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    },
    linearGradient: {
      type: Object,
      default: () => {
        return {
          startColor: '',
          endColor: ''
        }
      }
    }
  },
  data () {
    return {
      newBarrageArray: [], // 新增弹幕之后的总弹幕
      barrageArray: [],
      barrageQueue: [],
      containerWidth: 0,
      containerHeight: 0,
      channelsArray: [],
      barrageChannels: 1
    }
  },
  watch: {
    barrageList (val) {
      if (val.length !== 0) {
        this.barrageQueue = JSON.parse(JSON.stringify(val))
        this.newBarrageArray = JSON.parse(JSON.stringify(val))
        this.initData()
        window.requestAnimationFrame(this.render)
      }
    }
  },
  mounted () {
    this.containerWidth = document.body.clientWidth * 2
    this.containerHeight = window.screen.height * this.screenPercent > 2 * this.barrageHeight ? window.screen.height * this.screenPercent : (this.barrageHeight + 30) // 设定总高度
    this.barrageChannels = Math.floor(this.containerHeight / (this.barrageHeight + 30)) || this.channels // 总高度对应的轨道数
    this.ctx = this.$refs.canvas.getContext('2d')
    this.ctx1 = this.$refs.canvasContainer.getContext('2d')
    this.barrageClickEvent()
  },
  methods: {
    /**
       * 数据初始化
       */
    initData () {
      for (let i = 0; i < this.barrageQueue.length; i++) { // 此处处理只显示50个字符
        let tagImg = null
        let img = null
        if (this.barrageQueue[i].icon) {
          img = new Image()
          img.src = this.barrageQueue[i].icon
        }
        if (this.barrageQueue[i].tagImage) {
          tagImg = new Image()
          tagImg.src = this.barrageQueue[i].tagImage
        }
        let content = this.dealStr(this.barrageQueue[i].content)
        // let emojiArray = []
        // let index = 0
        // let tempContent = content.replace(/\[(.+?)\]/ig, function (match, p1) {
        //   index++
        //   emojiArray.push(p1)
        //   return '_fn'
        // })
        // let strArray = tempContent.split('_fn')
        // let dataArray = []
        // for (let i = 0; i < strArray.length; i++) {
        //   if (i < index) {
        //     dataArray.push(strArray[i])
        //     dataArray.push(emojiArray[i])
        //   } else {
        //     dataArray.push(strArray[i])
        //   }
        // }
        // dataArray = dataArray.filter((item) => item !== '')
        // let barrageContentArray = []
        // let left = 0
        // for (let j = 0; j < dataArray.length; j++) { // 转换为包含图片和文字的数组信息
        //   if (j === 0) {
        //     left = 0
        //   } else {
        //     left = barrageContentArray[j - 1].left + barrageContentArray[j - 1].width
        //   }
        //   // if (faceMap[dataArray[j]]) {
        //   //   let imgs = new Image()
        //   //   imgs.src = faceMap[dataArray[j]]
        //   //   barrageContentArray.push({
        //   //     width: 40,
        //   //     content: imgs,
        //   //     type: 'img',
        //   //     left: left
        //   //   })
        //   // } else {
        //     barrageContentArray.push({
        //       width: this.ctx1.measureText(dataArray[j]).width * 3,
        //       content: dataArray[j],
        //       type: 'txt',
        //       left: left
        //     })
        //   // }
        // }
        this.barrageArray.push({
          id: this.barrageQueue[i].id,
          content: content,
          x: this.containerWidth + this.barrageHeight,
          icon: img,
          tagImage: tagImg,
          width: this.ctx1.measureText(content).width * 3 + (this.barrageQueue[i].icon ? 60 : 0),
          color: this.barrageQueue[i].color || '#FFFFFF',
          bgColor: this.barrageQueue[i].bgColor || 'rgba(0,0,0,0.4)'
        })
      }
      this.initChannel()
    },
    /**
       * 初始化轨道数据
       */
    initChannel () {
      for (let i = 0; i < this.barrageChannels; i++) {
        let item = this.barrageArray.shift()
        if (item) {
          this.channelsArray[i] = [item]
        } else {
          this.channelsArray[i] = []
        }
      }
    },
    /**
     * 渲染
     */
    render () {
      this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight)
      this.ctx.font = '30px Microsoft YaHei'
      this.draw()
      window.requestAnimationFrame(this.render)
    },
    draw () {
      for (let i = 0; i < this.channelsArray.length; i++) {
        for (let j = 0; j < this.channelsArray[i].length; j++) {
          try {
            let barrage = this.channelsArray[i][j]
            barrage.x -= this.speed
            // console.log(barrage.x, this.containerWidth)
            if (barrage.x <= this.containerWidth) { // 弹幕显示
              this.borderColor && this.drawRoundRectBorder(this.ctx, barrage.x - this.barrageHeight / 2, i * (this.barrageHeight + 20) + 20, barrage.width + this.barrageHeight, this.barrageHeight, this.barrageHeight / 2)
              this.drawRoundRect(this.ctx, barrage.bgColor, barrage.x - this.barrageHeight / 2, i * (this.barrageHeight + 20) + 21, barrage.width + this.barrageHeight, this.barrageHeight - 2, this.barrageHeight / 2)
              this.ctx.fillStyle = `${barrage.color}`
              // for (let k = 0; k < barrage.content.length; k++) {
              //   if (barrage.content[k].type === 'img') { // 处理带表情和文字
              //     this.circleImg(this.ctx, barrage.content[k].content, barrage.x + (barrage.icon ? 40 : 0) + barrage.content[k].left, i * 60 + 12, 18)
              //   } else {
              //     this.ctx.fillText(barrage.content[k].content, barrage.x + (barrage.icon ? this.barrageHeight / 2 + 30 : 0) + barrage.content[k].left, i * (this.barrageHeight + 20) + this.barrageHeight)
              //   }
              // }
              this.ctx.fillText(barrage.content, barrage.x + (barrage.icon ? this.barrageHeight / 2 + 30 : 0) + barrage.content, i * (this.barrageHeight + 20) + this.barrageHeight)
              if (barrage.icon) {
                this.circleImg(this.ctx, barrage.icon, barrage.x + 5, i * (this.barrageHeight + 20) + 26, 24)
              }
              if (barrage.tagImage) {
                this.originImg(this.ctx, barrage.tagImage, barrage.x - this.barrageHeight, i * (this.barrageHeight + 20) + 20, this.barrageHeight, this.barrageHeight)
              }
            }
            if (barrage.x < -(barrage.width + this.barrageHeight)) { // 弹幕删除
              let arr = this.channelsArray.reduce((a, b) => a.concat(b))
              if (this.loop) {
                if (this.checkBarrageStatus(arr)) {
                  this.barrageQueue = []
                  this.barrageQueue = JSON.parse(JSON.stringify(this.newBarrageArray))
                  this.initData()
                }
              }
            }
            // 弹幕插入时机判断
            if (barrage.x <= Math.floor((this.containerWidth - barrage.width - 40)) && barrage.x >= Math.floor(this.containerWidth - barrage.width - 40 - this.speed) && (j === this.channelsArray[i].length - 1) && this.barrageArray.length !== 0) {
              let item = this.barrageArray.shift()
              this.channelsArray[i].push(item)
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
    },
    /**
     * 重置数据
     */
    add (obj) {
      let content = this.dealStr(obj.content)
      let img = null
      let tagImg = null
      if (obj.icon) {
        img = new Image()
        img.src = obj.icon
      }
      if (obj.tagImage) {
        tagImg = new Image()
        tagImg.src = obj.tagImage
      }
      // let emojiArray = []
      // let index = 0
      // let tempContent = content.replace(/\[(.+?)\]/ig, function (match, p1) {
      //   index++
      //   emojiArray.push(p1)
      //   return '_fn'
      // })
      // let strArray = tempContent.split('_fn')
      // let dataArray = []
      // for (let i = 0; i < strArray.length; i++) {
      //   if (i < index) {
      //     dataArray.push(strArray[i])
      //     dataArray.push(emojiArray[i])
      //   } else {
      //     dataArray.push(strArray[i])
      //   }
      // }
      // dataArray = dataArray.filter((item) => item !== '')
      // let barrageContentArray = []
      // let left = 0
      // for (let j = 0; j < dataArray.length; j++) { // 转换为包含图片和文字的数组信息
      //   if (j === 0) {
      //     left = 0
      //   } else {
      //     left = barrageContentArray[j - 1].left + barrageContentArray[j - 1].width
      //   }
      //   if (faceMap[dataArray[j]]) {
      //     let imgAdd = new Image()
      //     imgAdd.src = faceMap[dataArray[j]]
      //     barrageContentArray.push({
      //       width: 40,
      //       content: imgAdd,
      //       type: 'img',
      //       left: left
      //     })
      //   } else {
      //     barrageContentArray.push({
      //       width: this.ctx1.measureText(dataArray[j]).width * 3,
      //       content: dataArray[j],
      //       type: 'txt',
      //       left: left
      //     })
      //   }
      // }
      let item = {
        id: obj.id,
        content: content,
        x: this.containerWidth + this.barrageHeight,
        icon: obj.icon ? img : '',
        tagImage: obj.tagImage ? tagImg : '',
        width: this.ctx1.measureText(content).width * 3 + (obj.icon ? this.barrageHeight : 0),
        color: obj.color || '#FFFFFF',
        bgColor: obj.bgColor || 'rgba(0,0,0,0.4)'
      }
      let originItem = {
        id: obj.id,
        content: obj.content,
        icon: obj.icon,
        tagImage: obj.tagImage,
        color: obj.color || '#FFFFFF',
        bgColor: obj.bgColor || 'rgba(0,0,0,0.4)'
      }
      if (this.barrageArray.length === 0) { // 剩余弹幕数为0
        this.newBarrageArray.unshift(originItem)
      } else {
        this.barrageArray.unshift(item)
        let insertIndex = this.barrageList.length - this.barrageArray.length
        this.newBarrageArray.splice(insertIndex, 0, originItem)
      }
    },
    /**
     * 弹幕点击事件
     */
    barrageClickEvent () {
      document.getElementById('canvas').addEventListener('click', (e) => {
        const p = this.getEventPosition(e)
        let channelIndex = Math.floor(p.y / (this.barrageHeight + 30))
        const tempArray = JSON.parse(JSON.stringify(this.channelsArray[channelIndex]))
        for (let i = 0; i < tempArray.length; i++) {
          let channelItemArray = tempArray[i]
          if (p.x > channelItemArray.x && p.x < (channelItemArray.x + channelItemArray.width)) {
            if (channelItemArray.id) {
              this.$emit('doLike', channelItemArray.id)
            }
          }
        }
      }, false)
    },
    /**
     * 获取点击位置
     */
    getEventPosition (ev) {
      let x, y
      if (ev.layerX || ev.layerX === 0) {
        x = ev.layerX
        y = ev.layerY
      } else if (ev.offsetX || ev.offsetX === 0) {
        x = ev.offsetX
        y = ev.offsetY
      }
      return { x: 2 * x, y: 2 * y }
    },
    /**
     * 判断所有的弹幕是否滚动完成
     * @params arr
     */
    checkBarrageStatus (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].x > -arr[i].width) return false
      }
      return true
    },
    /**
       * 处理字符
       */
    dealStr (str) {
      return str.length > 50 ? `${str.substring(0, 50)}...` : str
    },
    /**
       * 获取随机颜色
       */
    getColor () {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`
    },
    /**
       * 裁剪图片
       * @param ctx
       * @param img
       * @param x
       * @param y
       * @param r
       */
    circleImg (ctx, img, x, y, r) {
      ctx.save()
      let d = 2 * r
      let cx = x + r
      let cy = y + r
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(img, x, y, d, d)
      ctx.restore()
      ctx.closePath()
    },
    /**
     * 绘制原始图片
     * @param ctx
     * @param img
     * @param x
     * @param y
     * @param width
     * @param height
     */
    originImg (ctx, img, x, y, width, height) {
      try {
        ctx.beginPath()
        ctx.drawImage(img, x, y, width, height)
        ctx.closePath()
      } catch (e) {
        console.log(e)
      }
    },
    /**
       * 绘画圆角矩形
       * @param context
       * @param bgColor
       * @param x
       * @param y
       * @param width
       * @param height
       * @param radius
       */
    drawRoundRect (context, bgColor, x, y, width, height, radius) {
      if (this.linearGradient.startColor && this.linearGradient.endColor) {
        let linearGrad = context.createLinearGradient(x, y, x, y + height)
        linearGrad.addColorStop(0, this.linearGradient.startColor)
        linearGrad.addColorStop(1, this.linearGradient.endColor)
        context.fillStyle = linearGrad || bgColor
      } else {
        context.fillStyle = this.background || bgColor
      }
      context.beginPath()
      context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2)
      context.lineTo(width - radius + x, y)
      context.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2)
      context.lineTo(width + x, height + y - radius)
      context.arc(width - radius + x, height - radius + y, radius, 0, Math.PI / 2)
      context.lineTo(radius + x, height + y)
      context.arc(radius + x, height - radius + y, radius, Math.PI / 2, Math.PI)
      context.fill()
      context.closePath()
    },
    /**
       * 绘画圆角矩形
       * @param context
       * @param x
       * @param y
       * @param width
       * @param height
       * @param radius 半径
       */
    drawRoundRectBorder (context, x, y, width, height, radius) {
      context.beginPath()
      context.lineWidth = 2
      context.strokeStyle = this.borderColor
      context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2)
      context.lineTo(width - radius + x, y)
      context.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2)
      context.lineTo(width + x, height + y - radius)
      context.arc(width - radius + x, height - radius + y, radius, 0, Math.PI / 2)
      context.lineTo(radius + x, height + y)
      context.arc(radius + x, height - radius + y, radius, Math.PI / 2, Math.PI)
      context.stroke()
      context.closePath()
    }
  }
}
</script>

<style lang="scss" scoped>
  .z_barrage-container {
    /*pointer-events: none;*/
  }
  .z_container {
    width: 100%;
    overflow: hidden;
  }
  .z_barrage {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
