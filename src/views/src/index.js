/*
 * @Author: your name
 * @Date: 2019-09-01 15:11:41
 * @LastEditTime: 2020-03-18 13:27:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vue-barrage/src/views/src/index.js
 */
/**
 * @author Nickyzhang
 * @date 2019/7/13
 * @description file templates
 */
import Barrage from './barrage_new.vue'

Barrage.install = function (Vue) {
    Vue.component('Barrage', Barrage)
}

export default Barrage