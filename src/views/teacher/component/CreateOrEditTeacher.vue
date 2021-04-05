<template>
    <div class="create-or-edit-teacher">
        <el-form :model="teacherInfo" ref="classInfo">
            <el-form-item label="教职工编号" label-width="120px" v-if="isEdit">
                <el-input v-model="teacherInfo.teacherNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="教职工姓名" label-width="120px">
                <el-input v-model="teacherInfo.realName" clearable></el-input>
            </el-form-item>
            <el-form-item label="隶属学院" label-width="120px">
<!--                <el-input v-model="teacherInfo.collegeId" clearable></el-input>-->
                <el-select v-model="teacherInfo.collegeId">
                    <el-option
                        v-for="college in collegeList"
                        :key="college.id"
                        :value="college.id"
                        :label="college.collegeName"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherCollege, teacherTeacherAddTeacher, teacherTeacherEditTeacher} from "../../../services/teacher";

    export default {
        name: "CreateOrEditTeacher",
        props: {
            teacherInfo: {
                type: Object,
                default: new Object({})
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        created() {
            this.loading()
        },
        data () {
            return {
                form: {},
                collegeList: []
            }
        },
        methods: {
            async loading () {
                const { data } = await teacherCollege()
                if (data.code === '200') {
                    this.collegeList = data.data
                }
            },
            cancel () {
                this.$emit('cancel')
            },
            submit () {
                this.$refs.classInfo.validate((valid) => {
                    if (valid) {
                        if (!this.isEdit) {
                            this.createClass()
                        } else {
                            this.editClass()
                        }
                    } else {
                        this.$message.error('填写不完整!!!')
                        return false
                    }
                })
            },
            async createClass () {
                const { data } = await teacherTeacherAddTeacher({
                    collegeId: this.teacherInfo.collegeId,
                    realName: this.teacherInfo.realName
                })
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                } else {
                    this.$message.error('无权操作！！！')
                }
            },
            async editClass () {
                const { data } = await teacherTeacherEditTeacher({
                    collegeId: this.teacherInfo.collegeId,
                    teacherId: this.teacherInfo.teacherId,
                    realName: this.teacherInfo.realName
                })
                if (data.code === '200') {
                    this.$message.success('编辑成功')
                    this.$emit('success')
                } else {
                    this.$message.error('无权操作！！！')
                }
            }
        }
    }
</script>

<style scoped>

</style>
