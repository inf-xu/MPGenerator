# 公司早报生成器

------

为学校的青协简报做一个贡献吧

> **能被JS代替的，终将被JS代替 !!!**
>
> 经常闲逛吾爱论坛，这几天看到多个大佬使用不同的语言编写《公司早报生成器》，为了捍卫JS的尊严，我决定用`Eletron`覆写一遍，做的比较简陋勿喷。

### 灵感来自

------

[ 公司早报生成器(含天气、新闻、每日一言)]( https://www.52pojie.cn/thread-1086342-1-1.html )

[ 日报生成器DailyPape ]( https://www.52pojie.cn/thread-1087638-1-1.html )

### 功能特性

1. 热点新闻
2. 新闻源切换
3. 早报预览
4. 每日一言
5. 天气显示
6. 天气预报
7. 图片切换
8. 界面简洁
9. 一键复制

### 界面展示

主界面：窗体不可缩小, 显示新闻热点，早报预览，每日一言和今日天气

![loxAPI.png](https://s2.ax1x.com/2020/01/12/loxAPI.png)

上半区域界面

![lox9qe.png](https://s2.ax1x.com/2020/01/12/lox9qe.png)

新闻热点，默认是《人民网》`Top10`，可以切换至《IT之家》

![loxSKO.png](https://s2.ax1x.com/2020/01/12/loxSKO.png)

早报预览，使用的是*搜狐API*得到城市位置接着根据*百度天气API*得到**今日天气**，这里需要注意的是搜狐API的一天访问次数有限制，因此不要使用超过十五次以上，一旦界面卡在，可以手动输入城市获取天气。![lovj8x.png](https://s2.ax1x.com/2020/01/12/lovj8x.png)

下方区域界面显示，每日一言和今日天气

![loxPVH.png](https://s2.ax1x.com/2020/01/12/loxPVH.png)

重要的事情说三遍！！！

![loxEGt.png](https://s2.ax1x.com/2020/01/12/loxEGt.png) 

如果图片挂了，这里有完整图片[图片详情]( https://gitee.com/kdaisyers/source/tree/master/paper )

### 环境参考

 Node.js 12.8.1, Chromium 78.0.3904.130, and Electron 7.1.7. 

### 下载

Windows [MPGenrator](https://www.lanzous.com/i8mk3oh)

### 安装

```bash
# Clone this repository
git clone https://github.com/KDaisyers/MPGenerator
```

### 初始化

```bash
# Install dependencies
npm install
```

### 运行

```bash
# Run the app
npm start
```
