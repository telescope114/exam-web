/**
 * Created by Xiaoxiaoxuan on 2021/3/30
 */
import request from "../utils/request";
import qs from 'qs'

/**
 * 获取考试状态
  * @returns {AxiosPromise}
 */
export const student = () => {
    return request({
        method: 'GET',
        url: '/student'
    })
}

/**
 * 去考试功能获取考试列表
 */
export const studentExamGetExamList = () => {
    return request({
        method: 'GET',
        url: '/student/exam/getExamList'
    })
}

/**
 * 去考试
 */
export const studentExamGetStartExam = (form) => {
    return request({
        method: 'POST',
        url: '/student/exam/startExam',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}
