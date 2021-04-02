<template>
    <div class="app-header">
        <el-menu
                :default-active="titleAim"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleClick"
                background-color="#288F5D"
                text-color="#fff"
                active-text-color="#FCC419">
            <el-menu-item index="1">个人信息</el-menu-item>
            <el-submenu index="2">
                <template slot="title">{{secondTitle}}</template>
                <el-menu-item index="2-1">去考试</el-menu-item>
                <el-menu-item index="2-2">成绩查询</el-menu-item>
            </el-submenu>
        </el-menu>
        <el-dropdown style="margin-right: 20px">
                <span class="el-dropdown-link">
                    <el-avatar size="medium" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dialog title="修改密码" :visible.sync="dialogChangePassword">
            <div>
                <el-form :model="passwordForm" ref="passwordForm" :rules="rules" v-if="dialogChangePassword">
                    <el-form-item label="旧的密码" label-width="120" prop="oldPassword">
                        <el-input v-model="passwordForm.oldPassword" @keydown.native.enter="submit" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item label="新的密码" label-width="120" prop="newPassword">
                        <el-input v-model="passwordForm.newPassword" @keydown.native.enter="submit" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" label-width="120" prop="checkPassword">
                        <el-input v-model="passwordForm.checkPassword" @keydown.native.enter="submit" show-password clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {layout, studentChangePassword} from "../../../services/common";

    export default {
        name: "AppHeader",
        data () {
            return {
                titleAim: '',
                secondTitle: '考试信息',
                dialogChangePassword: false,
                passwordForm: {},
                rules: {
                    oldPassword: [
                        {required:true, message: '不能为空！！', trigger: 'blur'},
                        {min: 6, message: '长度至少6位数！！', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required:true, message: '不能为空！！', trigger: 'blur'},
                        {min: 6, message: '长度至少6位数！！', trigger: 'blur'}
                    ],
                    checkPassword: [
                        {required:true, message: '不能为空！！', trigger: 'blur'},
                        {min: 6, message: '长度至少6位数！！', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.loadRoutePath()
        },
        methods: {
            loadRoutePath () {
                if (this.$route.path === '/student' || this.$route.path === '/student/') {
                    this.titleAim = '1'
                    this.secondTitle = '考试信息'
                } else if (this.$route.path === '/student/examList') {
                    this.titleAim = '2-1'
                    this.secondTitle = '去考试'
                } else if (this.$route.path === '/student/getStudentScore') {
                    this.titleAim = '2-2'
                    this.secondTitle = '成绩查询'
                }
            },
            handleClick(key) {
                this.titleAim = key
                if (this.titleAim === '1') {
                    if (this.$route.path !== '/student') {
                        this.$router.push({name: 'StudentInfo'})
                        this.secondTitle = '考试信息'
                    }
                } else if (this.titleAim === '2-1') {
                    if (this.$route.path !== '/student/examList') {
                        this.$router.push({name: 'ExamList'})
                        this.secondTitle = '去考试'
                    }
                } else if (this.titleAim === '2-2') {
                    if (this.$route.path !== '/student/getStudentScore') {
                        this.$router.push({name: 'GetStudentScore'})
                        this.secondTitle = '成绩查询'
                    }
                }
                // console.log(key, keyPath)
            },
            async logout () {
                const { data } = await layout()
                if (data.code === '200') {
                    this.$store.commit('setUser', '')
                    this.$store.commit('setMenu', '')
                    this.$router.push('/login')
                } else {
                    this.$message.error("登出错误")
                }
            },
            changePassword () {
                this.dialogChangePassword = true
            },
            cancel () {
                this.dialogChangePassword = false
            },
            submit () {
                this.$refs.passwordForm.validate(valid => {
                    if (valid) {
                        if (this.passwordForm.oldPassword === this.passwordForm.newPassword) {
                            this.$message.error('新旧密码不能一样！！')
                            this.passwordForm.newPassword = ''
                            this.passwordForm.checkPassword = ''
                        } else if (this.passwordForm.checkPassword !== this.passwordForm.newPassword) {
                            this.$message.error('确认密码不一致！！')
                            this.passwordForm.checkPassword = ''
                        }  else if (this.passwordForm.checkPassword === this.passwordForm.newPassword) {
                            this.submitPassword()
                        }
                    } else {
                        this.$message.error('都不能为空！！！')
                        return false
                    }
                })
            },
            async submitPassword () {
                const { data } = await studentChangePassword({
                    oldPassword: this.passwordForm.oldPassword,
                    newPassword: this.passwordForm.newPassword
                })
                if (data.code === '200') {
                    this.$alert('密码修改成功，请重新登录', '修改成功', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.$router.push({name: 'Login'})
                        }
                    })
                } else if (data.code === '301') {
                    this.$message.error('旧密码没输对，请好好回忆')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dialog-footer {
        display: flex;
        justify-content: center;
    }
}
</style>
