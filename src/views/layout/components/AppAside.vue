<template>
    <div class="admin-aside">
        <el-col>
            <!--<el-menu
                    :default-active="this.$route.path"
                    class="el-menu-vertical-demo"
                    router
                    unique-opened
                    text-color="#fff"
                    active-text-color="#ffd04b">-->
            <el-menu
                    :default-active="this.$route.path"
                    class="el-menu-vertical-demo"
                    router
                    unique-opened
                    background-color="#288F5D"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <el-menu-item index="/">
                    <template slot="title">
                        <i><img class="img" src="@/assets/suse.png"></i>
                        <span>四川轻化工大学</span>
                    </template>
                </el-menu-item>
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
                    :index="kid.menuUrl"
                    >{{kid.menuName}}</el-menu-item>
                    <!--<el-menu-item
                    v-for="kid in menusList[0].children"
                    :key="kid.id"
                    :index="kid.menuUrl"
                    >{{kid.menuName}}</el-menu-item>-->
                </el-submenu>
            </el-menu>
        </el-col>
    </div>
</template>

<script>
    export default {
        name: "AdminAside",
        created() {
        },
        props: {
            menusList: Array
        }
    }
</script>

<style lang="scss" scoped>
.el-menu {
    border-right: 0px;
    /*normal {}*/
    /*.el-menu-item {
        background: rgb(28, 111, 71);
        border-top: #333333 2px;
    }
    .el-menu-item:first-of-type {
        background: rgb(40, 143, 93);
    }*/
}
.img{
    background-size: 100%;
    width: 50px;
}
</style>
