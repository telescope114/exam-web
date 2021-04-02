<template>
<div class="create-or-edit-exam">
    <div class="steps">
        <div class="head">
            <div class="steps">
                <div :class="step>=1?'step-after':'step-before'" @click="enterStep(1)">基本信息</div>
                <div :class="step>=2?'step-after':'step-before'" @click="enterStep(2)">题目选择</div>
                <div :class="step>=3?'step-after':'step-before'" @click="enterStep(3)">时间选择</div>
                <div :class="step>=4?'step-after':'step-before'" @click="enterStep(4)">班级选择</div>
            </div>
        </div>
    </div>
    <hr>
    <div>
        <div v-show="step===1" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" :model="createOrEditExamInfo"
                         v-loading="loadingQuestionBank||loadingClassList"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(255,255,255)">
                    <h1>基本信息</h1>
                    <el-form-item label="题库名称" label-width="200px">
                        <el-input v-model="createOrEditExamInfo.examName"></el-input>
                    </el-form-item>
                    <el-form-item label="题库名称" label-width="200px">
                        <el-select v-model="createOrEditExamInfo.id" filterable >
                            <el-option :value="item.id" v-for="item in questionBankList" :key="item.id" :label="item.questionBankName" @click.native="aimQuestionBank=item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-show="step===2" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" :model="createOrEditExamInfo">
                    <h1>{{aimQuestionBank.questionBankName}}</h1>
                    <el-form-item label="选择题数量" label-width="200px">
                        <el-tooltip :content="'选择题总共：'+aimQuestionBank.choiceQuestion+'题，每题2分'"  placement="right">
                            <el-input type="number" v-model="createOrEditExamInfo.choiceQuestion" style="width:100px;" @blur="outNumber"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="判断题数量" label-width="200px">
                        <el-tooltip :content="'判断题总共：'+aimQuestionBank.judgmentQuestion+'题，每题2分'"  placement="right">
                            <el-input type="number" v-model="createOrEditExamInfo.judgmentQuestion" style="width:100px;" @blur="outNumber"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="填空题数量" label-width="200px">
                        <el-tooltip :content="'填空题总共：'+aimQuestionBank.fillQuestion+'题，每题2分'"  placement="right">
                            <el-input type="number" v-model="createOrEditExamInfo.fillQuestion" style="width:100px;" @blur="outNumber"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <h1>总分：{{createOrEditExamInfo.totalScore}}</h1>
                </el-form>
            </div>
        </div>
        <div v-show="step===3" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" ref="createOrEditExamInfo" :model="createOrEditExamInfo">
                    <h1>时间选择</h1>
                    <el-form-item label="开考时间" label-width="200px">
                        <el-date-picker
                                v-model="createOrEditExamInfo.openTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" label-width="200px">
                        <el-date-picker
                                v-model="createOrEditExamInfo.closeTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-show="step===4" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" :model="createOrEditExamInfo">
                    <el-form-item label="参加考试班级" label-width="200px">
                        <el-select v-model="createOrEditExamInfo.ids" multiple placeholder="请选择" clearable>
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.className"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button :disabled="step===1" type="primary" @click="enterStep(step-1)">上一步</el-button>
        <el-button v-show="step!==4" type="primary" @click="enterStep(step+1)"
                   v-loading="loadingQuestionBank||loadingClassList||loadingEdit"
                   element-loading-text="拼命加载中">下一步</el-button>
        <el-button v-show="step===4" type="primary" @click="submit"
                   v-loading="loadingSubmit">确定</el-button>
    </div>
</div>
</template>

<script>
    import {
        teacherExamAddExamSubmit,
        teacherExamGetClass,
        teacherQuestionBank
    } from "../../../services/teacher";
    import questionBank from "../questionBank";

    export default {
        name: "CreateOrEditExam",
        props: {
            examInfo: {
                type: Object,
                default: new Object({})
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                step: 1,
                // checkStep: [],
                questionBankList: [],
                classList: [],
                // 被选中的题库
                aimQuestionBank: {},
                createOrEditExamInfo: {
                    choiceQuestion: 0,
                    choiceQuestionScore: 2,
                    fillQuestion: 0,
                    fillQuestionScore: 2,
                    judgmentQuestion: 0,
                    judgmentQuestionScore: 2,
                    duration: 120,
                    totalScore: 0
                },
                loadingQuestionBank: true,
                loadingSubmit: true,
                loadingClassList: true,
                loadingEdit: false
            }
        },
        created() {
            this.loadQuestionBank()
            this.loadClassList()
            if (this.isEdit) {
                // 编辑时再请求一次
                console.log(this.isEdit)
            }
        },
        methods: {
            async loadQuestionBank () {
                this.loadingQuestionBank = true
                this.loadingClassList = true
                const { data } = await teacherQuestionBank()
                this.loadingQuestionBank = false
                this.loadingClassList = false
                if (data.code === '200') {
                    this.questionBankList = data.data
                    console.log(questionBank)
                }
            },
            async loadClassList () {
                const { data } = await teacherExamGetClass()
                if (data.code === '200') {
                    this.classList = data.data
                    console.log(questionBank)
                }
            },
            cancel () {
                this.$emit('cancel')
            },
            enterStep (num) {
                switch (this.step) {
                    case 1: {
                        if (this.createOrEditExamInfo.examName && this.createOrEditExamInfo.id) {
                            this.step = num
                        } else {
                            this.$message.error('基本信息不完整！！')
                        }
                        break
                    }
                    case 2: {
                        if (
                            this.createOrEditExamInfo.choiceQuestion >= 0 &&
                            this.createOrEditExamInfo.judgmentQuestion >= 0 &&
                            this.createOrEditExamInfo.fillQuestion >= 0 &&
                            this.createOrEditExamInfo.choiceQuestion <= this.aimQuestionBank.choiceQuestion &&
                            this.createOrEditExamInfo.judgmentQuestion <= this.aimQuestionBank.judgmentQuestion &&
                            this.createOrEditExamInfo.fillQuestion <= this.aimQuestionBank.fillQuestion
                        ) {
                            this.step = num
                        } else {
                            this.$message.error('题目选择有误！！')
                        }
                        break
                    }
                    case 3: {
                        if (this.createOrEditExamInfo.openTime && this.createOrEditExamInfo.closeTime && this.createOrEditExamInfo.duration) {
                            this.step = num
                        } else {
                            this.$message.error('时间选择有误！！')
                        }
                        break
                    }
                    case 4: {
                        if (this.createOrEditExamInfo.ids !== []) {
                            this.step = num
                        } else {
                            this.$message.error('班级选择有误！！')
                        }
                        break
                    }
                }
            },
            submit () {
                this.loadingSubmit = true
                const form = this.createOrEditExamInfo
                if (form.examName && form.id) {
                    if (
                        form.choiceQuestion >= 0 &&
                        form.judgmentQuestion >= 0 &&
                        form.fillQuestion >= 0 &&
                        form.choiceQuestion <= this.aimQuestionBank.choiceQuestion &&
                        form.judgmentQuestion <= this.aimQuestionBank.judgmentQuestion &&
                        form.fillQuestion <= this.aimQuestionBank.fillQuestion
                    ) {
                        if (form.openTime && form.closeTime && form.duration) {
                            if (this.createOrEditExamInfo.ids !== []) {
                                if (this.isEdit) {
                                    this.editExam()
                                } else {
                                    this.addExam()
                                }
                                this.loadingSubmit = false
                            } else {
                                this.$message.error('请选择班级！！')
                                this.loadingSubmit = false
                            }
                        } else {
                            this.$message.error('考试时间有误！！')
                            this.step = 3
                            this.loadingSubmit = false
                        }
                    } else {
                        this.$message.error('题目选择有误！！')
                        this.step = 2
                        this.loadingSubmit = false
                    }
                } else {
                    this.$message.error('基本信息不完整！！')
                    this.step = 1
                    this.loadingSubmit = false
                }
            },
            outNumber () {
                this.createOrEditExamInfo.choiceQuestion = parseInt(this.createOrEditExamInfo.choiceQuestion )
                this.createOrEditExamInfo.judgmentQuestion = parseInt(this.createOrEditExamInfo.judgmentQuestion )
                this.createOrEditExamInfo.fillQuestion = parseInt(this.createOrEditExamInfo.fillQuestion )
                this.createOrEditExamInfo.totalScore = ( this.createOrEditExamInfo.choiceQuestion + this.createOrEditExamInfo.judgmentQuestion + this.createOrEditExamInfo.fillQuestion ) * 2
            },
            async addExam () {
                console.log(this.createOrEditExamInfo)
                const { data } = await teacherExamAddExamSubmit(this.createOrEditExamInfo)
                // console.log(data)
                if (data.code === '200') {
                    this.$message.success('添加成功！')
                    this.$emit('success')
                }
            },
            async editExam () {}
        }
    }
</script>

<style lang="scss" scoped>
.create-or-edit-exam {
    .head {
        .steps {
            display: flex;
            justify-content: center;
            .step-after {
                margin: 0 30px;
                color: $primary-color;
            }
            .step-before {
                font-weight: bold;
                margin: 0 30px;
                color: $danger-color;
            }
        }
    }
}
</style>
