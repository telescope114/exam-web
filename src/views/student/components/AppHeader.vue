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
                <!--<el-menu-item index="2-3">选项3</el-menu-item>
                <el-submenu index="2-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="2-4-1">选项1</el-menu-item>
                    <el-menu-item index="2-4-2">选项2</el-menu-item>
                    <el-menu-item index="2-4-3">选项3</el-menu-item>
                </el-submenu>-->
            </el-submenu>
            <!--<el-menu-item index="3" disabled>消息中心</el-menu-item>
            <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
        </el-menu>
        <el-dropdown style="margin-right: 20px">
                <span class="el-dropdown-link">
                    <el-avatar size="medium" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import {layout} from "../../../services/login";

    export default {
        name: "AppHeader",
        data () {
            return {
                titleAim: '',
                secondTitle: '考试信息'
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
            }
        }
    }
</script>

<style lang="scss" scoped>
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
