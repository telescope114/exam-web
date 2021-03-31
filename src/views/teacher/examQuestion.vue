<template>
    <div class="teacher-exam-question">
        <el-card>
            <div class="search">
                <el-button type="primary" @click="addExamQuestion">添加试题</el-button>
                <div class="search-main">
                    <label>试题类型：</label>
                    <el-select v-model="selectForm.examQuestionType" style="width: 100px">
                        <el-option v-for="item of examQuestionTypeTitle" :key="item.value" :label="item.title" :value="item.value" @click.native="checkExamQuestionType"></el-option>
                    </el-select>
                    <label>题库名称：</label>
                    <el-input v-model="selectForm.questionBankName" style="width: 150px" clearable></el-input>
                    <label>试题名称：</label>
                    <el-input v-model="selectForm.examQuestionName" style="width: 150px" clearable></el-input>
                    <el-button type="primary" circle icon="el-icon-search"></el-button>
                </div>
            </div>
        </el-card>
        <el-card>
            <div class="exam-question-content">
                <el-table :data="pageList" border style="width: 100%;" v-loading="loadingExamQuestion" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.8)">
                    <el-table-column label="题库" prop="questionBankName" width="180"></el-table-column>
                    <el-table-column label="题型" width="100">
                        <template slot-scope="scope">
                            <p>{{scope.row.type > 0 ? ( scope.row.type > 1 ? '填空题' : '判断题') : '选择题'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="试题题目" width="200">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.title" placement="top">
                                <p>{{scope.row.title | hideString}}</p>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="答案" width="200">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.answer" placement="top">
                                <p>{{scope.row.answer|hideString}}</p>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="100">
                        <template slot-scope="scope">
                            <p>{{scope.row.createTime | dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态：' + (scope.row.status?'启用':'禁用')" placement="top">
                                <el-switch
                                  v-model="scope.row.status"
                                  :active-value="1"
                                  :inactive-value="0"
                                  inactive-color="#ff4949"
                                  @click.native="ableOrDisable(scope.row)"
                                ></el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon="el-icon-edit" size="small" circle @click="editExamQuestion(scope.row)"></el-button>
                            <el-button type="success" v-show="scope.row.type===0" icon="el-icon-view" size="small" circle @click="seeExamQuestion(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageExamQuestion"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="examQuestionList.length"></el-pagination>
        </el-card>
        <el-dialog :title="isEdit?'编辑试题':'添加试题'" :visible.sync="dialogExamQuestion">
            <create-or-edit-exam-question
              v-if="dialogExamQuestion"
              :examQuestionInfo="examQuestionInfo"
              :isEdit="isEdit"
              @success="success"
              @cancel="cancel"
            ></create-or-edit-exam-question>
        </el-dialog>
        <el-dialog :visible.sync="dialogExamQuestionOption" content="选项">
            <el-table :data="optionList" v-loading="false">
                <el-table-column prop="option" label="内容"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {teacherExamQuestion, teacherExamQuestionGetExamQuestionOption} from "../../services/teacher";
    import dateFormat from "../../utils/dateFormat";
    import { hideString } from "../../utils/teacher";
    import CreateOrEditExamQuestion from "./component/CreateOrEditExamQuestion";

    export default {
        name: "TeacherExamQuestion",
        components: {CreateOrEditExamQuestion},
        created() {
            this.loadExamQuestion()
        },
        data () {
            return {
                examQuestionList: [],
                selectForm: {
                    questionBankName: '',
                    examQuestionName: '',
                    examQuestionType: ''
                },
                examQuestionTypeTitle: [
                    {
                        value: '',
                        title:'全部'
                    },
                    {
                        value: 0,
                        title:'选择题'
                    },
                    {
                        value: 1,
                        title:'判断题'
                    },
                    {
                        value: 2,
                        title:'填空题'
                    }
                ],
                optionList: [],
                dialogExamQuestion: false,
                dialogExamQuestionOption: false,
                examQuestionInfo: {},
                isEdit: false,
                loadingExamQuestion: true,
                pageExamQuestion: 1,
                pageSize: 10,
                pageSizes: [10,30,50,100],
                pageList: []
            }
        },
        methods: {
            async loadExamQuestion () {
                this.loadingExamQuestion = true
                const { data } = await teacherExamQuestion()
                if (data.code === '200') {
                    this.examQuestionList = data.data
                    this.handleSizeChange(10)
                }
                this.loadingExamQuestion = false
            },
            checkExamQuestionType () {
                console.log(this.selectForm.examQuestionType)
            },
            addExamQuestion () {
                this.examQuestionInfo = {}
                this.isEdit = false
                this.dialogExamQuestion = true
            },
            async seeExamQuestion (row) {
                const { data } = await teacherExamQuestionGetExamQuestionOption({eid: row.id})
                if (data.code === '200') {
                    this.optionList = data.data
                    this.dialogExamQuestionOption = true
                }
            },
            editExamQuestion (row) {
                console.log(row)
                this.examQuestionInfo = row
                this.isEdit = true
                this.dialogExamQuestion = true
            },
            ableOrDisable (row) {
                if (row.status === 0) {
                    this.disableExamQuestion()
                } else {
                    this.enableExamQuestion()
                }
            },
            success () {
                this.dialogExamQuestion = false
                this.dialogExamQuestionOption = false
                this.loadExamQuestion()
            },
            cancel () {
                this.dialogExamQuestion = false
                this.dialogExamQuestionOption = false
            },
            async disableExamQuestion () {
                this.$message.warning('已经禁用')
            },
            async enableExamQuestion () {
                this.$message.success('已经启用')
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.pageExamQuestion = 1
                this.pageList = this.examQuestionList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageList = this.examQuestionList.slice((val-1)*this.pageSize,val*this.pageSize)
            }
        },
        filters: { dateFormat, hideString }
    }
</script>

<style lang="scss" scoped>
.teacher-exam-question {
    .search {
        display: flex;
        justify-content: left;
        .search-main {
            label {
                margin: 5px;
            }
            .el-button {
                margin-left: 20px;
            }
        }
    }
    .exam-question-content {
    }
}
</style>
