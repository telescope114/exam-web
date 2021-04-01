import request from '@/utils/request'
import qs from 'qs'

/**
 * 登录请求
 * @param form 请求：username、password
 */
export const login = (form) => {
    return request({
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        url: '/user/login',
        data: qs.stringify(form)
    })
}

/**
 * 登出请求
 * @returns 响应：
 */
export const layout = () => {
    return request({
        method: 'GET',
        url: '/user/logout'
    })
}

/**
 * 教师修改密码
 * @returns 响应：
 */
export const teacherChangePassword = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/changePassword',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}

/**
 * 学生修改密码
 * @returns 响应：
 */
export const studentChangePassword = (form) => {
    return request({
        method: 'POST',
        url: '/student/changePassword',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}
