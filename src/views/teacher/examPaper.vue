<template>
    <div class="exam-paper">
        <el-card>
            <div class="search" slot="header">
                <el-button type="primary" v-if="!isDirector" @click="addExamPaper">添加试卷</el-button>
                <div class="search-main">
                    <!--<label>试题类型：</label>
                    <el-select v-model="selectForm.examQuestionType" style="width: 100px">
                        <el-option v-for="item of examQuestionTypeTitle" :key="item.value" :label="item.title" :value="item.value" @click.native="checkExamQuestionType"></el-option>
                    </el-select>-->
                    <label>试卷名称：</label>
                    <el-input v-model="selectForm.examPaperName" style="width: 150px" @keydown.native.enter="searchExamPaper" clearable ></el-input>
                    <el-button type="primary" circle icon="el-icon-search" @click="searchExamPaper"></el-button>
                </div>
            </div>
            <div>
                <el-table :data="pageList" border>
<!--                    <el-table-column label="试卷名" prop="id" fixed></el-table-column>-->
                    <el-table-column label="试卷名" prop="examPaperName" fixed></el-table-column>
                    <el-table-column v-if="isDirector" label="出题人" prop="realName"></el-table-column>
                    <el-table-column label="总分" width="100" prop="totalScore"></el-table-column>
                    <el-table-column label="选择题">
                        <template slot-scope="scope">
                            <div>
                                <p>选择题数：{{scope.row.choiceQuestion}}</p>
                                <p>每题分值：{{scope.row.choiceQuestionScore}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="判断题">
                        <template slot-scope="scope">
                            <div>
                                <p>选择题数：{{scope.row.judgmentQuestion}}</p>
                                <p>每题分值：{{scope.row.judgmentQuestionScore}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="填空题">
                        <template slot-scope="scope">
                            <div>
                                <p>选择题数：{{scope.row.fillQuestion}}</p>
                                <p>每题分值：{{scope.row.fillQuestionScore}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            <p>{{scope.row.createTime | dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="当前状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态： ' + (scope.row.status === 1?'启用':'禁用')" placement="top" :enterable="false">
                                <el-switch
                                        @click.native="ableOrDisable(scope.row)"
                                        v-model="scope.row.status"
                                        inactive-color="#ff4949"
                                        :active-value="1"
                                        :inactive-value="0"
                                ></el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-view" @click="seeExamPaper(scope.row)" size="medium" circle></el-button>
                            <el-button type="info" icon="el-icon-edit" @click="editExamPaper(scope.row)" size="medium" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="examPaperList.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog :title="examPaperInfo.examPaperName" :visible.sync="dialogSeeEditExamPaper">
            <see-exam-paper
                v-if="dialogSeeEditExamPaper"
                @cancel="cancel"
                :examPaperInfo="examPaperInfo"
            ></see-exam-paper>
        </el-dialog>
    </div>
</template>

<script>
    import {
        teacherExamPaperDisable,
        teacherExamPaperEnable,
        teacherExamPaperList,
        teacherExamPaperSearchExamPaper
    } from "../../services/teacher";
    import dateFormat from "../../utils/dateFormat";
    import SeeExamPaper from "./component/SeeExamPaper";
    export default {
        name: "examPaper",
        components: {SeeExamPaper},
        data () {
            return {
                selectForm: {},
                examPaperList: [],
                pageList: [],
                page: 1,
                pageSize: 5,
                pageSizes: [5, 10, 20, 50],
                isDirector: false,
                dialogSeeEditExamPaper: false,
                examPaperInfo: {}
            }
        },
        created() {
            this.loadExamPaperList()
        },
        methods: {
            async loadExamPaperList () {
                const { data } = await teacherExamPaperList()
                // console.log(data)
                if (data.code === '200') {
                    this.examPaperList = data.data.map(item => {
                        return { ...item,  totalScore: item.fillQuestion * item.fillQuestionScore + item.judgmentQuestion * item.judgmentQuestionScore + item.choiceQuestion * item.choiceQuestionScore }
                    })
                    if (this.examPaperList[this.examPaperList.length - 1].realName) {
                        this.isDirector = true
                    }
                    this.handleCurrentChange(1)
                }
            },
            addExamPaper () {
                this.$router.push({name: 'AddExamPaper'})
            },
            searchExamPaper () {
                if (this.selectForm.examPaperName) {
                    this.searchExamPaperReq()
                } else {
                    this.loadExamPaperList()
                }
            },
            async searchExamPaperReq () {
                const { data } = await teacherExamPaperSearchExamPaper(this.selectForm)
                if ( data.code === '200' ) {
                    this.examPaperList = data.data.map(item => {
                        return { ...item,  totalScore: item.fillQuestion * item.fillQuestionScore + item.judgmentQuestion * item.judgmentQuestionScore + item.choiceQuestion * item.choiceQuestionScore }
                    })
                    if (this.examPaperList[this.examPaperList.length - 1].realName) {
                        this.isDirector = true
                    }
                    this.handleCurrentChange(1)
                }
            },
// 禁用/启用
            ableOrDisable (row) {
                if (row.status === 0) {
                    this.$confirm(`警告，你正在禁用 ${row.examPaperName}`, `警告`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disable(row)
                    }).catch(() => {
                        this.$message.info('已经取消')
                        row.status = 1
                    })
                } else {
                    this.enable(row)
                }
            },
            async enable (row) {
                // console.log(row)
                try {
                    const {data} = await teacherExamPaperEnable({examPaperId: row.id})
                    if (data.code === '200') {
                        this.$message.success('启用成功')
                        row.status = 1
                    } else {
                        this.$message.error('无权操作！')
                        row.status = 0
                    }
                } catch (e) {
                    row.status = 0
                }
            },
            async disable (row) {
                try {
                    const {data} = await teacherExamPaperDisable({examPaperId: row.id})
                    if (data.code === '200') {
                        this.$message.warning('禁用成功')
                        row.status = 0
                    } else {
                        this.$message.error('无权操作！')
                        row.status = 1
                    }
                } catch (e) {
                    row.status = 1
                }
            },
            seeExamPaper (row) {
                this.examPaperInfo = {...row}
                this.dialogSeeEditExamPaper = true
            },
            cancel () {
                this.examPaperInfo = {}
                this.dialogSeeEditExamPaper = false
            },
            editExamPaper (row) {
                // console.log(row)
                this.$router.push({name: 'EditExamPaper', params: {id: row.id}})
            },
// 分页-每页显示数量
            handleSizeChange(val) {
                this.pageSize = val
                this.handleCurrentChange(1)
            },
// 分页——跳转第几页
            handleCurrentChange(val) {
                this.pageList = this.examPaperList.slice((val-1)*this.pageSize, val * this.pageSize)
                // console.log( this.pageList )
            }
        },
        filters: {
            dateFormat
        }
    }
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    justify-content: left;
    align-items: center;
    .search-main {
        label {
            margin: 0 5px;
        }
        .el-button {
            margin-left: 20px;
        }
    }
}
</style>
