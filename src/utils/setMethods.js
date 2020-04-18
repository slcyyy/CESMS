 
 
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}"
  let date
  if (typeof time === "object") {
    date = time
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  // eslint-disable-next-line
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value]
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  // eslint-disable-next-line
  return time_str
}
 
/**
 * Parse the json to excel
 *  tableJson 导出数据 ; filenames导出表的名字; autowidth表格宽度自动 true or false; bookTypes xlsx & csv & txt
 * @param {(Object)} tableJson
 * @param {string} filenames
 * @param {boolean} autowidth
 * @param {string} bookTypes
 */
export function json2excel (tableJson, filenames, autowidth, bookTypes) {
  import("@/vendor/Export2Excel").then(excel => {
    var tHeader = []
    var dataArr = []
    var sheetnames = []
    console.log(tableJson[0].filterVal)
    console.log(tableJson[0].tableDatas)
    for (var i in tableJson) {
      tHeader.push(tableJson[i].tHeader)
      dataArr.push(formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
      sheetnames.push(tableJson[i].sheetName)
    }
    console.log(dataArr)
    excel.export_json_to_excel({
      header: tHeader,
      data: dataArr,
      sheetname: sheetnames,
      filename: filenames,
      autoWidth: autowidth,
      bookType: bookTypes
    })
  })
}
// 数据过滤，时间过滤
 // 数据格式化

// 数据过滤，时间过滤
function formatJson (filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      if (j === "timestamp") {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    })
  )
}