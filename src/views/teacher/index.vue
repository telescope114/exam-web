<template>
    <div class="index">
        <el-card>
            <div slot="header">
                <h1>欢迎使用 四川轻化工大学 考试系统</h1>
            </div>
            <div class="content">
                <teacher-echarts v-if="parseInt($store.state.role) === 1"/>
                <director-echarts v-else-if="isDirector"/>
            </div>
        </el-card>
    </div>
</template>

<script>
import TeacherEcharts from "./component/TeacherEcharts";
import DirectorEcharts from "./component/DirectorEcharts";
export default {
    name: 'index',
    components: {DirectorEcharts, TeacherEcharts },
    /*mounted() {
    },*/
    /*data () {
        return {
            isDirector: false
        }
    },*/
    computed: {
        isDirector: function () {
            return this.$store.state.menus.has('/teacher')
        }
    }
}
</script>

<style lang="scss" scoped>
.index {
    .el-card {
        height: 80vh;
        overflow: auto;
        .content {
            /*display: flex;*/
            /*font-size: 30px;*/
            /*justify-content: center;*/
            /*height: 60vh;*/
        }
    }
}
</style>
