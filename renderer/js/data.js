// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const cheerio = require('cheerio')
const request = require('request')
const iconv = require('iconv-lite')

// IT 之家
function getITHomeData() {
    const url = 'https://www.ithome.com/blog/'
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const $cheerio = cheerio.load(body)
                const newsList = []
                $cheerio('#leftcontent > div.cate_list > ul > li').each(function () {
                    const divElement = $cheerio(this).children().children()
                    const aElement = $cheerio(divElement[1]).children()
                    const newItem = $cheerio(aElement[0]).text()
                    const urlItem = $cheerio(aElement[0]).attr('href')

                    const o = {
                        name: newItem,
                        url: urlItem
                    }
                    newsList.push(o)
                })
                resolve(newsList)
            } else {
                reject(error)
            }
        })
    })
}

// 人民网
function getPeopleData() {
    const url = 'http://www.people.com.cn/GB/59476/'
    const options = {
        method: 'get',
        url: url,
        encoding: null,
    };
    return new Promise((resolve, reject) => {
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(iconv.decode(body, 'gb2312'))
                const peopleList = []
                $('#ta_1 > tbody > tr > td').find('a').each(function () {
                    const o = {
                        name: $(this).text(),
                        url: $(this).attr('href')
                    }
                    peopleList.push(o)
                })
                resolve(peopleList)
            } else {
                reject(error)
            }
        })
    })
}

// cctv.com 
function getCCTVData() {
    const url = 'http://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/news_1.jsonp?cb=t&cb=news';
    return new Promise((resolve, reject) => {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const $cheerio = cheerio.load(body)
                resolve(body)
            } else {
                reject(error)
            }
        })
    })
}

// one
function getOneData() {
    const url = 'http://wufazhuce.com/'
    return new Promise((resolve, reject) => {
        request.get(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // success
                const $cheerio = cheerio.load(body)
                const img = $cheerio('#carousel-one > div > div.item.active > a > img').attr('src')
                const text = $cheerio('#carousel-one > div > div.item.active > div.fp-one-cita-wrapper > div.fp-one-cita > a').text()
                const oneData = {
                    img,
                    text
                }
                resolve(oneData)
            } else {
                reject(error)
            }
        })
    })
}

/**
 *  不需要爬取 墨迹天气
 * 
 *  1. 可以根据 搜狐和淘宝的 api 得到所在地
 *      按常理来说搜狐api是可以得到所在地，然而我这边cname一直为 china
 *      因此需要借助淘宝的api得到所在地
 * 
 *  2. 根据百度api得到天气信息
 *  
 */

// moji Province -- 方法弃用
function getMojiProvince(province) {
    const url = 'https://tianqi.moji.com/weather/china/' + province
    return new Promise((resolve, reject) => {
        request.get(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // get all district
                const $cheerio = cheerio.load(body)
                const cityList = []
                $cheerio('#city > div.city.clearfix > div.city_hot > ul > li').each(function () {
                    const liChildren = $cheerio(this).children()
                    const cityName = $cheerio(liChildren).text()
                    const cityUrl = $cheerio(liChildren).attr('href')
                    // to Json
                    const o = {
                        name: cityName,
                        url: cityUrl
                    }
                    cityList.push(o)
                })
                resolve(cityList)
            } else {
                // province is not exist
                reject(error)
            }
        })
    })
}

// moji temperature -- 方法弃用
function getMojiData(url) {
    return new Promise((resolve, reject) => {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const $cheerio = cheerio.load(body)
                // temperature
                const temperature = $cheerio('.wea_weather em').text()
                // icon
                const icon = $cheerio('.wea_weather span img').attr('src')
                // weather
                const weather = $cheerio('.wea_weather b').text()
                // info
                const tips = $cheerio('.wea_tips em').text()
                // humidity
                const humidity = $cheerio('body > div.wrap.clearfix.wea_info > div.left > div.wea_about.clearfix span').text()
                // wind
                const wind = $cheerio('body > div.wrap.clearfix.wea_info > div.left > div.wea_about.clearfix em').text()

                const mojiData = {
                    icon,
                    temperature,
                    weather,
                    tips,
                    humidity,
                    wind
                }
                resolve(mojiData)
            } else {
                reject(error)
            }
        })
    })
}

// get location
async function getUserLocation() {
    let location = ''
    return new Promise((resolve, reject) => {
        const cityCode = returnCitySN.cid;
        if (!cityCode || cityCode == -1) {
            reject('武汉')
        } else {
            request.get('http://ip.taobao.com/service/getIpInfo.php?ip=' + returnCitySN.cip, (err, res, body) => {
                // console.log(JSON.parse(body).data.city);
                location = JSON.parse(body).data.city
                resolve(location)
            })
        }
    })
}

// Temperature
async function getTemperature(location) {
    const url = 'http://api.map.baidu.com/telematics/v3/weather?location=' + location + '&output=json&ak=EGgzZ22dsboWQEcPQ6KDQLknQd3YkkkP'
    return new Promise((resolve, reject) => {
        request.get(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const bodyJson = JSON.parse(body)
                const data = bodyJson.results[0]
                const o = {
                    date: bodyJson.date,
                    city: data.currentCity,
                    pm25: data.pm25,
                    tip: data.index[0].des,
                    weather_data: data.weather_data
                }
                resolve(o)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    getITHomeData,
    getPeopleData,
    getOneData,
    getUserLocation,
    getTemperature
}