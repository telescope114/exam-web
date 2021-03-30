<template>
    <div class="student-exam">
        <el-container>
            <el-header>
                <app-header></app-header>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>

    import AppHeader from "./components/AppHeader";

    export default {
        name: "index",
        components: {AppHeader}
    }
</script>

<style lang="scss" scoped>
.student-exam {
    .el-header {
        background-color: $primary-color;
        color: #333;
        text-align: center;
        .el-menu {
            width: 50%;
        }
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;

    }
}
</style>
