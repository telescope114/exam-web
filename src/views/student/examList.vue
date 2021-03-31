<template>
    <div class="exam-list">
        <el-card>
            <div>
                <h1>考试信息</h1>
                <el-table
                        :data="pageList"
                        v-loading="loadingStudentExam">
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
            <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageStudentExam"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="studentExamList.length">
            ></el-pagination>
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
                pageSizes: [5,10,20,50],
                pageSize: 5,
                pageStudentExam: 1,
                pageList: []
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
                    data.data.forEach(item => {
                        if (this.checkExamTime(item)) {
                            this.studentExamList.unshift(item)
                        } else {
                            this.studentExamList.push(item)
                        }
                    })
                    this.pageList = this.studentExamList.slice(0,this.pageSize)
                    this.pageStudentExam = 1
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
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.pageStudentExam = 1
                this.pageList = this.studentExamList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageList = this.studentExamList.slice((val-1)*this.pageSize,val*this.pageSize)
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
