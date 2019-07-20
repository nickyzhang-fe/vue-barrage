<template>
    <div class="barrage-container">
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
        name: 'barrage',
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
                timer: null,
                pathWayIndex: 0, // 弹幕轨道值 递增
                addArray: [] // 新增弹幕
            }
        },
        watch: {
            barrageList (val) {
                if (val.length !== 0) {
                    this.initData()
                    this.render()
                }
            }
        },
        mounted () {
            this.barrageWidth = document.body.clientWidth * 2
            this.barrageHeight = this.channels * 50
            this.ctx = this.$refs.canvas.getContext('2d')
        },
        methods: {
            /**
             * 数据初始化
             */
            initData () {
                for (let i = 0; i < this.barrageList.length; i++) { // 此处处理只显示55个字符
                    let content = this.barrageList[i].content.length > 40 ? `${this.barrageList[i].content.substring(0, 40)}...` : this.barrageList[i].content
                    this.pushMessage(content, this.barrageList[i].color)
                }
            },
            /**
             * 增加数据
             * @param content
             * @param color
             */
            pushMessage (content, color) {
                let position = this.getPosition() // 确定跑道
                let x = this.barrageWidth // 初始位置
                let offsetWidth = 0
                for (let i = 0, len = this.barrageArray.length; i < len; i++) {
                    let item = this.barrageArray[i]
                    if (position === item.position) { // 如果是同跑道,则往后排
                        offsetWidth += Math.floor(this.ctx.measureText(item.content).width * 3 + 60)
                    }
                }
                this.barrageArray.push({
                    content: content,
                    x: x + offsetWidth,
                    originX: x + offsetWidth,
                    position: position,
                    width: this.ctx.measureText(content).width * 3,
                    color: color || this.getColor()
                })
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
            /**
             * 开始绘制 文字和背景
             */
            draw () {
                for (let i = 0, len = this.barrageArray.length; i < len; i++) {
                    let barrage = this.barrageArray[i]
                    try {
                        barrage.x -= this.speed
                        if (barrage.x < -barrage.width - 100) {
                            if (i === this.barrageArray.length - 1) { // 最后一条执行完后重新赋值位置
                                if (!this.loop) { // 判断是否循环，不循环执行cancelAnimationFrame
                                    cancelAnimationFrame(this.render)
                                    return
                                }
                                if (this.addArray.length !== 0) {
                                    this.barrageArray = this.barrageArray.concat(this.addArray)
                                    this.addArray = []
                                }
                                for (let j = 0; j < this.barrageArray.length; j++) {
                                    this.barrageArray[j].x = this.barrageArray[j].originX
                                }
                            }
                        }
                        if (barrage.x <= 2 * document.body.clientWidth + barrage.width) {
                            // 绘制背景
                            this.drawRoundRect(this.ctx, barrage.x - 15, barrage.position - 30, barrage.width + 30, 40, 20, `rgba(0,0,0,0.75)`)
                            this.ctx.fillStyle = `${barrage.color}`
                            this.ctx.fillText(barrage.content, barrage.x, barrage.position)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            },
            /**
             * 弹幕增加
             * @param obj
             */
            add (obj) {
                let position = this.getPosition() // 确定跑道高度
                let x = this.barrageWidth // 初始位置
                let offsetWidth = 0
                for (let i = 0, len = this.barrageArray.length; i < len; i++) {
                    let dm = this.barrageArray[i]
                    if (position === dm.position) { // 如果是同跑道,则往后排
                        offsetWidth += Math.floor(this.ctx.measureText(dm.content).width + 60)
                    }
                }
                this.addArray.push({
                    content: obj.content,
                    x: x + offsetWidth,
                    originX: x + offsetWidth,
                    position: position,
                    width: this.ctx.measureText(obj.content).width,
                    color: obj.color || this.getColor()
                })
            },
            /**
             * 获取文字位置
             * 使用pathWayIndex来确认每一条弹幕所在的轨道
             * 返回距离顶部的距离
             */
            getPosition () {
                let range = this.channels
                let top = (this.pathWayIndex % range) * 50 + 40
                this.pathWayIndex++
                return top
            },
            /**
             * 获取随机颜色
             */
            getColor () {
                return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
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
        overflow: hidden;
    }

    .container {
        width: 100%;
    }
</style>
