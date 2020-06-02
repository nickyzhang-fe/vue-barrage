<!--
 * @Author: your name
 * @Date: 2020-01-16 23:36:57
 * @LastEditTime: 2020-03-19 15:16:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-barrage/src/App.vue
 -->
<template>
    <div id="app">
        <barrage
                ref="barrage"
                class="barrage"
                :barrage-list="barrageList"
                :speed="speed"
                :loop="loop"
                :channels="channels"
                :screen-percent="0.3"
                v-on:doLike="DoLike"/>
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
                borderColor: 'red'
            }
        },
        mounted () {
            setTimeout(() => {
                this.barrageList = [{
                    id: 1,
                    tagImage: 'https://imgservices-1252317822.image.myqcloud.com/image/20200317/fx4jitwuvb.png',
                    icon: 'https://imgservices-1252317822.image.myqcloud.com/image/20200317/fx4jitwuvb.png',
                    content: '1试数据测试数测试试数据',
                    color: 'orange',
                    bgColor: 'black'
                }, {
                    id: 2,
                    tagImage: 'https://imgservices-1252317822.image.myqcloud.com/image/20200317/fx4jitwuvb.png',
                    icon: 'https://imgservices-1252317822.image.myqcloud.com/image/20200317/fx4jitwuvb.png',
                    content: '2数据测试数据测数据测试数据测试数据',
                    color: 'orange',
                    bgColor: 'white'
                }
                , {
                    id: 3,
//                    icon: 'https://user-gold-cdn.xitu.io/2019/3/3/169412b9920a8e31?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    content: '3测试数据测试数据数据测试数据',
                    color: 'red'
                }, {
                    id: 4,
//                    icon: 'https://user-gold-cdn.xitu.io/2019/3/3/169412b9920a8e31?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    content: '4试数据测测试数据测试数据测测试数据试据',
                    color: 'blue'
                }, {
                    id: 5,
                    content: '5测数据测试数据测试数据',
                    color: 'green'
                }, {
                    id: 6,
                    content: '6测试数据测试数据数据测试数据',
                    color: 'orange'
                }
                ]
            }, 500)
        },
        methods: {
            add(){
                this.$refs.barrage.add({
                    id: 100,
                    icon: 'https://imgservices-1252317822.image.myqcloud.com/image/20200317/fx4jitwuvb.png',
                    content: `增加一条新的弹幕增加一条新的弹幕`,
                    color: 'red',
                    bgColor: 'black'
                })
            },
            DoLike (val) {
                console.log(87, val)
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
