<template>
    <div class="examInfo">
        <el-container>
            <el-header>
                <div v-if="isExam"></div>
            </el-header>
            <el-main>
                <div v-if="!isExam">
                    <el-card style="height: 80vh;">
                        <div slot="header">
                            <h1>考试科目：{{examMsg.examName}}</h1>
                            <div class="exam-info">
                                <h3>开始考试时间：{{examMsg.openTime}}</h3>
                                <h3>总分：{{examMsg.totalScore}}</h3>
                                <h3>时长：{{examMsg.duration}}</h3>
                                <h3>最迟考试时间：{{examMsg.closeTime}}</h3>
                            </div>
                        </div>
                        <div>
                            <div class="exam-notice">
                                <h1>考试须知</h1>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div>
                    <examming v-if="isExam"
                              :questionList="questionList"
                    ></examming>
                </div>
            </el-main>
            <el-footer v-if="!isExam">
                <el-button type="info" size="big" @click="backToStudentInfo">返回</el-button>
                <el-button type="primary" @click="startExam" v-loading="loadingStratExam" size="big">开始考试</el-button>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import {studentExamGetStartExam} from "../../services/student";
    import {examGetExamDetails} from "../../services/exam";
    import Examming from "./components/Examming";

    export default {
        name: "examInfo",
        components: {Examming},
        data () {
            return {
                loadingStratExam: false,
                isExam: false,
                examMsg: {},
                examInfo: {},
                questionList: {}
            }
        },
        created() {
            this.loadExamInfo()
        },
        methods: {
            async loadExamInfo () {
                // 判断该考生是否能参加考试
                this.isExam = true
                const { data } = await examGetExamDetails({eid: this.$route.params.eid})
                if (data.code === '200') {
                    this.examMsg = data.data.exam
                    // console.log(data)
                    this.isExam = false
                } else if (data.code === '201') {
                    this.$message.warning('当前还没考试呢！！！')
                    this.backToStudentInfo()
                } else if (data.code === '203') {
                    this.$message.error('正在考试，不可重复考试！！！')
                }
            },
            // 返回个人信息
            backToStudentInfo () {
                this.$router.push({name:'ExamForStudent'})
            },
            // 开始考试
            async startExam () {
                this.loadingStratExam = true
                const { data } = await studentExamGetStartExam({eid: this.$route.params.eid})
                this.loadingStratExam = false
                if (data.code === '200') {
                    this.$message.success('开始考试！！！')
                    this.questionList = data.data
                    this.isExam = true
                } else if (data.code === '201') {
                    this.$message.warning('当前还没考试呢！！！')
                    this.backToStudentInfo()
                } else if (data.code === '203') {
                    this.$message.error('正在考试，不可重复考试！！！')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-container {
    height: 100vh;
    .el-header {
        background-color: $primary-color;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-footer {
        background-color: #fff;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-main {
        background-color: #fff;
        color: #333;
        text-align: center;
        /*line-height: 160px;*/
        h1 {
            color: $danger-color;
        }
        .exam-info {
            display: flex;
            justify-content: center;
            h3 {
                margin: 0 20px;
            }
        }
    }
}
</style>
