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
    import {teacherQuestionBankAddQuestionBank} from "../../../services/teacher";

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
                }
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
                const { data } = await teacherQuestionBankAddQuestionBank({questionBankName: this.questionBankInfo.questionBankName})
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                } else {
                    this.$message.error('添加失败')
                }
            },
            async editQuestionBank () {
                // const { data } = await teacherQuestionBankAddQuestionBank({questionBankName: this.questionBankInfo.questionBankName})
                // if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                // } else {
                //     this.$message.error('添加失败')
                // }
            }
        }
    }
</script>

<style scoped>

</style>
