import axios from "axios";
import { serve } from '@/config'
import store from '@/store'
import router from "@/router";
import { Message } from "element-ui";
const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})

function serviceAddr (url) {
    if (url.startsWith('/admin'))
        return serve
    else if (url.startsWith('/t'))
        return serve
    else
        return serve
}

// 请求拦截
request.interceptors.request.use(function (config) {
    config.baseURL = serviceAddr(config.url)
    const { user } = store.state
    if (user && user.access_token && !isRefreshToken) {
        // config.headers.Authorization = user.refresh_token
        config.headers.Authorization = user.access_token
    }
    return config
}, function (err) {
    return err
})

// 返回登录界面
 function toLogin() {
    store.commit('setRole', '')
    store.commit('setMenu', new Set())
    store.commit('setUser', '')
    return router.push({
        name: 'Login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

// let isRefreshing = false
// 设置存储状态
let isRefreshToken = false
// 刷新token时等待的响应
let requests = []

// 响应拦截
request.interceptors.response.use(function (res) {
    if (res.data.code === '103') {
        // token 无效
        toLogin()
    } else if (res.data.code === '104') {
        // token 无效
        Message.error('该账号已经在别处登录了')
        toLogin()
    } else if (res.data.code === '401') {
        // token 系统错误
        Message.error('系统错误，请联系运维人员')
    } else if (res.data.code === '306') {
        // token 系统错误
        Message.error('你没有权限！！！')
    }
    return res
}, function (err) {
    if (err.response) {
        // 请求发送成功，响应接收完毕，但是状态码为失败的情况
        // 1.判断失败的状态码情况（主要处理401的情况）
        const { status } = err.response
        // let errorMessage = ''
        if (status === 400) {
            Message.error('请求参数错误')
        } else if (status === 401) {
            if (err.response.data.code === '102' || err.response.data.data === '102') {
                Message.error('请重新登录')
                toLogin()
                return Promise.reject(err)
            } else if (err.response.data.code === '101') {
                if (isRefreshToken) {
                    requests.push(() => {
                        return request(err.config)
                    })
                    return Promise.reject(err)
                }else {
                    isRefreshToken = true
                    return  request({
                        method: 'GET',
                        url: '/common/refreshToken',
                        headers: {
                            'Authorization': store.state.user.refresh_token
                        }
                    }).then(response => {
                        // console.log(response)
                        if (response.data.code === '100') {
                            response.data.refresh_token = store.state.user.refresh_token
                            store.commit('setUser',response.data)
                            isRefreshToken = false
                            requests.forEach(callback => callback())
                            requests = []
                        } else {
                            Message.error('token更新失败，请重新登录')
                            toLogin()
                        }
                    }).catch(error => {
                        console.log(error)
                    }).finally(() => {
                        isRefreshToken = false
                    })
                }
            } else if (err.response.data.code === '103') {
                Message.error('token无效，请重新登录')
                toLogin()
            } if (err.response.data.code === '104') {
                // token 无效
                Message.error('该账号已经在别处登录了')
                toLogin()
            }
        } else if (status === 404) {
            Message.error('请求资源不存在')
        } else if (status >= 500) {
            Message.error('服务器错误，请联系管理员')
        }
    } else if (err.request) {
        // 请求发送成功，未收到响应
        Message.error('请求超时请重试')
    } else {
        // 意料之外的错误
        Message.error(err.message)
    }
    // 将本次请求的错误对象继续向后抛出，让接收响应的处理函数进行操作
    return Promise.reject(err)
})

export default request
