<template>
    <div class="create-or-edit-teacher">
        <el-form :model="form" ref="classInfo">
            <el-form-item label="教职工编号" label-width="120px" v-if="isEdit">
                <el-input v-model="form.teacherName" disabled></el-input>
            </el-form-item>
            <el-form-item label="教职工姓名" label-width="120px">
                <el-input v-model="form.realName" clearable></el-input>
            </el-form-item>
            <el-form-item label="隶属学院" label-width="120px">
<!--                <el-input v-model="teacherInfo.collegeId" clearable></el-input>-->
                <el-select v-model="form.collegeId">
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
    import {teacherCollege, teacherTeacherAddTeacher} from "../../../services/teacher";

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
                const { data } = await teacherTeacherAddTeacher(this.form)
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                } else {
                    this.$message.error('添加失败')
                }
            },
            async editClass () {
                this.$message.success('添加成功')
                this.$emit('success')
            }
        }
    }
</script>

<style scoped>

</style>
