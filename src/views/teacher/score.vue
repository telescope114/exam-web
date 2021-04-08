<template>
    <div class="teacher-score">
        <el-card>
            <div slot="header">
                <h1 style="margin: 0;padding: 0;text-align: left">成绩查询</h1>
            </div>
            <el-table border :data="pageList" v-loading="loadingScore" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-locading-background="rgba(255,255,255,0.8)">
                <el-table-column fixed label="考试" prop="examName" width="120"></el-table-column>
                <el-table-column label="专业" width="200" prop="majorName"></el-table-column>
                <el-table-column label="班级" width="100" prop="classNumber">
                    <!--<template slot-scope="scope">
                        <p>{{scope.row.majorName+scope.row.grade+scope.row.classNumber}}</p>
                    </template>-->
                </el-table-column>
                <el-table-column label="年级" width="100" prop="grade"></el-table-column>
                <el-table-column label="总分" prop="totalScore"></el-table-column>
                <el-table-column label="学院" prop="collegeName"></el-table-column>
                <el-table-column fixed="right" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="seeClassExamScoreList(scope.row)">成绩详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :page-size="pageSize"
                :page-sizes="pageSizes"
                :total="scoreList.length"
                :current-page="pageExam"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </el-card>
        <el-dialog title="学生细节" :visible.sync="dialogStudentList">
            <div>
                <h1 style="font-size: 20px;">{{examInfo.majorName + examInfo.grade + examInfo.classNumber}}</h1>
                <div style="display: flex;justify-content: center;">
                    <h3 style="margin: 0 30px;">考试：{{examInfo.examName}}</h3>
                </div>
                <el-table :data="studentScoreList" border v-loading="loadingGetStudentScore" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-locading-background="rgba(255,255,255,0.8)">
                    <el-table-column label="学生姓名" prop="realName"></el-table-column>
                    <el-table-column label="成绩总" prop="totalScore"></el-table-column>
                    <el-table-column label="考试总分">
                        <template>
                            <p>{{examInfo.totalScore}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="printClassScoreList">打印</el-button>
                <el-button type="primary" @click="dialogStudentList=false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        teacherScore,
        teacherScoreDownloadClassScore,
        teacherScoreGetStudentScore,
        teacherScorePrintClassScore
    } from "../../services/teacher";
    import dateFormat from "../../utils/dateFormat";

    export default {
        name: "TeacherScore",
        data () {
            return {
                loadingScore: true,
                loadingGetStudentScore: true,
                loadingDownload: false,
                dialogStudentList: false,
                scoreList:[],
                studentScoreList:[],
                examInfo: {},
                pageSize: 5,
                pageSizes: [5,10,20,50],
                pageExam: 1,
                pageList: []
            }
        },
        created() {
            this.loadExamList()
        },
        methods: {
            async loadExamList () {
                this.loadingScore = true
                const { data } = await teacherScore()
                this.loadingScore = false
                if (data.code === '200') {
                    this.scoreList = data.data
                    this.handleCurrentChange(1)
                }
            },
            async seeClassExamScoreList (row) {
                this.examInfo = row
                this.dialogStudentList = true
                this.loadingGetStudentScore = true
                const { data } = await teacherScoreGetStudentScore({examId: row.examId,classId: row.classId})
                this.loadingGetStudentScore = false
                if (data.code === '200') {
                    this.studentScoreList = data.data
                }
            },
            handleSizeChange (key) {
                this.pageSize = key
                this.handleCurrentChange(1)
            },
            handleCurrentChange (key) {
                this.pageExam = key
                this.pageList = this.scoreList.slice((key-1)*this.pageSize,key*this.pageSize)
            },
            async printClassScoreList () {
                const { data } = await teacherScorePrintClassScore({examId: this.examInfo.examId,classId: this.examInfo.classId})
                // console.log(data)
                if (data.code ==='200') {
                    this.downloadClassScoreList(data.data)
                }
            },
            async downloadClassScoreList (fileName) {
                const data = await teacherScoreDownloadClassScore(fileName)
                // console.log(data)
                this.pdfUrl = window.URL.createObjectURL(new Blob([data.data], { type: `application/ms-excel` }));
                const fname = `${this.examInfo.majorName+this.examInfo.grade+this.examInfo.classNumber+this.examInfo.examName}成绩表.xlsx`
                const link = document.createElement('a')
                link.href = this.pdfUrl
                link.setAttribute('download', fname)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        },
        filters: {
            dateFormat
        }
    }
</script>

<style lang="scss" scoped>
    .dialog-footer {
        display: flex;
        justify-content: center;
        button {
            margin: 0 5px;
        }
    }
</style>
