<template>
    <div class="barrage-container">
        <canvas
                ref="canvasContainer"
                :width="barrageWidth"
                :height="barrageHeight"
                style="display: none;"></canvas>
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
            }
        },
        data () {
            return {
                barrageArray: [], // 缓存弹幕数据的数组
                barrageWidth: 0,
                barrageHeight: 0,
                channelsArray: []
            }
        },
        watch: {
            barrageList (val) {
                if (val.length !== 0) {
                    this.initData()
                    window.requestAnimationFrame(this.render)
                }
            }
        },
        mounted () {
            this.barrageWidth = document.body.clientWidth * 2
            this.barrageHeight = this.channels * 50
            this.ctx = this.$refs.canvas.getContext('2d')
            this.ctx1 = this.$refs.canvasContainer.getContext('2d')
        },
        methods: {
            /**
             * 数据初始化
             */
            initData () {
                for (let i = 0; i < this.barrageList.length; i++) { // 此处处理只显示55个字符
                    let content = this.barrageList[i].content.length > 55 ? `${this.barrageList[i].content.substring(0, 55)}...` : this.barrageList[i].content
                    this.barrageArray.push({
                        text: content,
                        x: this.barrageWidth,
                        width: this.ctx1.measureText(content).width * 3,
                        color: this.barrageList[i].color || this.getColor()
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
                            if (barrage.x <= this.barrageWidth) {
                                this.drawRoundRect(this.ctx, barrage.x - 15, i * 46 + 8, barrage.width + 30, 40, 20, `rgba(0,0,0,0.75)`)
                                this.ctx.fillStyle = `${barrage.color}`
                                this.ctx.fillText(barrage.text, barrage.x, i * 46 + 39)
                            }

                            if (barrage.x < -(barrage.width + this.barrageWidth)) {
                                let item = this.channelsArray[i].shift()
                                item.x = this.barrageWidth
                                if (this.loop){
                                    let arr = this.channelsArray.reduce((a, b) => a.concat(b))
                                    if (arr.length === 0){
                                        this.initData()
                                    }
                                }
                            }
                            if (barrage.x <= (this.barrageWidth - barrage.width - 50) && barrage.x >= (this.barrageWidth - barrage.width - 50 - this.speed) && (j === this.channelsArray[i].length - 1) && this.barrageArray.length !== 0) {
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
                let item = {
                    text: obj.content,
                    x: this.barrageWidth,
                    width: this.ctx1.measureText(obj.content).width * 3,
                    color: obj.color || this.getColor()
                }
                this.barrageArray.unshift(item)
            },
            /**
             * 获取随机颜色
             */
            getColor () {
                return `#${Math.floor(Math.random() * 16777215).toString(16)}`
            },
            /**
             * 绘画圆角矩形
             * @param context
             * @param x
             * @param y
             * @param width
             * @param height
             * @param radius
             * @param color
             */
            drawRoundRect (context, x, y, width, height, radius, color) {
                context.beginPath()
                context.fillStyle = color
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
