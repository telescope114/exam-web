<template>
    <div class="create-or-edit-student">
        <div v-if="!isEdit">
            <h1>当前班级:{{this.classInfo.name}}</h1>
            <el-form :model="studentInfo" :rules="rules" ref="studentInfo">
                <el-form-item label="学生姓名" prop="realName" label-width="120px">
                    <el-input v-model="studentInfo.realName" clearable></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <el-form :model="studentInfo" :rules="rules" ref="studentInfo">
                <el-form-item label="学院" prop="collegeId" label-width="120px">
                    <el-select :value="studentInfo.collegeId">
                        <el-option v-for="(item,index) in classList" :key="index" :label="item.name" :value="item.collegeId" @click.native="getMajor(item)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="majorId" label-width="120px">
                    <el-select :value="studentInfo.majorId">
                        <el-option v-for="(item,index) in majorList" :key="index" :label="item.name" :value="item.majorId" @click.native="getClass(item)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" prop="classId" label-width="120px">
                    <el-select :value="studentInfo.classId">
                        <el-option v-for="(item,index) in classInfoList" :key="index" :label="item.name" :value="item.classId" @click.native="setClass(item)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学生姓名" prop="realName" label-width="120px">
                    <el-input v-model="studentInfo.realName" clearable></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherStudentAddStudent, teacherStudentEditStudent} from "../../../services/teacher";

    export default {
        name: "CreateOrEditStudent",
        props: {
            studentInfo: {
                type: Object,
                default: new Object({
                    realName: ''
                })
            },
            classInfo: [Object],
            classList: [Array],
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                rules: {
                    realName: [{ required: true, message: '不能为空!!!', trigger: 'blur' }],
                    collegeId: [{ required: true, message: '请选择学院!!!', trigger: 'blur' }],
                    majorId: [{ required: true, message: '请选择专业!!!', trigger: 'blur' }],
                    classId: [{ required: true, message: '请选择班级!!!', trigger: 'blur' }],
                },
                majorList: [],
                classInfoList: []
            }
        },
        created() {
            console.log(this.studentInfo)
            if (this.isEdit) {
                this.classList.forEach(item => {
                    if (this.studentInfo.collegeId === item.collegeId) {
                        this.majorList = item.children
                    }
                })
                this.majorList.forEach(item => {
                    if (this.studentInfo.majorId === item.majorId) {
                        this.classInfoList = item.children
                    }
                })
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
            // 获取专业
            getMajor (item) {
                this.studentInfo.collegeId = item.collegeId
                this.majorList = item.children
                this.classInfoList = []
                this.studentInfo.majorId = ''
                this.studentInfo.classId = ''
            },
            // 获取班级
            getClass (item) {
                this.studentInfo.majorId = item.majorId
                this.studentInfo.classId = ''
                this.classInfoList = item.children
            },
            // 设置新班级
            setClass (item) {
                this.studentInfo.classId = item.classId
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
                    this.$message.error('无权操作!!!')
                }
            },
            async editStudent () {
                const { data } = await teacherStudentEditStudent({
                    classId: this.studentInfo.classId,
                    realName: this.studentInfo.realName,
                    studentId: this.studentInfo.id
                })
                if (data.code === '200') {
                    this.$message.success('编辑成功!!!')
                    this.$emit('success')
                } else {
                    // this.$message.error('编辑失败!!!')
                    this.$message.error('无权操作!!!')
                }
            }
        }
    }
</script>

<style scoped>

</style>
