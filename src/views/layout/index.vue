<template>
<div class="admin-index">
    <el-container>
        <el-aside width="200px">
            <app-aside :menusList="menusList"></app-aside>
        </el-aside>
        <el-container>
            <el-header>
                <app-header></app-header>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
    import AppAside from "./components/AppAside";
    import AppHeader from "./components/AppHeader";
    import { getMenuName } from "@/services/admin";
    import {getMenuList} from "@/utils/common";
    export default {
        name: "Layout",
        components: { AppAside, AppHeader },
        created() {
            if (this.$store.state.role === 2) {
                // console.log(100)
                this.$router.push({ name: 'StudentInfo' })
            } else {
                this.loadingMenuName()
            }

        },
        data () {
            return {
                menusList: []
            }
        },
        methods: {
            async loadingMenuName () {
                // console.log(101)
                if (!this.$store.state.user) {
                    // console.log(102)
                    this.$router.push({name: 'Login'})
                }
                const { data } = await getMenuName()
                // console.log(data)
                if (data.code === '0') {
                    // console.log(103)
                    this.$store.commit('setUser','')
                    this.$store.commit('setMenu','')
                    this.$router.push({name: 'Login'})
                } else if (data.code === '200') {
                    // console.log(104)
                    const menus = data.data
                    for (let i = 0;i < menus.length; i++) {
                        if (menus[i].menuName === '系统树') {
                            menus.splice(i,1)
                        }
                    }
                    this.$store.commit('setMenu',menus)
                    // menus.shift()
                    this.menusList = getMenuList(data.data)
                    // this.$store.commit('setMenu',getMenuList(data.data))
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-header {
        background-color: #B3C0D1;
        color: $info-color;
        text-align: center;
        line-height: 10vh;
    }

    .el-aside {
        height: 100vh;
        background-color: $primary-color;
        color: #333;
        text-align: center;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: 90vh;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>
