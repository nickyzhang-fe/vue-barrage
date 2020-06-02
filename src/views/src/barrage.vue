<template>
    <div class="barrage-container">
        <canvas
                ref="canvasContainer"
                :width="barrageWidth"
                :height="barrageHeight"
                style="display: none;"
        />
        <div
                class="container"
                :style="{height: barrageHeight/2+'px'}"
        >
            <canvas
                    id="canvas"
                    ref="canvas"
                    :width="barrageWidth"
                    :height="barrageHeight"
                    :style="{'width': barrageWidth/2 + 'px',
                 'height': barrageHeight/2 + 'px'}"
            />
        </div>
    </div>
</template>

<script>
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
            itemHeight: {
                type: Number,
                default: 60
            },
            channels: {
                type: Number,
                default: 2
            },
            borderColor: {
                type: String,
                default: 'red'
            },
            background: {
                type: String,
                default: '#000'
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
                barrageArray: [],
                barrageQueue: [],
                newBarrageArray: [],
                barrageWidth: 0,
                barrageHeight: 0,
                channelsArray: [],
                waitArray: []
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
            this.barrageWidth = document.body.clientWidth * 2
            this.barrageHeight = this.channels * 100
            this.ctx = this.$refs.canvas.getContext('2d')
            this.ctx1 = this.$refs.canvasContainer.getContext('2d')
            // document.getElementById('canvas').addEventListener('click', (e) => {
            //     const p = this.getEventPosition(e);
            //     let channelIndex = Math.ceil(p.y / 70)
            //     const tempArray = JSON.parse(JSON.stringify(this.channelsArray[channelIndex]))
            //     for (let i = 0; i < tempArray.length; i++) {
            //         let channelItemArray = tempArray[i]
            //         // if (2*p.x > channelItemArray.x && 2*p.x < (channelItemArray.x + channelItemArray.width)) {
            //         //     console.log(channelItemArray)
            //         // }
            //     }
            // }, false);
        },
        methods: {
            getEventPosition(ev){
                var x, y;
                if (ev.layerX || ev.layerX == 0) {
                    x = ev.layerX;
                    y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX == 0) {
                    x = ev.offsetX;
                    y = ev.offsetY;
                }
                return {x: x, y: y};
            },
            /**
             * 数据初始化
             */
            initData () {
                for (let i = 0; i < this.barrageQueue.length; i++) { // 此处处理只显示50个字符
                    let content = this.dealStr(this.barrageQueue[i].content)
                    let tempIcon = this.barrageQueue[i].icon
                    let tempTagImage = this.barrageQueue[i].tagImage
                    let icon = null
                    let tagImage = null
                    if (typeof tempIcon === 'object' && tempIcon instanceof Image) {
                        icon = tempIcon
                    }
                    if (typeof tempIcon === 'string') {
                        let img = new Image()
                        img.src = tempIcon
                        icon = img
                    }
                    if (typeof tempTagImage === 'object' && tempTagImage instanceof Image) {
                        tagImage = tempTagImage
                    }
                    if (typeof tempTagImage === 'string') {
                        let img = new Image()
                        img.src = tempTagImage
                        tagImage = img
                    }
                    this.barrageArray.push({
                        content: content,
                        x: this.barrageWidth,
                        icon: icon,
                        tagImage: tagImage,
                        width: this.ctx1.measureText(content).width * 3 + (this.barrageQueue[i].icon ? 40 : 0),
                        color: this.barrageQueue[i].color || this.getColor()
                    })
                }
                this.initChannel()
            },
            /**
             * 初始化轨道数据
             */
            initChannel () {
                let tempArray = []
                for (let i = 0; i < this.channels; i++) {
                    let item = this.barrageArray.shift()
                    // this.waitArray.push(item)
                    if (item) {
                        this.channelsArray[i] = [item]
                        tempArray[i] = [item]
                    } else {
                        this.channelsArray[i] = []
                        tempArray[i] = []
                    }
                }
            },
            /**
             * 渲染
             */
            render () {
                this.ctx.clearRect(0, 0, this.barrageWidth, this.barrageHeight)
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
                            // 判断出现时机
                            if (barrage.x <= this.barrageWidth) {
                                this.borderColor && this.drawRoundRectBorder(this.ctx, barrage.x - this.itemHeight / 2, i * (this.itemHeight + 20) + 20, barrage.width + this.itemHeight, this.itemHeight, this.itemHeight / 2)
                                this.drawRoundRect(this.ctx, barrage.x - this.itemHeight / 2, i * (this.itemHeight + 20) + 21, barrage.width + this.itemHeight, this.itemHeight - 2, this.itemHeight / 2)
                                this.ctx.fillStyle = `${barrage.color}`
                                this.ctx.fillText(barrage.content, barrage.x + (barrage.icon ? this.itemHeight / 2 + 12 : 0), i * (this.itemHeight + 20) + this.itemHeight)
                                if (barrage.icon) {
                                    this.circleImg(this.ctx, barrage.icon, barrage.x - this.itemHeight / 4, i * (this.itemHeight + 20) + 26, 24)
                                }
                                if (barrage.tagImage) {
                                    this.originImg(this.ctx, barrage.tagImage, barrage.x - this.itemHeight - 20, i * (this.itemHeight + 20) + 20, this.itemHeight, this.itemHeight)
                                }
                            }
                            if (barrage.x < -(barrage.width + 30)) { // 删除时机
                                this.channelsArray[i].shift()
                                // let item = this.channelsArray[i].shift()
                                // item.x = this.barrageWidth
                                if (this.loop) {
                                    let arr = this.channelsArray.reduce((a, b) => a.concat(b))
                                    if (this.checkBarrageStatus(arr)) {
                                        this.barrageQueue = []
                                        // this.barrageQueue = JSON.parse(JSON.stringify(this.waitArray))
                                        this.barrageQueue = JSON.parse(JSON.stringify(this.newBarrageArray))
                                        // this.waitArray = []
                                        this.initData()
                                    }
                                    // if (arr.length === 0) {
                                    //     this.barrageQueue = []
                                    //     this.barrageQueue = this.waitArray
                                    //     this.waitArray = []
                                    //     this.initData()
                                    // }
                                }
                            }
                            // 插入时机
                            if (barrage.x <= Math.floor(this.barrageWidth - barrage.width - this.itemHeight - 40) && barrage.x >= Math.floor(this.barrageWidth - barrage.width - this.itemHeight - 40 - this.speed) && (j === this.channelsArray[i].length - 1) && this.barrageArray.length !== 0) {
                                let item = this.barrageArray.shift()
                                this.channelsArray[i].push(item)
                                // this.waitArray.push(item)
                                // console.log(this.waitArray)
                                // console.log(this.channelsArray)
                                // setTimeout(() => {
                                //     if (this.loop) {
                                //         this.barrageQueue = []
                                //         this.barrageQueue = this.waitArray
                                //         this.waitArray = []
                                //         this.initData()
                                //     }
                                // }, 828 / 4 * 17)
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
                let img = new Image()
//                img.addEventListener('load', this.addObj(obj, img), false);
                img.load = () => {
                    let item = {
                        content: content,
                        x: this.barrageWidth,
                        icon: obj.icon ? img : '',
                        width: this.ctx1.measureText(content).width * 3 + (obj.icon ? 40 : 0),
                        color: obj.color || this.getColor()
                    }
                    this.barrageArray.unshift(item)
                }
                img.src = obj.icon || ''
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
                try {
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
                } catch (e) {
                    console.log(e)
                }
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
             * @param x
             * @param y
             * @param width
             * @param height
             * @param radius
             */
            drawRoundRect (context, x, y, width, height, radius) {
                if (this.linearGradient.startColor && this.linearGradient.endColor) {
                    let linearGrad = context.createLinearGradient(x, y, x, y + height)
                    linearGrad.addColorStop(0, this.linearGradient.startColor)
                    linearGrad.addColorStop(1, this.linearGradient.endColor)
                    context.fillStyle = linearGrad
                } else {
                    context.fillStyle = this.background
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

<style lang="less" scoped>
    .barrage-container {
        // pointer-events: none;
    }

    .container {
        width: 100%;
        overflow: hidden;
    }
</style>
