/**
 * Created by Xiaoxiaoxuan on 2021/3/26
 */

function dateFormat (date) {
    date = new Date(date)
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export default dateFormat
