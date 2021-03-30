/**
 * Created by Xiaoxiaoxuan on 2021/3/26
 */

function dateFormat (date) {
    date = new Date(date)
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().length>1?(date.getMonth()+1).toString():'0' + (date.getMonth()+1).toString()}-${date.getDate().toString().length>1?date.getDate().toString():'0' + date.getDate().toString()}
     ${date.getHours().toString().length>1?date.getHours().toString():'0'+date.getHours().toString()}:${date.getMinutes().toString().length>1?date.getMinutes().toString():'0'+date.getMinutes().toString()}:${date.getSeconds().toString().length>1?date.getSeconds().toString():'0'+date.getSeconds().toString()}`
}

export default dateFormat
