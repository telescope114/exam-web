/**
 * Created by Xiaoxiaoxuan on 2021/3/30
 */
import request from "../utils/request";
import qs from 'qs'

// 设置表头
const QS = {
    'Content-type': 'application/x-www-form-urlencoded'
}

/**
 * 获取考试信息
 * @param form
 * @returns {AxiosPromise}
 */
export const examGetExamDetails = (form) => {
    return request({
        method: 'POST',
        url: '/student/exam/getExamDetails',
        headers: QS,
        data: qs.stringify(form)
    })
}

/**
 * 提交答案
 * @param form
 * @returns {AxiosPromise}
 */
export const examPreviousOrNext = (form) => {
    return request({
        method: 'POST',
        url: '/student/exam/previousOrNext',
        // headers: QS,
        data: JSON.stringify(form)
    })
}

/**
 * 提交答案
 * @param form
 * @returns {AxiosPromise}
 */
export const examReturnExam = () => {
    return request({
        method: 'GET',
        url: '/student/exam/returnExam',
        // headers: QS,
        // data: JSON.stringify(form)
    })
}

/**
 * 结束考试
 * @param form
 * @returns {AxiosPromise}
 */
export const examEndExam = (form) => {
    return request({
        method: 'POST',
        url: '/student/exam/endExam',
        headers: QS,
        data: qs.stringify(form)
    })
}
