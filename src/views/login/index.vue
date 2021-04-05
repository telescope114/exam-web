<template>
    <div class="login">
        <template>
            <div>
                <header>
                    <h1>
                        <a href="/login" class="router-link-active" tabindex="-1">考试系统</a>
                    </h1>
                </header>
                <!-- Form 组件 -->
                <el-form
                        label-position="top"
                        ref="form"
                        :model="loginForm"
                        :rules="rules"
                        label-width="80px">
                    <el-form-item
                            label="账号"
                            prop="username">
                        <el-input
                            v-model="loginForm.username"
                            placeholder="请输入账号"
                            @keydown.native.enter="onSubmit"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                            label="密码"
                            prop="password">
                        <el-input
                            type="password"
                            v-model="loginForm.password"
                            placeholder="请输入密码"
                            @keydown.native.enter="onSubmit"
                            show-password
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                                type="primary"
                                @click="onSubmit"
                                :loading="isLoginLoading"
                        >登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </template>
    </div>
</template>

<script>
    import { login } from '@/services/common'

    export default {
        name: 'LoginIndex',
        data () {
            return {
                // 存储表单数据的对象
                loginForm: {
                    username: '1705111102',
                    password: '123456'
                },
                // 用于设置表单校验规则
                rules: {
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 6, message: '账号长度至少6位', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
                    ]
                },
                // 用于保存加载状态
                isLoginLoading: false
            }
        },
        methods: {
            // 登录功能
            async onSubmit () {
                try {
                    // 校验成功后的功能
                    await this.$refs.form.validate()
                    // 发送请求
                    // 按钮不可再按
                    this.isLoginLoading = true
                    // 清空token
                    this.$store.commit('setUser','')
                    this.$store.commit('setMenu','')
                    // {}解构对象内的data
                    const { data } = await login(this.loginForm)
                    // 请求处理完毕之后
                    this.isLoginLoading = false
                    // 响应处理
                    // console.log(data)
                    if (data.code === '200') {
                        this.isLoginLoading = false
                        this.$store.commit('setUser',data.token)
                        if (data.role === 2) {
                            this.$store.commit('setRole',data.role)
                            this.$router.push({ name: 'StudentInfo' } )
                        } else if (data.role === 0|| data.role === 1) {
                            this.$store.commit('setRole',data.role)
                            this.$router.push(this.$route.query.redirect || {name: 'Index'})
                        }
                    } else if (data.code === '0') {
                        this.$message.error("账号密码不匹配")
                    }
                } catch (err) {
                    // 校验失败后的功能
                    // console.log(err)
                    console.log('校验未通过')
                    this.isLoginLoading = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login {
        height: 100vh;
        display: flex;
        // 垂直水平居中
        justify-content: center;
        align-items: center;
        margin: 1rem auto;
        display: block;
        width: 95%;
        .el-form {
            background-color: #fff;
            padding: 20px;
            width: 300px;
            border-radius: 10px;
            margin: 1rem auto;
            .el-button {
                width: 100%;
            }
        }
        header {
            margin-bottom: 1rem;
            display: block;
            h1 {
                margin: 4.5rem 0 3.5rem;
                text-align: center;
                letter-spacing: .1rem;
                font-weight: bold;
                a {
                    margin: 0;
                    color: rgba(0,0,0,.5);
                    font-size: 3rem;
                    font-weight: 300;
                    text-decoration: none;
                    transition: text-shadow .3s;
                    cursor: pointer;
                }
            }
        }
        footer {
            width: 18%;
            margin-bottom: 1rem;
            padding: .625rem;
            border: .0625rem solid rgba(0,0,0,.1);
            font-size: .75rem;
            text-align: center;
            display: block;
            margin: auto;
            color: rgba(0,0,0,.6);
            a {
                color: inherit;
                text-decoration: none;
            }
        }
    }
</style>
