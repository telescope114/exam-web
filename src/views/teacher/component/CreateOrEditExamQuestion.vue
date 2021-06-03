<template>
    <div class="create-or-edit-exam-question">
        <el-form :model="examQuestionInfo" :rules="rules" ref="examQuestionInfo">
            <el-form-item label="题库" prop="qid" label-width="120px">
                <el-select v-model="examQuestionInfo.qid" style="width: 100%;">
                    <el-option value="" label="请选择" disabled></el-option>
                    <el-option v-for="item in questionBankList" :key="item.id" :value="item.id" :label="item.questionBankName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="试题题目" prop="title" label-width="120px">
                <el-input type="textarea" v-model="examQuestionInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="试题类型" prop="type" label-width="120px">
                <el-select v-model="examQuestionInfo.type" style="width: 100%;">
                    <el-option value="" label="请选择" disabled></el-option>
                    <el-option :value="0" label="单选题"></el-option>
                    <el-option :value="1" label="填空题"></el-option>
                    <el-option :value="2" label="判断题"></el-option>
                </el-select>
            </el-form-item>
            <div  v-if="examQuestionInfo.type === 0">
                <el-form-item prop="answer" label="答案" label-width="120px">
                    <el-select v-model="examQuestionInfo.answer" style="width: 100%;">
                        <el-option value="" label="请选择" disabled></el-option>
                        <el-option value="A" label="A"></el-option>
                        <el-option value="B" label="B"></el-option>
                        <el-option value="C" label="C"></el-option>
                        <el-option value="D" label="D"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="A" label-width="200px">    <el-input v-model="optionList.A.option"></el-input>   </el-form-item>
                <el-form-item label="B" label-width="200px">    <el-input v-model="optionList.B.option"></el-input>  </el-form-item>
                <el-form-item label="C" label-width="200px">    <el-input v-model="optionList.C.option"></el-input>  </el-form-item>
                <el-form-item label="D" label-width="200px">    <el-input v-model="optionList.D.option"></el-input>  </el-form-item>
            </div>
            <div  v-else-if="examQuestionInfo.type === 2">
                <el-form-item prop="answer" label="答案" label-width="120px">
                    <el-radio v-model="examQuestionInfo.answer" label="true">对</el-radio>
                    <el-radio v-model="examQuestionInfo.answer" label="false">错</el-radio>
                </el-form-item>
            </div>
            <div v-else-if="examQuestionInfo.type === 1">
                <el-form-item prop="answer" label="答案" label-width="120px">
                    <el-input v-model="examQuestionInfo.answer"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit" v-loading="loadingSubmit">确定</el-button>
        </div>
    </div>
</template>

<script>
    import {
        teacherExamQuestionAddExamQuestion, teacherExamQuestionEditExamQuestion,
        teacherExamQuestionGetAllQuestionBank,
        teacherExamQuestionGetExamQuestionOption
    } from "../../../services/teacher";

    export default {
        name: "CreateOrEditExamQuestion",
        created() {
            this.loadQuestionBank()
            if (this.isEdit && this.examQuestionInfo.type === 0) {
                this.loadExamQuestionOption()
            }
        },
        props: {
            examQuestionInfo: {
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
                rules: {
                    qid: [{required: true, message: '请选择', trigger: 'blur'}],
                    title: [{required: true, message: '不能为空！！！', trigger: 'blur'}],
                    type: [{required: true, message: '请选择', trigger: 'blur'}],
                    answer: [{required: true, message: '请选择', trigger: 'blur'}]
                },
                questionBankList: [],
                optionList: { A: {}, B: {}, C: {}, D: {} },
                loadingQuestionBank: false,
                loadingExamQuestionOption: false,
                loadingSubmit: false
                // 当前题目类型判定
                // questionType: ''
            }
        },
        methods: {
            async loadQuestionBank () {
                try {
                    this.loadingQuestionBank = true
                    const {data} = await teacherExamQuestionGetAllQuestionBank()
                    this.loadingQuestionBank = false
                    if (data.code === '200') {
                        this.questionBankList = data.data
                        console.log(this.questionBankList)
                    }
                } catch (e) {
                    this.loadingQuestionBank = false
                }
            },
            async loadExamQuestionOption () {
                try {
                    this.loadingExamQuestionOption = true
                    const {data} = await teacherExamQuestionGetExamQuestionOption({eid: this.examQuestionInfo.eid})
                    this.loadingExamQuestionOption = false
                    if (data.code === '200') {
                        data.data.forEach(item => {
                            this.optionList[item.option.slice(0, 1)] = {
                                id: item.id,
                                option: item.option.slice(2, item.option.length)
                            }
                        })
                    }
                } catch (e) {
                    this.loadingExamQuestionOption = false
                }
            },
            /*clearAnswer (num) {
                console.log(num)
                if (this.questionType !== num) {
                //     this.examQuestionInfo.answer = ''
                    this.questionType = num
                }
                // this.optionList = []
            },*/
            cancel () {
                this.$emit('cancel')
            },
            submit () {
                // console.log(this.examQuestionInfo)
                try {
                    this.loadingSubmit = true
                    this.$refs.examQuestionInfo.validate((valid) => {
                        if (valid) {
                            if (this.isEdit) {
                                this.editExamQuestion()
                            } else {
                                this.addExamQuestion()
                            }
                            this.loadingSubmit = false
                        } else {
                            this.$message.error('填写完整！！！')
                            this.loadingSubmit = false
                            return false
                        }
                    })
                } catch (e) {
                    this.loadingSubmit = false
                }
            },
            async addExamQuestion () {
                if (this.examQuestionInfo.type === 0) {
                    const form = {
                        qid: this.examQuestionInfo.qid,
                        title: this.examQuestionInfo.title,
                        type: this.examQuestionInfo.type,
                        answer: this.examQuestionInfo.answer,
                        optionA: 'A、'+this.optionList.A.option,
                        optionB: 'B、'+this.optionList.B.option,
                        optionC: 'C、'+this.optionList.C.option,
                        optionD: 'D、'+this.optionList.D.option,
                    }
                    const { data } = await teacherExamQuestionAddExamQuestion(form)
                    if (data.code === '200') {
                        this.$message.success('添加成功')
                        this.$emit('success')
                    } else if (data.code === '403') {
                        this.$message.error('试题重复（已经拥有该试题）！！')
                    }  else {
                        this.$message.error('无权操作！！')
                    }
                    // console.log(form)
                } else {
                    const form = {
                        qid: this.examQuestionInfo.qid,
                        title: this.examQuestionInfo.title,
                        type: this.examQuestionInfo.type,
                        answer: this.examQuestionInfo.answer
                    }
                    const { data } = await teacherExamQuestionAddExamQuestion(form)
                    if (data.code === '200') {
                        this.$message.success('添加成功')
                        this.$emit('success')
                    } else if (data.code === '403') {
                        this.$message.error('试题重复（已经拥有该试题）！！')
                    } else {
                        this.$message.error('无权操作！！')
                    }
                }
            },
            async editExamQuestion () {
                let form
                if (this.examQuestionInfo.type === 0) {
                    form = {
                        qid: this.examQuestionInfo.qid,
                        eid: this.examQuestionInfo.eid,
                        title: this.examQuestionInfo.title,
                        type: this.examQuestionInfo.type,
                        answer: this.examQuestionInfo.answer,
                        optionAId: this.optionList.A.id,
                        optionA: 'A、'+this.optionList.A.option,
                        optionBId: this.optionList.B.id,
                        optionB: 'B、'+this.optionList.B.option,
                        optionCId: this.optionList.C.id,
                        optionC: 'C、'+this.optionList.C.option,
                        optionDId: this.optionList.D.id,
                        optionD: 'D、'+this.optionList.D.option
                    }
                } else {
                    form = {
                        qid: this.examQuestionInfo.qid,
                        examQuestionId: this.examQuestionInfo.eid,
                        title: this.examQuestionInfo.title,
                        type: this.examQuestionInfo.type,
                        answer: this.examQuestionInfo.answer
                    }
                    // console.log(form)
                }
                const { data } = await teacherExamQuestionEditExamQuestion(form)
                if (data.code === '200') {
                    this.$message.success('编辑成功')
                    this.$emit('success')
                } else if (data.code === '403') {
                    this.$message.error('试题重复（已经拥有该试题）！！')
                }  else {
                    this.$message.error('无权操作！！')
                }
            }
        }
    }
</script>

<style scoped>

</style>
