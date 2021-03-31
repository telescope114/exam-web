<template>
    <div class="examming">
        <el-container>
            <el-aside width="200px">
                <div v-if="questionList.choiceQuestionNumber>0">
                    <h3>选择题</h3>
                    <div>
                        <el-tag v-for="index in questionList.choiceQuestionNumber" :type="answerChoiceList[(index - 1)+'']?'primary':'danger'" :key="index" @click.native="choiceNum(index)">{{index}}</el-tag>
                    </div>
                </div>
                <div v-if="questionList.judgmentQuestionNumber>0">
                    <h3>判断题</h3>
                    <div>
                        <el-tag v-for="index in questionList.judgmentQuestionNumber" :type="answerJudgmentList[(index - 1)+'']?'primary':'danger'" :key="index" @click.native="judgmentNum(index)">{{index}}</el-tag>
                    </div>
                </div>
                <div v-if="questionList.fillQuestionNumber>0">
                    <h3>填空题</h3>
                    <div>
                        <el-tag v-for="index in questionList.fillQuestionNumber" :type="answerFillList[(index - 1)+'']?'primary':'danger'" :key="index" @click.native="fillNum(index)">{{index}}</el-tag>
                    </div>
                </div>
            </el-aside>
            <el-main>
                <el-card style="height: 60vh;overflow: auto">
                    <div slot="header">
                        <h4 style="padding: 0;">{{ aimTypeName + '\t第' + ( aimQuestion + 1 ) + '题 （'+questionList[aimQuestionName+'Score']+'分）' }}</h4>
                    </div>
                    <div slot="default">
                        <div class="question-title">
                            <p>{{aimQuestionInfo.title}}</p>
                        </div>
                        <div class="question-option-list" v-if="aimType === 0">
                            <p v-for="item in aimOption" :key="item.option">{{item.option}}</p>
                        </div>
                    </div>
                </el-card>
                <el-card style="height: 10vh;margin-top: 10px">
                    <div class="answer-previous-or-next">
                        <div v-if="aimType === 0">
                            <el-button :type="aimAnswer==='A'?'primary':(aimAnswer?'':'info')" @dblclick.native="page(aimQuestion + 2)" @click="aimQuestionAnswer('A')" >A</el-button>
                            <el-button :type="aimAnswer==='B'?'primary':(aimAnswer?'':'info')" @dblclick.native="page(aimQuestion + 2)" @click="aimQuestionAnswer('B')" >B</el-button>
                            <el-button :type="aimAnswer==='C'?'primary':(aimAnswer?'':'info')" @dblclick.native="page(aimQuestion + 2)" @click="aimQuestionAnswer('C')" >C</el-button>
                            <el-button :type="aimAnswer==='D'?'primary':(aimAnswer?'':'info')" @dblclick.native="page(aimQuestion + 2)" @click="aimQuestionAnswer('D')" >D</el-button>
                        </div>
                        <div v-else-if="aimType === 1">
                            <el-radio v-model="aimAnswer" @dblclick.native="page(aimQuestion + 2)" label="true">正确</el-radio>
                            <el-radio v-model="aimAnswer" @dblclick.native="page(aimQuestion + 2)" label="false">错误</el-radio>
                        </div>
                        <div v-else-if="aimType === 2">
                            <el-input type="text" :class="aimAnswer?'':'input-no-answer'" v-model="aimAnswer" clearable></el-input>
                        </div>
                        <div>
                            <el-button type="primary" @click="page(aimQuestion)">上一题</el-button>
                            <el-button v-if="!isEnd" type="primary" @click="page(aimQuestion + 2)">下一题</el-button>
                            <el-button v-if="isEnd" type="danger" @click="dialogEndExam = true">提交</el-button>
                        </div>
                    </div>

                </el-card>
            </el-main>
        </el-container>
        <el-dialog
            title="结束考试"
            :visible.sync="dialogEndExam"
            width="30%">
                <span>确定退出考试？？？</span>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEndExam = false">取 消</el-button>
            <el-button type="danger" @click="endExam">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
    import {examPreviousOrNext, examReturnExam} from "../../../services/exam";

    export default {
        name: "Examming",
        props: {
            question: {
                type: Object,
                default: new Object({})
            },
            code: {
                type: String
            }
        },
        data () {
            return {
                questionList: [],       // 全部题目信息
                aimType: '',            // 当前题目类型
                aimTypeName: '',        // 当前题目类型名称
                aimQuestionName: '',    // 当前类型对应的变量名称
                aimQuestionList: [],    // 当前类型题目列表
                aimQuestionInfo: '',    // 当前所做的题目对象
                aimOption: [],          // 存储选择题选择题
                aimQuestion: 0,         // 第几题
                aimAnswer: '',          // 当前题目答案
                answerChoiceList: {},    // 选择题的答案列表
                answerJudgmentList: {},  // 判断题的答案列表
                answerFillList: {},      // 填空题的答案列表
                errorChoiceList: {},    // 提交失败的选择题列表
                errorJudgmentList: {},  // 提交失败的判断题列表
                errorFillList: {},      // 提交失败的填空题列表
                isEnd: false,
                dialogEndExam: false
            }
        },
        created() {
            if (this.code === '203') {
                this.continueExam()
            } else {
                this.questionList = this.question
                this.startExam()
            }
        },
        methods: {
            startExam () {
                if (this.questionList.choiceQuestionNumber > 0) {
                    this.choiceNum(1)
                } else if (this.questionList.judgmentQuestionNumber > 0) {
                    this.judgmentNum(1)
                } else if (this.questionList.fillQuestionNumber > 0) {
                    this.fillNum(1)
                } else {
                    this.$message.error('考题错误，请联系出题教师！！！！！')
                    this.isEnd = true
                }
            },
            async continueExam () {
                const { data } = await examReturnExam()
                if (data.code === '200') {
                    this.questionList = data.data
                    this.$emit('lastTime',this.questionList.timeRemaining)
                    this.$emit('setSEID',this.questionList.seid)
                    this.questionList.choiceQuestionExam.forEach((item,index) => {
                        if (item.myAnswer) {
                            this.answerChoiceList[index] = item.myAnswer
                        }
                    })
                    this.questionList.judgmentQuestionExam.forEach((item,index) => {
                        if (item.myAnswer) {
                            this.answerJudgmentList[index] = item.myAnswer
                        }
                    })
                    this.questionList.fillQuestionExam.forEach((item,index) => {
                        if (item.myAnswer) {
                            this.answerFillList[index] = item.myAnswer
                        }
                    })
                    this.startExam()
                }
            },
            setAnswer () {       // 将答案书写到指定位置
                if (this.aimAnswer) {
                    if (this.aimType === 0) {
                        if (this.answerChoiceList[this.aimQuestion] !== this.aimAnswer) {
                            this.submitAnswer()
                        }
                        this.answerChoiceList[this.aimQuestion+''] = this.aimAnswer
                    } else if (this.aimType === 1) {
                        if (this.answerJudgmentList[this.aimQuestion] !== this.aimAnswer) {
                            this.submitAnswer()
                        }
                        this.answerJudgmentList[this.aimQuestion+''] = this.aimAnswer
                    } else if (this.aimType === 2) {
                        if (this.answerFillList[this.aimQuestion] !== this.aimAnswer) {
                            this.submitAnswer()
                        }
                        this.answerFillList[this.aimQuestion+''] = this.aimAnswer
                    }
                }
            },
            async submitAnswer () {  // 答案上传服务器
                const form = {
                    eqid: this.aimQuestionInfo.id,
                    answer: this.aimAnswer,
                    id: this.aimQuestionInfo.sepId,
                    // id: this.aimQuestionInfo.id,
                    seid: this.questionList.seid,
                    score: this.questionList[this.aimQuestionName+'Score']
                }
                // console.log(form)
                const { data } = await examPreviousOrNext(form)
                // console.log(data)
                if (data.code === '200') {
                    console.log(data)
                } else if (data.code === '205') {
                    this.$message.error('时间到！！！')
                    this.endExam()
                } else {
                    this.$message.error(this.aimTypeName+'第'+(this.aimQuestion+1)+'题提交失败')
                    switch (this.aimType) {
                        case 0: this.errorChoiceList[this.aimQuestion+''] = this.aimAnswer; break
                        case 1: this.errorJudgmentList[this.aimQuestion+''] = this.aimAnswer; break
                        case 2: this.errorFillList[this.aimQuestion+''] = this.aimAnswer; break
                    }
                }
            },
            getAnswer () {          // 获取指定题目答案
                switch (this.aimType) {
                    case 0: this.aimAnswer = this.answerChoiceList[this.aimQuestion]; break
                    case 1: this.aimAnswer = this.answerJudgmentList[this.aimQuestion]; break
                    case 2: this.aimAnswer = this.answerFillList[this.aimQuestion]; break
                }
            },
            choiceNum (num) {       // 跳转到指定选择题
                this.setAnswer()
                if (this.aimType !== 0) {
                    this.aimType = 0
                    this.aimTypeName = '选择题'
                    this.aimQuestionName = 'choiceQuestion'
                    this.aimQuestionList = this.questionList[this.aimQuestionName+'Exam']
                }
                this.aimQuestion = num - 1
                this.aimQuestionInfo = this.aimQuestionList[num-1+'']
                this.aimOption = this.aimQuestionInfo.optionList
                this.getAnswer()
            },
            judgmentNum (num) {     // 跳转到指定判断题
                this.setAnswer()
                if (this.aimType !== 1) {
                    this.aimType = 1
                    this.aimTypeName = '判断题'
                    this.aimQuestionName = 'judgmentQuestion'
                    this.aimQuestionList = this.questionList[this.aimQuestionName+'Exam']
                }
                this.aimQuestion = num - 1
                this.aimQuestionInfo = this.aimQuestionList[num-1+'']
                this.aimOption = []
                this.getAnswer()
            },
            fillNum (num) {         // 跳转到指定填空题
                this.setAnswer()
                if (this.aimType !== 2) {
                    this.aimType = 2
                    this.aimTypeName = '填空题题'
                    this.aimQuestionName = 'fillQuestion'
                    this.aimQuestionList = this.questionList[this.aimQuestionName+'Exam']
                }
                this.aimQuestion = num - 1
                this.aimQuestionInfo = this.aimQuestionList[num-1+'']
                this.aimOption = []
                this.getAnswer()
            },
            aimQuestionAnswer (char) {
                if (char.length === 1) {
                    this.aimAnswer = char
                }
            },
            // 上一题、下一题
            page (num) {
                this.isEnd = false
                if (this.aimType === 0) {
                    if (num === 0) {
                        this.$message.warning('已经是第一题了')
                    } else if (num > this.questionList.choiceQuestionNumber) {
                        if (this.questionList.judgmentQuestionNumber>0) {
                            this.judgmentNum(1)
                        } else {
                            if (this.questionList.fillQuestionNumber>0) {
                                this.fillNum(1)
                            } else {
                                this.$message.warning('已经是最后一道题了')
                                this.setAnswer()
                                this.isEnd = true
                            }
                        }
                    } else {
                        this.choiceNum(num)
                    }
                } else if (this.aimType === 1) {
                    if (num === 0) {
                        if (this.questionList.choiceQuestionNumber > 0) {
                            this.choiceNum(this.questionList.choiceQuestionNumber)
                        } else {
                            this.$message.warning('已经是第一题了')
                        }
                    } else if (num > this.questionList.judgmentQuestionNumber) {
                        if (this.questionList.fillQuestionNumber > 0) {
                            this.fillNum(1)
                        } else {
                            this.$message.warning('已经是最后一道题了')
                            this.setAnswer()
                            this.isEnd = true
                        }
                    } else {
                        this.judgmentNum(num)
                    }
                } else if (this.aimType === 2) {
                    if ( num === 0) {
                        if (this.questionList.judgmentQuestionNumber > 0) {
                            this.judgmentNum(this.questionList.judgmentQuestionNumber)
                        } else if (this.questionList.choiceQuestionNumber > 0) {
                            this.choiceNum(this.questionList.choiceQuestionNumber)
                        } else {
                            this.$message.warning('已经是第一题了')
                        }
                    } else if (num > this.questionList.fillQuestionNumber) {
                        this.$message.warning('已经是最后一道题了')
                        this.setAnswer()
                        this.isEnd = true
                    } else {
                        this.fillNum(num)
                    }
                }
            },
            endExam () {
                this.$emit('endExam',this.questionList.seid)
                // const { data } = await examEndExam({seid: this.questionList.seid})
                // if (data.code === '200') {
                    // this.dialogEndExam = false
                // }
            }
        }
    }
</script>

<style lang="scss" scoped>
.examming {
    .el-container {
        height: 80vh;
        .el-aside {
            background-color: #D3DCE6;
            color: #333;
            text-align: center;
            div {

            }
        }
        .el-main {
            background-color: #E9EEF3;
            color: #333;
            text-align: left;
            .el-card__header {
                padding-bottom: 0px;
            }
        }
        .input-no-answer {
            border: 1px $danger-color solid;
        }
        .answer-previous-or-next {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}
</style>
