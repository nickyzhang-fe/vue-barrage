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
            channels: {
                type: Number,
                default: 2
            },
            borderColor: {
                type: String,
                default: 'rgba(0,0,0,0.75)'
            },
            background: {
                type: String,
                default: '#FFFFFF'
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
                barrageWidth: 0,
                barrageHeight: 0,
                channelsArray: [],
                waitArray: []
            }
        },
        watch: {
            barrageList (val) {
                if (val.length !== 0) {
                    this.barrageQueue = val
                    this.initData()
                    window.requestAnimationFrame(this.render)
                }
            }
        },
        mounted () {
            this.barrageWidth = document.body.clientWidth * 2
            this.barrageHeight = this.channels * 80
            this.ctx = this.$refs.canvas.getContext('2d')
            this.ctx1 = this.$refs.canvasContainer.getContext('2d')
        },
        methods: {
            /**
             * 数据初始化
             */
            initData () {
                for (let i = 0; i < this.barrageQueue.length; i++) { // 此处处理只显示50个字符
                    let content = this.dealStr(this.barrageQueue[i].content)
                    this.barrageArray.push({
                        content: content,
                        x: 1.5 * this.barrageWidth,
                        icon: this.barrageQueue[i].icon,
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
                for (let i = 0; i < this.channels; i++) {
                    let item = this.barrageArray.shift()
                    this.waitArray.push(item)
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
                            if (barrage.x <= 1.5 * this.barrageWidth) {
                                this.drawRoundRectBorder(this.ctx, barrage.x - 20, i * 60 + 5, barrage.width + 40, 50, 25)
                                this.drawRoundRect(this.ctx, barrage.x - 15, i * 60 + 10, barrage.width + 30, 41, 20)
                                this.ctx.fillStyle = `${barrage.color}`
                                this.ctx.fillText(barrage.content, barrage.x + (barrage.icon ? 40 : 0), i * 60 + 41)
                                if (barrage.icon) {
                                    let img = new Image()
                                    img.src = barrage.icon
                                    this.circleImg(this.ctx, img, barrage.x - 6, i * 60 + 12, 18)
                                }
                            }
                            if (barrage.x < -(barrage.width + 1.5 * this.barrageWidth)) {
                                let item = this.channelsArray[i].shift()
                                item.x = this.barrageWidth
                                if (this.loop) {
                                    let arr = this.channelsArray.reduce((a, b) => a.concat(b))
                                    if (arr.length === 0) {
                                        this.barrageQueue = []
                                        this.barrageQueue = this.waitArray
                                        this.waitArray = []
                                        this.initData()
                                    }
                                }
                            }
                            if (barrage.x <= (1.5 * this.barrageWidth - barrage.width - 60) && barrage.x >= (1.5 * this.barrageWidth - barrage.width - 60 - this.speed) && (j === this.channelsArray[i].length - 1) && this.barrageArray.length !== 0) {
                                let item = this.barrageArray.shift()
                                this.channelsArray[i].push(item)
                                this.waitArray.push(item)
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
                let item = {
                    content: content,
                    x: 1.5 * this.barrageWidth,
                    icon: obj.icon,
                    width: this.ctx1.measureText(content).width * 3 + (obj.icon ? 40 : 0),
                    color: obj.color || this.getColor()
                }
                this.barrageArray.unshift(item)
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
                var d = 2 * r
                var cx = x + r
                var cy = y + r
                ctx.beginPath()
                ctx.arc(cx, cy, r, 0, 2 * Math.PI)
                ctx.clip()
                ctx.drawImage(img, x, y, d, d)
                ctx.restore()
                ctx.closePath()
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
            drawRoundRectBorder (context, x, y, width, height, radius) {
                context.fillStyle = this.borderColor
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .barrage-container {
        pointer-events: none;
    }

    .container {
        width: 100%;
        overflow: hidden;
    }
</style>
