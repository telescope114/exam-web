/**
 * Created by Xiaoxiaoxuan on 2021/3/26
 */

function dateFormat (date) {
    date = new Date(date)
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().length>1?(date.getMonth()+1).toString():'0' + (date.getMonth()+1).toString()}-${date.getDate().toString().length>1?date.getDate().toString():'0' + date.getDate().toString()}
     ${date.getHours().toString().length>1?date.getHours().toString():'0'+date.getHours().toString()}:${date.getMinutes().toString().length>1?date.getMinutes().toString():'0'+date.getMinutes().toString()}:${date.getSeconds().toString().length>1?date.getSeconds().toString():'0'+date.getSeconds().toString()}`
}

export default dateFormat

export const setTime = (seconds) => {
    const hour = parseInt(seconds / 3600)
    const min = parseInt((seconds % 3600) / 60)
    const second = parseInt(seconds % 60)
    return `${hour.toString().length>1?hour.toString():'0'+hour.toString()}:${min.toString().length>1?min.toString():'0'+min.toString()}:${second.toString().length>1?second.toString():'0'+second.toString()}`
}
