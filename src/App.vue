<template>
    <div id="app">
        <barrage
                ref="barrage"
                class="barrage"
                :barrage-list="barrageList"
                :speed="speed"
                :loop="loop"
                :channels="channels"
                :background="background"
                :border-color="borderColor"/>
        <div @click="add" style="margin-top: 300px;">增加</div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
    import Barrage from './views/src/index'
    //    import Barrage from 'vue-barrage'
    export default {
        name: 'app',
        components: {
            Barrage,
        },
        data(){
            return {
                msg: '评论信息评论信息',
                barrageIsShow: true,
                currentId: 0,
                barrageList: [],
                speed: 5,
                loop: true,
                channels: 3,
                background: '#FFFFFF',
                borderColor: 'rgb(233,195,237)'
            }
        },
        mounted () {
            setTimeout(() => {
                this.barrageList = [{
                    icon: 'https://user-gold-cdn.xitu.io/2019/3/3/169412b9920a8e31?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    content: '1试数据测试数测试数据数测试数据',
                    color: 'white'
                }, {
                    icon: 'https://user-gold-cdn.xitu.io/2019/3/3/169412b9920a8e31?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    content: '2数据测试数据测试数据测试数据测试数据测试数据',
                    color: 'orange'
                }, {
                    icon: 'https://user-gold-cdn.xitu.io/2019/3/3/169412b9920a8e31?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    content: '3测试数据测试数据测试数据测试数据测试数据数据测试数据',
                    color: 'red'
                }, {
                    icon: 'https://user-gold-cdn.xitu.io/2019/3/3/169412b9920a8e31?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    content: '4试数据测测试数据测试数据测试数据测试数据测试数据试据',
                    color: 'blue'
                }, {
                    content: '5测试数据测试数据测试数据测试数据测试数据',
                    color: 'green'
                }, {
                    content: '6测试数据测试数据数据测试数据',
                    color: 'white'
                }, {
                    content: '7测试数据测试数数据测试数据测试数据测试数据测试数据',
                }, {
                    content: '测试据测试据测试据测试据测试据测试据',
                    color: 'white'
                }, {
                    content: '测试数据测试数据测试数据测试数'
                }, {
                    content: '测试数据测试数据测试数数据测试数据',
                    color: 'white'
                }, {
                    content: '测试数据测据测试数据测试数据'
                }, {
                    content: '测试数据测试数据测试数据测试数据测试数据',
                    color: 'white'
                }, {
                    content: '测试数据测试测试数据测试数据测试数据',
                }, {
                    content: '测试数据测试数据测试数据测试数据测试数据'
                }, {
                    content: '测试数据测试测试数据测试试测试数据测试',
                    color: 'white'
                }, {
                    content: '测试数据测试数据测试数数据测试数据',
                }, {
                    content: '测试数据测据测试数据测试数据'
                }, {
                    content: '测试数据测数据测试数据',
                    color: 'white'
                }]
            }, 500)
        },
        methods: {
            add(){
                this.$refs.barrage.add({
                    content: '增加一条新的弹幕增加一条新的弹幕', color: 'white'
                })
            }
        }
    }
</script>
<style lang="less">
    .barrage {
        position: fixed;
        top: 0;
        width: 100%;
        height: 250px;
        z-index: 1;
        background: rgba(70, 126, 120);
    }

    body {
        margin: 0;
        padding: 0;
        font-size: 50px;
    }
</style>
