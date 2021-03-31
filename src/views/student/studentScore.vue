<template>
    <div class="get-student-score">
        <el-card>
            <div>
                <h1>成绩查询</h1>
                <el-table
                    :data="pageList"
                    border
                    v-loading="loadingStudentScore">
                    <el-table-column
                        fixed
                        prop="examName"
                        label="考试名称"
                        width="100"
                    ></el-table-column>
                    <el-table-column label="是否参加考试" width="150">
                        <!--   0 未参考， 2 已考完                   -->
                        <template slot-scope="scope">
                            {{scope.row.isExam === 2?'是':'否'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="studentTotalScore" label="分数" width="100"></el-table-column>
                    <el-table-column prop="totalScore" label="总分" width="100"></el-table-column>
                    <el-table-column label="开始考试时间">
                        <template slot-scope="scope">
                            {{scope.row.openTime|dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="最迟考试时间">
                        <template slot-scope="scope">
                            {{scope.row.closeTime|dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="checkExam" type="primary" @click="getScoreAllInformation(scope.row)">成绩明细</el-button>
                            <el-button v-else disabled type="warn">成绩明细</el-button>
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
                    :total="studentScoreList.length">
                ></el-pagination>
        </el-card>
    </div>
</template>

<script>
    import dateFormat from "../../utils/dateFormat";
    import {studentScoreGetExamList} from "../../services/student";

    export default {
        name: "getStudentScore",
        data () {
            return {
                loadingStudentScore: true,
                studentScoreList: [],
                pageSizes: [5,10,20,50],
                pageSize: 5,
                pageStudentExam: 1,
                pageList: []
            }
        },
        created() {
            this.loadStudentScore()
        },
        methods: {
            async loadStudentScore () {
                this.loadingStudentScore = true
                const { data } = await studentScoreGetExamList()
                this.loadingStudentScore = false
                if (data.code === '200') {
                    this.studentScoreList = data.data
                    this.studentScoreList.reverse()
                    this.handleSizeChange(5)
                }
            },
            getScoreAllInformation (row) {
                this.$router.push({name: 'Score',params:{id: row.id}})
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.pageStudentExam = 1
                this.pageList = this.studentScoreList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageList = this.studentScoreList.slice((val-1)*this.pageSize,val*this.pageSize)
            },
            checkExam (row) {
                const time = new Date()
                const open = new Date(row.openTime)
                if (time < open) {
                    return false
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

<style scoped>

</style>
