<template>
    <div class="teacher-class">
        <!--<el-card>
            <div class="select-header">
                <div class="select">
                    <label>学院</label>
                    <el-input placeholder="请输入学院" style="width: 150px" v-model="selectForm.college" clearable></el-input>
                    <label>专业</label>
                    <el-input placeholder="请输入专业" style="width: 150px" v-model="selectForm.major" clearable></el-input>
                    <label>年级</label>
                    <el-input placeholder="请输入年级" style="width: 150px" v-model="selectForm.grade" clearable></el-input>
                    <el-button type="primary" icon="el-icon-search" circle></el-button>
                </div>
            </div>
        </el-card>-->
        <el-card>
            <el-table
                :data="classListPagination"
                border
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                style="width: 100%">
                <el-table-column
                        fixed
                        prop="className"
                        label="班级">
                </el-table-column>
                <el-table-column
                        prop="collegeName"
                        label="学院">
                </el-table-column>
                <el-table-column
                        prop="total"
                        label="人数">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="250">
                    <template slot-scope="scope">
                        <el-button @click="seeClass(scope.row)" type="primary" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="classList.length">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import {teacherClass, teacherStudentGetStudentList} from "../../services/teacher";

    export default {
        name: "TeacherClass",
        created() {
            this.loadingClass()
        },
        data () {
            return {
                /*selectForm: {
                    college: '',
                    margin: '',
                    grade: ''
                },*/
                classList: [],
                classListPagination: [],
                // 添加、编辑数据
                classInfo: '',
                page: 1,
                pageSize: 5,
                pageSizes: [5, 10, 20, 50],
                loading: true
            }
        },
        methods: {
            async loadingClass () {
                const { data } = await teacherClass()
                if (data.code === '200') {
                    this.classList = data.data
                    this.classListPagination = this.classList.slice(0,this.pageSize)
                }
                this.loading = false
            },
            // 查看班级
            async seeClass (row) {
                console.log(row)
                const { data } = await teacherStudentGetStudentList({classId: row.id})
                if (data.code === '200') {
                    this.$store.commit('setStudentList',data.data)
                    this.$router.push({name: 'Student'})
                } else {
                    this.$message.error('请求错误!!!')
                }
            },
            // 分页操作
            handleSizeChange(val) {
                this.classListPagination = this.classList.slice(0,val)
                this.page = 1
                this.pageSize = val
            },
            handleCurrentChange(val) {
                this.classListPagination = this.classList.slice((val-1)*this.pageSize,val*this.pageSize)
            }
        }
    }
</script>

<style lang="scss" scoped>
.teacher-class {
    .el-card {
        margin: 5px;
        .el-card__body {
            .select-header {
                display: flex;
                justify-content: left;
                align-items: center;
                .select {
                    label {
                        margin-left: 10px;
                        margin-right: 10px;
                    }
                    .el-button {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
}
</style>
