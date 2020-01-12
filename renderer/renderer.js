const Data = require('./renderer/js/data.js')
const $ = require('./renderer/js/jquery.js')

/*
2020-01-12 早报 
武汉天气:多云
气温:8 ~ -1℃ 风速东风微风
提醒注意:天气冷，建议着棉服、羽绒服、皮夹克加羊毛衫等冬季服装。年老体弱者宜着厚棉衣、冬大衣或厚羽绒服。
******************** 
1.刘鹤会见获奖外国专家
2. 检查春运工作
3.王毅:布隆迪是中方可靠真诚的朋友
4.外交部就台湾选举答记者问
5.选举结果揭晓
6.银保监会:全面深化金融供给侧结构性改革
7."中国天眼"通过国家验收正式开放运行
8.春运第二日铁路预计发送旅客1230万人次
9.南昌舰来了!海军055型万吨级驱逐舰入列
10.甘肃:执行涉案财物查扣保管处置分离制度
******************** 
 每日一言 
真实的、永恒的、最高级的快乐，只能从三样东西中取得：工作、自我克制和爱。
*/


/**
 * 全局变量
 * 
 * copyContent: 早报预览内容
 * newsFlag:  新闻来源标识符
 */
const copyContent = $('.copy-content')
let newsFlag = true

/**
 * 新闻
 * @param {*} result 
 * @param {*} flag 
 */
async function build_news_table(result, flag) {
    // flag为 true => update
    $('.news-table tbody').empty()
    const newsItHomeList = result.slice(0, 10)
    let content = ''
    $.each(newsItHomeList, (index, item) => {
        // 构建页面
        const idTd = $('<td></td>').append(index + 1)
        const urlTd = $("<td></td>").append($("<a target='_blank'></a>").append(item.name).attr('href', item.url))
        $("<tr></tr>").append(idTd).append(urlTd).appendTo('.news-table tbody')
        // 用于复制
        content = content + (index + 1) + '.' + item.name + '\n'
    })
    if (flag) {
        let list = copyContent.text().split('********************')
        list[1] = content
        copyContent.empty()
        copyContent.append(list.join('********************'))
    } else {
        copyContent.append(content)
    }
}

/**
 * 每日一言
 * @param {*} result 
 */
async function build_one_page(result) {
    const imgEl = $('.one-panel img').attr('src', result.img)
    const textEl = $('<p></p>').append(result.text)
    $('.one-panel').append(textEl)
    copyContent.append('******************** \n 每日一言 \n' + result.text)
}

/**
 * 天气
 * @param {*} result 
 * @param {*} flag ==> flag为 flase表示更新
 */
async function build_weather_page(result, flag) {
    $('.tem-body h1').empty()
    $('.tem-body h3 strong').empty()
    $('.tem-body h3 img').empty()
    $('.tem-body h4 kbd').empty()
    $('.tem-body p').empty()
    $('.tem-body .row').empty()
    const today = result.weather_data[0]
    // today
    $('.tem-body h1').append(today.temperature).append('<small></small>').append(result.city)
    $('.tem-body h3 strong').append(today.weather)
    $('.tem-body h3 img').attr('src', today.dayPictureUrl)
    $('.tem-body h4 kbd').append(today.wind)
    $('.tem-body p').append(result.tip)

    // future
    $.each(result.weather_data, (index, item) => {
        if (index != 0) {
            const row = $('<div></div>').addClass('col-sm-6 col-md-4')
            const thumbnail = $('<div></div>').addClass('thumbnail')
            const h3El = $('<h3></h3>').append(item.temperature).append('<small></small>').append(item.date)
            const h4El = $('<h4></h4>').append(item.weather)
            const imgEl = $('<img>').attr('src', item.dayPictureUrl)
            const kbdEl = $('<div></div>')
            $('<kbd></kbd>').append(item.wind).appendTo(kbdEl)
            const caption = $('<div></div>').addClass('caption').append(h3El).append(h4El).append(imgEl).append(kbdEl).appendTo(thumbnail)
            $(row).append(caption)
            $('.row').append(row)
        }
    })

    // bulid copy textArea
    if (flag) {
        copyContent.append(result.date + '&nbsp;早报 \n' + result.city + '天气:' + today.weather + '\n气温:' + today.temperature + '&nbsp;风速' + today.wind + '\n提醒注意:' + result.tip + '\n' + '******************** \n')
    } else {
        let list = copyContent.text().split('********************')
        list[0] = result.date + '&nbsp;早报 \n' + result.city + '天气:' + today.weather + '\n气温:' + today.temperature + '&nbsp;风速' + today.wind + '\n提醒注意:' + result.tip + '\n'
        copyContent.empty()
        copyContent.append(list.join('********************'))
    }
}


async function _main() {
    const locationData = await getUserLocation()
    const weatherData = await getTemperature(encodeURI(locationData))
    await build_weather_page(weatherData, true)

    const peopleNewsList = await getPeopleData()
    await build_news_table(peopleNewsList, false);

    const oneData = await getOneData()
    await build_one_page(oneData);
}

_main()

// 切换图片
$('.btn-changeImg').click(function (e) {
    const randomNum = Math.round(Math.random() * 10)
    const imgUrl = './renderer/assets/img' + randomNum + '.jpg'
    $('.copy-panel img').attr('src', imgUrl)
})

// 一键复制
$('.btn-copy').click(function (e) {
    $('.copy-content').select()
    document.execCommand("copy");
})

// 更新城市信息
$('#input-city').bind('keypress', function (event) {
    if (event.keyCode == "13") {
        // console.log($('#input-city').val().trim())
        const city = $('#input-city').val().trim()
        search_city(city)
    }
})

// 根据城市信息修改早报内容
async function search_city(city) {
    const weatherData = await getTemperature(encodeURI(city))
    await build_weather_page(weatherData, false)
}

// 切换新闻来源
$('.news-exchange').click(function (e) {
    updata_news_source()
})

// 处理切换新闻源头
async function updata_news_source() {
    let list = []
    if (newsFlag) {
        list = await getPeopleData()
        newsFlag = false
    } else {
        list = await getITHomeData()
        newsFlag = true
    }
    await build_news_table(list, true)
}