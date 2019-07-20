# barrage
### 一个基于canvas的弹幕组件
适用于移动端用户界面的轻量级弹幕组件

### 项目运行
```
yarn install

yarn run serve

yarn run build
```

### 弹幕效果

![barrage](https://user-gold-cdn.xitu.io/2019/7/20/16c0f1a946a59f3e?w=480&h=188&f=gif&s=4517801)

### 功能点

1. 支持循环弹幕
2. 弹幕不重叠
3. 支持选择轨道数
4. 支持弹幕发送

### 安装

`npm i vue-barrage`

### 参数配置

| name | type | default | desc  |
| ------ | ------ | ------ | ------ |
| barrageList | Array | [] | 弹幕数据 |
| speed | Number | 4 | 弹幕滚动速度 |
| loop | Boolean | true | 是否循环滚动 |
| channels | Number | 2 | 弹幕轨道数 |

### 使用

```
<barrage
    ref="barrage"
    class="barrage"
    :barrage-list="barrageList"
    :speed="speed"
    :loop="loop"
    :channels="channels"/>
// 弹幕数据初始化  
this.barrageList = [{
    content: '试数据测试数测试数据数测试数据',
    color: 'white'
}]
// 新增弹幕
this.$refs.barrage.add({
    content: '增加一条新的弹幕增加一条新的弹幕',
    color: 'white'
})
```



