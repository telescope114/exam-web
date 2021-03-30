<template>
    <div class="create-or-edit-student">
        <h1>当前班级:{{this.classInfo.name}}</h1>
        <el-form :model="studentInfo" :rules="rules" ref="studentInfo">
            <el-form-item label="学生姓名" prop="realName" label-width="120px">
                <el-input v-model="studentInfo.realName" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherStudentAddStudent} from "../../../services/teacher";

    export default {
        name: "CreateOrEditStudent",
        props: {
            studentInfo: {
                type: Object,
                default: new Object({
                    realName: ''
                })
            },
            classInfo: {
                type: Object
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                rules: {
                    realName: [
                        { required: true, message: '不能为空!!!', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            cancel () {
                this.$emit('cancel')
            },
            submit () {
                this.$refs.studentInfo.validate((valid) => {
                    if (valid) {
                        if (!this.isEdit) {
                            this.addStudent()
                        } else {
                            this.editStudent()
                        }
                    } else {
                        this.$message.error('请填完!')
                        return false
                    }
                })
            },
            async addStudent () {
                const { data } = await teacherStudentAddStudent({
                    realName: this.studentInfo.realName,
                    collegeId: this.classInfo.collegeId,
                    majorId: this.classInfo.majorId,
                    grade: this.classInfo.grade,
                    classId: this.classInfo.classId
                })
                if (data.code === '200') {
                    this.$message.success('添加成功!!!')
                    this.$emit('success')
                } else {
                    this.$message.error('添加失败!!!')
                }
            },
            async editStudent () {
                /*const { data } = await teacherStudentAddStudent({
                    realName: this.studentInfo.realName,
                    collegeId: this.classInfo.collegeId,
                    majorId: this.classInfo.majorId,
                    grade: this.classInfo.grade,
                    classId: this.classInfo.classId
                })*/
                // if (data.code === '200') {
                    this.$message.success('添加成功!!!')
                    this.$emit('success')
                // } else {
                //     this.$message.error('添加失败!!!')
                // }
            }
        }
    }
</script>

<style scoped>

</style>
