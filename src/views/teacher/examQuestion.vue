<template>
    <div class="teacher-exam-question">
        <el-card>
            <div class="search">
                <el-button type="primary" @click="addExamQuestion" v-if="$store.state.role">添加试题</el-button>
                <div class="search-main">
                    <label>试题类型：</label>
                    <el-select v-model="selectForm.examQuestionType" style="width: 100px">
                        <el-option v-for="item of examQuestionTypeTitle" :key="item.value" :label="item.title" :value="item.value" @click.native="choiceList"></el-option>
                    </el-select>
                    <label>题库名称：</label>
                    <el-select v-model="selectForm.questionBankId" filterable placeholder="请选择" style="width: 150px">
                        <el-option label="全部" :value="''" @click.native="choiceList"></el-option>
                        <el-option
                            v-for="item in questionBankList"
                            :key="item.id"
                            :label="item.questionBankName"
                            :value="item.id"
                            @click.native="choiceList">
                        </el-option>
                    </el-select>
<!--                    <el-input v-model="selectForm.questionBankName" style="width: 150px" clearable></el-input>-->
                    <label>试题名称：</label>
                    <el-input v-model="selectForm.examQuestionName" @keydown.native.enter="searchExamquestionName" style="width: 150px" clearable></el-input>
                    <el-button type="primary" circle @click="searchExamquestionName" icon="el-icon-search"></el-button>
                </div>
            </div>
        </el-card>
        <el-card>
            <div class="exam-question-content">
                <el-table :data="pageList" border style="width: 100%;" v-loading="loadingExamQuestion" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.8)">
                    <el-table-column label="题库" prop="questionBankName"></el-table-column>
                    <el-table-column
                            v-if="$store.state.role === 0"
                            prop="teacherName"
                            label="负责教师"
                    ></el-table-column>
                    <el-table-column label="题型">
                        <template slot-scope="scope">
                            <p>{{scope.row.type > 0 ? ( scope.row.type > 1 ? '判断题' : '填空题') : '选择题'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="试题题目" width="200">
                        <template slot-scope="scope">
                            <el-tooltip v-if="scope.row.title.length > 10" :content="scope.row.title" placement="top">
                                <p>{{scope.row.title | hideString}}</p>
                            </el-tooltip>
                            <p v-else>{{scope.row.title}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="答案" width="200">
                        <template slot-scope="scope">
                            <el-tooltip v-if="scope.row.answer.length >10" :content="scope.row.answer" placement="top">
                                <p>{{scope.row.answer| hideString}}</p>
                            </el-tooltip>
                            <p v-else>{{scope.row.answer}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="100">
                        <template slot-scope="scope">
                            <p>{{scope.row.createTime | dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态：' + (scope.row.status?'启用':'禁用')" placement="top" :enterable="false">
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
    import {
        teacherExamQuestion, teacherExamQuestionDisable, teacherExamQuestionEnable,
        teacherExamQuestionGetAllQuestionBank,
        teacherExamQuestionGetExamQuestionOption, teacherExamQuestionSearchTitle
    } from "../../services/teacher";
    import dateFormat from "../../utils/dateFormat";
    import { hideString } from "../../utils/teacher";
    import CreateOrEditExamQuestion from "./component/CreateOrEditExamQuestion";

    export default {
        name: "TeacherExamQuestion",
        components: {CreateOrEditExamQuestion},
        created() {
            this.loadExamQuestion()
            this.loadQuestionBank()
        },
        data () {
            return {
                examQuestionAllList: [],
                examQuestionList: [],
                selectForm: {
                    questionBankId: '',
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
                        title:'填空题'
                    },
                    {
                        value: 2,
                        title:'判断题'
                    }
                ],
                questionBankList: [],
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
                try {
                    this.loadingExamQuestion = true
                    const {data} = await teacherExamQuestion()
                    this.loadingExamQuestion = false
                    if (data.code === '200') {
                        this.examQuestionAllList = data.data
                        this.examQuestionList = this.examQuestionAllList
                        this.handleSizeChange(10)
                    }
                } catch (e) {
                    this.loadingExamQuestion = false
                }
            },
            async loadQuestionBank () {
                const { data } = await teacherExamQuestionGetAllQuestionBank()
                if (data.code === '200') {
                    this.questionBankList = data.data
                }
            },
            choiceList () {
                const type = this.selectForm.examQuestionType
                const questionBankId = this.selectForm.questionBankId
                // console.log('type:' + type)
                // console.log(questionBankId)
                let list = []
                this.examQuestionAllList.forEach(item => {
                    if (typeof(type) === 'number') {
                        if (typeof (questionBankId)==='number') {
                            if (type === item.type && questionBankId === item.qid) {
                                list.push(item)
                            }
                        } else {
                            console.log(type)
                            if (type === item.type) {
                                list.push(item)
                            }
                        }
                    } else {
                        console.log(0)
                        if (typeof (questionBankId)==='number') {
                            if (questionBankId === item.qid) {
                                list.push(item)
                            }
                        } else {
                            list.push(item)
                        }
                    }
                })
                // console.log(list)
                this.examQuestionList = list
                this.handleSizeChange(10)
            },
            searchExamquestionName () {
                if (this.selectForm.examQuestionName) {
                    this.searchExamQuestionNameReq()
                } else {
                    this.loadExamQuestion()
                }
            },
            async searchExamQuestionNameReq () {
                const { data } = await teacherExamQuestionSearchTitle({title: this.selectForm.examQuestionName})
                if (data.code === '200') {
                    this.examQuestionAllList = data.data
                    this.choiceList()
                }
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
                const form =  {
                    qid: row.qid,
                    eid: row.id,
                    title: row.title,
                    type: row.type,
                    answer: row.answer
                }
                this.examQuestionInfo = form
                this.isEdit = true
                this.dialogExamQuestion = true
            },
            ableOrDisable (row) {
                if (row.status === 0) {
                    this.$confirm(`禁用警告：你正在禁用 ${row.questionBankName} 的 ${row.title}`,'警告',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableExamQuestion(row)
                    }).catch(() => {
                        this.$message.info('已经取消')
                        row.status = 1
                    })
                } else {
                    this.enableExamQuestion(row)
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
            async disableExamQuestion (row) {
                try {
                    const {data} = await teacherExamQuestionDisable({examQuestionId: row.id})
                    if (data.code === '200') {
                        this.$message.warning('禁用成功')
                        row.status = 0
                    } else {
                        this.$message.error('无权操作！！！！')
                        row.status = 1
                    }
                } catch (e) {
                    row.status = 1
                }
                // this.$message.warning('已经禁用')
            },
            async enableExamQuestion (row) {
                try {
                    const {data} = await teacherExamQuestionEnable({examQuestionId: row.id})
                    if (data.code === '200') {
                        this.$message.success('启用成功')
                        row.status = 1
                    } else {
                        this.$message.error('无权操作！！！！')
                        row.status = 0
                    }
                } catch (e) {
                    row.status = 0
                }
                // this.$message.success('已经启用')
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.handleCurrentChange(1)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageExamQuestion = val
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
