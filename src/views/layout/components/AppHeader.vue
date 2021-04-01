<template>
    <div class="admin-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.path !== '/'">{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown>
            <span class="el-dropdown-link">
                <el-avatar size="medium" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
            </span>
            <el-dropdown-menu>
                <el-dropdown-item divided @click.native="changePassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import { layout } from "@/services/login";

    export default {
        name: "AdminHeader",
        data () {
            return {
                dialogChangePassword: false
            }
        },
        methods: {
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

            }
        }
    }
</script>

<style lang="scss" scoped>
    .admin-header {
        height: 100%;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-dropdown-link {
            margin-right: 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }
    }
</style>
