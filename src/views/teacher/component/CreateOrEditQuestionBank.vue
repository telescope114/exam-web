<template>
    <div class="create-or-edit-question-bank">
        <el-form :model="questionBankInfo" :rules="rules" ref="questionBankInfo">
            <el-form-item label="题库名称" prop="questionBankName" label-width="120px">
                <el-input v-model="questionBankInfo.questionBankName" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" type="info">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherQuestionBankAddQuestionBank, teacherQuestionBankEditQuestionBank} from "../../../services/teacher";

    export default {
        name: "CreateOrEditQuestionBank",
        props: {
            questionBankInfo: {
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
                    questionBankName: [{ required: true, message: '不能为空!!!', trigger: 'blur' }]
                },
                checkQuestionName: ''
            }
        },
        created() {
            if (this.isEdit) {
                this.checkQuestionName = this.questionInfo.checkQuestionName
            }
        },
        methods: {
            cancel () {
                this.$emit('success')
            },
            submit () {
                this.$refs.questionBankInfo.validate((valid) => {
                    if (valid) {
                        console.log(this.isEdit)
                        if (!this.isEdit) {
                            this.addQuestionBank()
                        } else {
                            this.editQuestionBank()
                        }
                    } else {
                        this.$message.error('请填完!!!')
                        return false
                    }
                })

            },
            async addQuestionBank () {
                if (this.questionBankInfo.questionBankName) {
                    this.addQuestionBankReq()
                } else {
                    this.$message.error('题库名称不能为空！！！！')
                }
            },
            async addQuestionBankReq () {
                const { data } = await teacherQuestionBankAddQuestionBank({questionBankName: this.questionBankInfo.questionBankName})
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                }else if (data.code === '403') {
                    this.$message.error('不可重名！！！')
                } else {
                    this.$message.error('无权操作！！')
                }
            },
            editQuestionBank () {
                if (this.questionBankInfo.questionBankName !== this.checkQuestionName) {
                    this.editQuestionBankReq()
                } else if (this.questionBankInfo.questionBankName === this.checkQuestionName) {
                    this.$message.error('没有任何修改！！！！')
                } else {
                    this.$message.error('题库名称不能为空！！！！')
                }

            },
            async editQuestionBankReq () {
                const { data } = await teacherQuestionBankEditQuestionBank({
                    questionBankId: this.questionBankInfo.questionBankId,
                    questionBankName: this.questionBankInfo.questionBankName
                })
                if (data.code === '200') {
                    this.$message.success('编辑成功')
                    this.$emit('success')
                }else if (data.code === '403') {
                    this.$message.error('不可重名！！！')
                } else {
                    this.$message.error('无权操作！！')
                }
            }
        }
    }
</script>

<style scoped>

</style>
