<template>
    <div class="create-or-edit-exam-paper">
        <el-card>
            <div class="el-card-item">
                <h1>试卷名称</h1>
                <el-input v-model="examPaperForm.examPaperName"/>
            </div>
            <div class="el-card-item">
                <h1>题库名称</h1>
                <el-select v-model="examPaperForm.questionBankId" @change="getExamQuestionListReq">
                    <el-option
                        v-for="item in questionBankList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.questionBankName"
                    ></el-option>
                </el-select>
            </div>
            <div class="el-card-item">
                <h1>选择题</h1>
                <el-input v-model="examPaperForm.choiceQuestionScore" style="width: 150px;margin-left: 80px" placeholder="每题分值" type="number" />
                <el-button :disabled="!examPaperForm.questionBankId" type="primary" @click="choiceQuestion(0)">编辑</el-button>
                <span style="margin-left: 20px;">已选中 {{examPaperForm.choiceQuestionList.length}}</span>
            </div>
            <div class="el-card-item">
                <h1>判断题</h1>
                <el-input v-model="examPaperForm.judgementQuestionScore" style="width: 150px;margin-left: 80px" placeholder="每题分值" type="number" />
                <el-button :disabled="!examPaperForm.questionBankId" type="primary" @click="choiceQuestion(2)">编辑</el-button>
                <span style="margin-left: 20px;">已选中 {{examPaperForm.judgementQuestionList.length}}</span>
            </div>
            <div class="el-card-item">
                <h1>填空题</h1>
                <el-input v-model="examPaperForm.fillQuestionScore" style="width: 150px;margin-left: 80px" placeholder="每题分值" type="number" />
                <el-button :disabled="!examPaperForm.questionBankId" type="primary" @click="choiceQuestion(1)">编辑</el-button>
                <span style="margin-left: 20px;">已选中 {{examPaperForm.fillQuestionList.length}}</span>
            </div>
            <div>
                <h1>总分：{{totalScore}}</h1>
            </div>
            <div class="footer">
                <el-button v-if="isEdit" type="primary" @click="submitExamPaper">修改</el-button>
                <el-button v-else type="primary" @click="submitExamPaper">添加</el-button>
            </div>
            <div class="el-card-item-show-question" v-if="examPaperForm.choiceQuestionList.length">
                <h1>选择题部分</h1>
                <el-table :data="examPaperForm.choiceQuestionList">
                    <el-table-column label="题目" prop="title"></el-table-column>
                    <el-table-column label="答案" prop="answer"></el-table-column>
                    <el-table-column label="选项">
                        <template slot-scope="scope">
                            <div>
                                <p v-for="(item, index) in scope.row.option" :key="index">{{item.option}}</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="el-card-item-show-question" v-if="examPaperForm.judgementQuestionList.length">
                <h1>判断题部分</h1>
                <el-table :data="examPaperForm.judgementQuestionList">
                    <el-table-column label="题目" prop="title"></el-table-column>
                    <el-table-column label="答案" prop="answer"></el-table-column>
                </el-table>
            </div>
            <div class="el-card-item-show-question" v-if="examPaperForm.fillQuestionList.length">
                <h1>填空题部分</h1>
                <el-table :data="examPaperForm.fillQuestionList">
                    <el-table-column label="题目" prop="title"></el-table-column>
                    <el-table-column label="答案" prop="answer"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-dialog title="选择题" :visible.sync="dialogQuestion">
            <choice-question
                v-if="dialogQuestion"
                :questionList="questionList"
                :questionListType="questionListType"
                :checkedList="checkedList"
                @success="success"
                @cancel="cancel"
            ></choice-question>
        </el-dialog>
    </div>
</template>

<script>
    import {
        teacherExamAddExamAdd,
        teacherExamPaperGetExamQuestion,
        teacherExamPaperSubmitExamPaper
    } from "../../../services/teacher";
    import ChoiceQuestion from "./ChoiceQuestion";

    export default {
        name: "CreateOrEditExamPaper",
        components: {ChoiceQuestion},
        data () {
            return {
                isEdit: false,
                examPaperForm: {
                    examPaperName: '',
                    questionBankId: '',
                    choiceQuestionScore: 2,
                    choiceQuestionList: [],
                    judgementQuestionScore: 2,
                    judgementQuestionList: [],
                    fillQuestionScore: 2,
                    fillQuestionList: []
                },
                questionBankList: [],
                questionBankInfo: {},
                questionList: [],
                questionListType: 0,
                checkedList: [],
                dialogQuestion: false
            }
        },
        computed: {
            choiceScore: function() {
                return this.examPaperForm.choiceQuestionScore * this.examPaperForm.choiceQuestionList.length
            },
            judgementScore: function () {
                return this.examPaperForm.judgementQuestionScore * this.examPaperForm.judgementQuestionList.length
            },
            fillScore: function () {
                return this.examPaperForm.fillQuestionScore * this.examPaperForm.fillQuestionList.length
            },
            totalScore: function() {
                return this.choiceScore + this.judgementScore + this.fillScore
            }
        },
        created() {
            this.isEdit = false
            if (this.$route.params.id) {
                this.loadExamPaper(this.$route.params.id)
            }
            this.loadQuestionBank()
        },
        methods: {
// 编辑时的后续操作
            async loadExamPaper (id) {
                console.log(id)
                this.isEdit = true
            },
// 获取题库列表
            async loadQuestionBank () {
                const { data } = await teacherExamAddExamAdd()
                if (data.code === '200') {
                    this.questionBankList = data.data
                }
            },
// 请求试题
            async getExamQuestionListReq () {
                this.examPaperForm = {
                    examPaperName: this.examPaperForm.examPaperName,
                    questionBankId: this.examPaperForm.questionBankId,
                    choiceQuestionScore: 2,
                    choiceQuestionList: [],
                    judgementQuestionScore: 2,
                    judgementQuestionList: [],
                    fillQuestionScore: 2,
                    fillQuestionList: []
                }
                const { data } = await teacherExamPaperGetExamQuestion({questionBankId: this.examPaperForm.questionBankId})
                // console.log(data)
                if (data.code === '200') {
                    this.questionBankInfo = data.data
                }
            },
// 添加试题弹窗
            choiceQuestion (QuestionType) {
                switch (QuestionType) {
                    case 0: this.checkedList = [...this.examPaperForm.choiceQuestionList]; this.questionListType = 0; this.questionList = [...this.questionBankInfo.choiceQuestion]; break;
                    case 1: this.checkedList = [...this.examPaperForm.fillQuestionList]; this.questionListType = 1; this.questionList = [...this.questionBankInfo.fillQuestion]; break;
                    case 2: this.checkedList = [...this.examPaperForm.judgementQuestionList]; this.questionListType = 2; this.questionList = [...this.questionBankInfo.judgementQuestion]; break;
                }
                this.dialogQuestion = true
            },
// 确定
            success (backQuestionList) {
                switch (this.questionListType) {
                    case 0: this.examPaperForm.choiceQuestionList = backQuestionList; break;
                    case 1: this.examPaperForm.fillQuestionList = backQuestionList; break;
                    case 2: this.examPaperForm.judgementQuestionList = backQuestionList; break;
                }
                this.dialogQuestion = false
            },
// 取消
            cancel () {
                this.dialogQuestion = false
            },
// 提交
            async submitExamPaper () {
                const form = {
                    examPaperName: this.examPaperForm.examPaperName,
                    questionBankId: this.examPaperForm.questionBankId,
                    examQuestionIds: [...this.examPaperForm.choiceQuestionList.map(item => item.id),...this.examPaperForm.judgementQuestionList.map(item => item.id),...this.examPaperForm.fillQuestionList.map(item => item.id)],
                    choiceQuestion: this.examPaperForm.choiceQuestionList.length,
                    judgementQuestion: this.examPaperForm.judgementQuestionList.length,
                    fillQuestion: this.examPaperForm.fillQuestionList.length,
                    choiceQuestionScore: this.choiceScore,
                    judgementQuestionScore: this.judgementScore,
                    fillQuestionScore: this.fillScore,
                }
                // console.log(form)
                const { data } = await teacherExamPaperSubmitExamPaper(form)
                // console.log(data)
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$router.push({ name: 'ExamPaper' })
                } else {
                    this.$message.error('添加失败')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.create-or-edit-exam-paper {
    .el-card {
        overflow: auto;
    }
    .el-card-item {
        height: 40px;
        line-height: 40px;
        padding: 0 40px;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        h1 {
            padding: 0;
            margin: 0;
        }
        .el-input {
            margin-left: 30px;
            width: 400px;
        }
        .el-select {
            margin-left: 30px;
            width: 400px;
        }
        .el-button {
            margin-left: 50px;
            width: 100px;
        }
    }
    .el-card-item-show-question {
        margin-bottom: 20px;
    }
    .footer {
        .el-button {
            margin: 10px 0px;
            width: 300px;
        }
    }
}
</style>
