<template>
<div class="create-or-edit-custom-exam">
    <div class="steps">
        <div class="head">
            <div class="steps">
                <div :class="step>=1?'step-after':'step-before'" @click="enterStep(1)">基本信息</div>
                <div :class="step>=2?'step-after':'step-before'" @click="enterStep(2)">时间选择</div>
                <div :class="step>=3?'step-after':'step-before'" @click="enterStep(3)">班级选择</div>
            </div>
        </div>
    </div>
    <hr>
    <div>
        <div v-show="step===1" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" :model="createOrEditCustomExamInfo"
                         v-loading="loadingExamPaper||loadingClassList"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(255,255,255)">
                    <h1>基本信息</h1>
                    <el-form-item label="考试名称" label-width="200px">
                        <el-input v-model="createOrEditCustomExamInfo.examName"></el-input>
                    </el-form-item>
                    <el-form-item label="考试试卷" label-width="200px">
                        <el-select v-model="createOrEditCustomExamInfo.examPaperId" filterable>
                            <el-option v-for="item in examPaperList" :key="item.id" :label="item.examPaperName" :value="item.id" @click.native="getTotalScore(item)"></el-option>
                        </el-select>
                    </el-form-item>
                    <h1>试卷总分：{{createOrEditCustomExamInfo.totalScore}}</h1>
                </el-form>
            </div>
        </div>
        <div v-show="step===2" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" ref="createOrEditCustomExamInfo" :model="createOrEditCustomExamInfo">
                    <h1>时间选择</h1>
                    <el-form-item label="开考时间" label-width="200px">
                        <el-date-picker
                                v-model="createOrEditCustomExamInfo.openTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" label-width="200px">
                        <el-date-picker
                                v-model="createOrEditCustomExamInfo.closeTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="考试时长(分钟)" label-width="200px">
                        <el-input type="number" v-model="createOrEditCustomExamInfo.duration"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-show="step===3" style="height: 40vh">
            <div class="content-exam-info">
                <el-form :label-position="'right'" :model="createOrEditCustomExamInfo">
                    <el-form-item label="参加考试班级" label-width="200px">
                        <el-select v-model="createOrEditCustomExamInfo.ids" multiple placeholder="请选择">
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
        <el-button v-show="step!==3" type="primary" @click="enterStep(step+1)"
                   v-loading="loadingExamPaper||loadingClassList||loadingEdit">下一步</el-button>
        <el-button v-show="step===3" type="primary" @click="submit"
                   v-loading="loadingSubmit">确定</el-button>
    </div>
</div>
</template>

<script>

    import {
        teacherExamCustomExamPaperGetExamPaper,
        teacherExamCustomExamPaperSubmit,
        teacherExamGetClass
    } from "../../../services/teacher";

    export default {
        name: "CreateOrEditCustomExam",
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
                examPaperList: [],
                classList: [],
                // 被选中的题库
                aimQuestionBank: {},
                createOrEditCustomExamInfo: {
                    examName: '',
                    duration: 120,
                    examPaperId: '',
                    totalScore: 0
                },
                loadingExamPaper: false,
                loadingSubmit: false,
                loadingClassList: false,
                loadingEdit: false
            }
        },
        created() {
            this.loadingExamPaper = true
            this.loadingClassList = true
            this.loadExamPaper()
            this.loadClassList()
        },
        methods: {
            async loadExamPaper () {
                const { data } = await teacherExamCustomExamPaperGetExamPaper()
                this.loadingExamPaper = false
                if (data.code === '200') {
                    this.examPaperList = data.data
                    if (this.isEdit) {
                        console.log('edit')
                    }
                }
            },
            async loadClassList () {
                const { data } = await teacherExamGetClass()
                this.loadingClassList = false
                if (data.code === '200') {
                    this.classList = data.data
                }
            },
            async loadEdit () {
            },
// 获取试卷总成绩
            getTotalScore (item) {
                // console.log(item)
                this.createOrEditCustomExamInfo.totalScore = item.choiceQuestion * item.choiceQuestionScore + item.judgmentQuestion * item.judgmentQuestionScore + item.fillQuestion * item.fillQuestionScore
            },
            cancel () {
                this.$emit('cancel')
            },
            enterStep (num) {
                this.step = num
            },
            submit () {
                // if (this.createOrEditCustomExamInfo)
                /*if (this.isEdit) {
                    this.editCustomExam()
                } else {
                    this.addCustomExam()
                }*/
            },
            async addCustomExam () {
                // console.log(this.createOrEditCustomExamInfo)
                const { data } = await teacherExamCustomExamPaperSubmit({...this.createOrEditCustomExamInfo, duration: parseInt(this.createOrEditCustomExamInfo.duration)})
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                } else {
                    this.$message.error('添加失败')
                }
            },
            async editCustomExam () {

            }
        }
    }
</script>

<style lang="scss" scoped>
.create-or-edit-custom-exam {
    .head {
        .steps {
            display: flex;
            justify-content: center;
            .step-after {
                margin: 0 30px;
                color: $primary-color;
                cursor: pointer;
            }
            .step-before {
                font-weight: bold;
                margin: 0 30px;
                color: $danger-color;
                cursor: pointer;
            }
        }
    }
}
</style>
