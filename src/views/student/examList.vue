<template>
    <div class="exam-list">
        <el-card>
            <div>
                <h1>考试信息</h1>
                <el-table
                        :data="studentExamList"
                        v-loading="loadingStudentExam"
                >
                    <el-table-column fixed label="考试科目">
                        <template slot-scope="scope">
                            <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.examName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="开始考试时间">
                        <template slot-scope="scope">
                            <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.openTime|dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="最迟参考时间">
                        <template slot-scope="scope">
                            <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.closeTime|dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="考试科目">
                        <template slot-scope="scope">
                            <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.duration + '分钟'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="checkExamTime(scope.row)" type="primary" @click="toJoinExan(scope.row)">去考试</el-button>
                            <el-button v-else type="success" @click="beforeExam" disabled>未开考</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {studentExamGetExamList} from "../../services/student";
    import dateFormat from "../../utils/dateFormat";

    export default {
        name: "examList",
        data () {
            return {
                loadingStudentExam: true,
                studentExamList: [],
            }
        },
        created() {
            this.loadStudentExam()
        },
        methods: {
            async loadStudentExam () {
                this.loadingStudentExam = true
                const { data } = await studentExamGetExamList()
                this.loadingStudentExam = false
                if (data.code === '200') {
                    this.studentExamList = data.data
                    console.log(this.studentExamList)
                }
            },
            // 去考试按钮
            toJoinExan (row) {
                this.$router.push({name:'ExamInfo',params:{eid:row.id}})
            },
            // 未开考按钮
            beforeExam () {
                this.$message.error('当前还没考试呢！！')
            },
            // 判断考试状态
            checkExamTime (row) {
                const date = new Date()
                const open = new Date(row.openTime)
                const close = new Date(row.closeTime)
                // console.log(open)
                if (date < open || date > close) {
                    return false
                    // return true
                } else {
                    return true
                }
            }
        },
        filters: {
            dateFormat
        }
    }
</script>

<style lang="scss" scoped>
.exam-list {
    .el-card {
        height: 80vh;
        .before-exam {
            color: $success-color;
        }
        .examing {
            color: $primary-color;
            font-weight: bold;
            font-size: 20px;
        }
    }
}
</style>
