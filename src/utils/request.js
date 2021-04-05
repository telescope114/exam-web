import axios from "axios";
import { serve } from '@/config'
import store from '@/store'
import router from "@/router";
import { Message } from "element-ui";

const request = axios.create({
    // timeout: 5000
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
    if (user) {
        config.headers.Authorization = user
    }
    return config
}, function (err) {
    return err
})

// 返回登录界面
 function toLogin() {
    return router.push({
        name: 'Login'/*,
        query: {
            redirect: router.currentRoute.fullPath
        }*/
    })
}

// 设置存储状态
// let isRefreshToken = false
// 刷新token时等待的响应
// let requests = []

// 响应拦截
request.interceptors.response.use(function (res) {
    // console.log(res)
    if (res.data.code === '100') {
        // 更新token
        store.commit('setUser',res.data.token)
         /*if (!store.state.user) {
            toLogin()
            return
        }
        // 检查token刷新状态
        if (isRefreshToken) {
            requests.push(() => {
                request(res.config)
            })
        }
        isRefreshToken = true*/
        return  request(res.config)
            /*.then(res => {
            if (res.data.state !== 1) {
                // 清除无效的用户信息
                store.commit('setUser', null)
                toLogin()
            }
            // store.commit('setUser', res.data.content)
            //  - 重新发送失败的请求（根据 requests 发送所有失败的请求）
            requests.forEach(callback => callback())
            //  - 发送完毕，清除 requests 内容即可
            requests = []
            //  - 将本次请求发送
            return res
        })*/
    } else if (res.data.code === '101') {
        // token 无效
        toLogin()
    } else if (res.data.code === '401') {
        // token 无效
        Message.error('系统错误，请联系运维人员')
    }
/*    else if (res.data.code === '101') {
        toLogin()
        return res
    }*/
    return res
}, function (err) {
    if (err.response) {
        const { status } = err.response
        if (status >= 500) {
            Message.error('服务器错误，请联系程序猿')
            return Promise.reject(err)
        }
    }
    return err
})

export default request
