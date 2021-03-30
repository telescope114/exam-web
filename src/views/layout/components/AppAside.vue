<template>
    <div class="admin-aside">
        <el-col>
            <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    router
                    unique-opened
                    background-color="#288F5D"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <el-submenu
                v-for="menu in menusList"
                :key="menu.id"
                :index="menu.menuUrl+''"
                >
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{menu.menuName}}</span>
                    </template>
                    <el-menu-item
                    v-for="kid in menu.children"
                    :key="kid.id"
                    :index="kid.menuUrl+''"
                    >{{kid.menuName}}</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
    </div>
</template>

<script>
    export default {
        name: "AdminAside",
        created() {
            // this.loadMenus()
        },
        props: {
            menusList: Array
        },
        // data () {
        //     return {
        //         menusList: []
        //     }
        // },
        methods: {
            // 获取当前菜单列表
            // loadMenus () {
            //     this.menusList = this.$store.state.menus
            // }
        }
    }
</script>

<style lang="scss" scoped>
.el-menu {
    border-right: 0px;
}
</style>
