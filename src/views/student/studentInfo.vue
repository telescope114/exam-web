<template>
    <div class="student-info">
        <div>
            <el-card
                    v-loading="loadingStudentInfo"
                    element-loading-text="拼命加载中"
                    element-loading-background="rgba(255,255,255,0.8)">
                <div>
                    <h2>{{`${studentInfo.realName} ${studentInfo.studentNumber}`}}</h2>
                </div>
                <!--<div>
                    <h2>{{studentInfo.realName}}</h2>
                    <h2>{{studentInfo.studentNumber}}</h2>
                </div>-->
            </el-card>
            <el-card
                    v-loading="loadingStudentInfo"
                    element-loading-text="拼命加载中"
                    element-loading-background="rgba(255,255,255,0.8)">
                <!--<div>
                    <h2>学院：{{studentInfo.collegeName}}</h2>
                    <h2>专业：{{studentInfo.majorName}}</h2>
                    <h2>班级：{{studentInfo.majorName+studentInfo.grade+studentInfo.className}}</h2>
                </div>-->
                <div>
                    <h2>{{`${studentInfo.collegeName}-${studentInfo.majorName}-${studentInfo.majorName+studentInfo.grade+studentInfo.className}`}}</h2>
                </div>
                <div>
                    <student-echarts></student-echarts>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {studentInfo} from "../../services/student";
    import StudentEcharts from "./components/StudentEcharts";

    export default {
        name: "studentInfo",
        components: {StudentEcharts},
        data () {
            return {
                studentInfo: {},
                loadingStudentInfo: false
            }
        },
        created() {
            this.loadStudentInfo()
        },
        methods:{
            async loadStudentInfo () {
                this.loadingStudentInfo = true
                const { data } = await studentInfo()
                this.loadingStudentInfo = false
                if (data.code === '200') {
                    this.studentInfo = data.data
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.student-info {
    /*display: flex;*/
    /*justify-content: center;*/
    .el-card {
        width: 60%;
        margin: 0 auto;
        .student-echarts {
            height: 50vh;
        }
    }
}
</style>
