<template>
    <div class="teacher-teacher">
        <el-card>
            <div slot="header" class="teacher-teacher-header">
                <el-button @click="addTeacher" type="primary">添加教师</el-button>
                <el-input style="width: 200px;margin: 0 10px" placeholder="教师姓名" clearable v-model="searchTeacherName" @keydown.native.enter="search"></el-input>
                <el-button icon="el-icon-search" circle type="primary" @click="search" ></el-button>
            </div>
            <div slot="default">
                <el-table
                    :data="pageList"
                    border
                    style="width: 100%"
                    v-loading="loadingTeacher"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255,255,255,0.8)">
                    <el-table-column
                            prop="teacherNumber"
                            label="教职工编号"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="realName"
                            label="教职工姓名"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="collegeName"
                            label="隶属学院">
                    </el-table-column>
                    <el-table-column
                            label="状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态： ' + (scope.row.status === 1?'启用':'禁用')" placement="top">
                                <el-switch
                                    v-model="scope.row.status"
                                    inactive-color="#ff4949"
                                    @click.native="enableOrDisableTeacher(scope.row)"
                                    :active-value="1"
                                    :inactive-value="0"
                                ></el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="380">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="assignClass(scope.row)" size="small">分配班级</el-button>
                            <el-button type="success" @click="seeClass(scope.row)" size="small">查看班级</el-button>
                            <el-button type="info" @click="editTeacher(scope.row)" size="small">编辑</el-button>
                            <el-button type="danger" @click="resetPassword(scope.row)" size="small">重置密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="pageTeacher"
               :page-sizes="pageSizes"
               :page-size="pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="teacherList.length"></el-pagination>
        </el-card>
<!--    添加、编辑教师    -->
        <el-dialog
            :visible.sync="dialogCreateOrEditTeacher"
            :title="isEdit?'编辑教师':'添加教师'"
        >
            <create-or-edit-teacher
                v-if="dialogCreateOrEditTeacher"
                :isEdit="isEdit"
                :teacherInfo="teacherInfo"
                @success="success"
                @cancel="cancel"
            ></create-or-edit-teacher>
        </el-dialog>
<!--    查看教师拥有的班级    -->
        <el-dialog
            :visible.sync="dialogSeeClass"
            :title="'管理班级'"
        >
            <teacher-get-class
                v-if="dialogSeeClass"
                :teacherInfo="teacherInfo"
                @success="success"
            ></teacher-get-class>
        </el-dialog>
<!--    分配班级    -->
        <el-dialog title="分配班级" :visible.sync="dialogAssignClass">
            <assign-class-tree
              v-if="dialogAssignClass"
              :teacherInfo="teacherInfo"
              @success="success"
              @cancel="cancel"
            ></assign-class-tree>
        </el-dialog>
    </div>
</template>

<script>
    import {
        teacherTeacher,
        teacherTeacherDisable,
        teacherTeacherEnable,
        teacherTeacherResetPassword, teacherTeacherSearchTeacher
    } from "../../services/teacher";
    import CreateOrEditTeacher from "./component/CreateOrEditTeacher";
    import TeacherGetClass from "./component/TeacherGetClass";
    import AssignClassTree from "./component/AssignClassTree";

    export default {
        name: "TeacherTeacher",
        components: { CreateOrEditTeacher, TeacherGetClass, AssignClassTree },
        created() {
            this.loadTeacher()
        },
        data () {
            return {
                teacherList: [],
                dialogCreateOrEditTeacher: false,
                dialogSeeClass: false,
                dialogAssignClass: false,
                isEdit: false,
                teacherInfo: {},
                pageTeacher: 1,
                pageSize: 10,
                pageSizes: [10,20,50,100,500],
                pageList: [],
                loadingTeacher: false,
                searchTeacherName: ''
            }
        },
        methods: {
            async loadTeacher () {
                this.loadingTeacher = true
                const { data } = await teacherTeacher()
                this.loadingTeacher = false
                if (data.code === '200') {
                    this.teacherList = data.data
                    this.handleSizeChange(10)
                }
            },
            search () {
                if (this.searchTeacherName) {
                    this.searchReq()
                } else {
                    this.loadTeacher()
                }
            },
            async searchReq () {
                const { data } = await teacherTeacherSearchTeacher({realName: this.searchTeacherName})
                if (data.code === '200') {
                    this.teacherList = data.data
                    this.handleSizeChange(10)
                }
            },
            // 添加教师
            async addTeacher () {
                this.isEdit = false
                this.dialogCreateOrEditTeacher = true
                this.teacherInfo = new Object({})
            },
            // 启用禁用
            enableOrDisableTeacher (row) {
                if (row.status === 1) {
                    this.enableTeacher(row)
                } else {
                    this.$confirm(`警告：你正在禁用 ${row.realName}`,'禁用警告',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableTeacher(row)
                    }).catch(() => {
                        this.$message.info('已经取消')
                        row.status = 1
                    })
                }
            },
            // 启用
            async enableTeacher (row) {
                const { data } = await teacherTeacherEnable({userId: row.uid})
                if (data.code === '200') {
                    this.$message.success('启用成功')
                    row.status = 1
                } else {
                    this.$message.error('无权操作！！！')
                    row.status = 0
                }

            },
            // 禁用
            async disableTeacher (row) {
                const { data } = await teacherTeacherDisable({userId: row.uid})
                if (data.code === '200') {
                    this.$message.warning('禁用成功')
                    row.status = 0
                } else {
                    this.$message.error('无权操作！！！')
                    row.status = 1
                }
            },
            // 查看班级
            seeClass (row) {
                this.dialogSeeClass = true
                this.teacherInfo = row
            },
            // 分配班级
            assignClass (row) {
                this.teacherInfo = row
                this.dialogAssignClass = true
                // console.log(row)
            },
            // 编辑
            editTeacher (row) {
                this.isEdit = true
                this.dialogCreateOrEditTeacher = true
                this.teacherInfo = {
                    realName: row.realName,
                    teacherNumber: row.teacherNumber,
                    teacherId: row.tid,
                    collegeId: row.collegeId
                }
                // console.log(row)
            },
            // 重置密码
            resetPassword (row) {
                this.$confirm(`警告：你正在重置 ${row.realName} 的密码`,'警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.resetPasswordReq(row)
                }).catch(() => {
                    this.$message.info('已经取消')
                })
            },
            async resetPasswordReq (row) {
                const { data } = await teacherTeacherResetPassword({userId: row.uid})
                if (data.code === '200') {
                    this.$message.success('重置成功')
                } else {
                    this.$message.error('无权操作！！！！')
                }
            },
            cancel () {
                this.dialogAssignClass = false
                this.dialogSeeClass = false
                this.dialogCreateOrEditTeacher = false
                this.teacherInfo = {}
            },
            success () {
                this.dialogAssignClass = false
                this.dialogSeeClass = false
                this.dialogCreateOrEditTeacher = false
                this.teacherInfo = {}
                this.loadTeacher()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.pageTeacher = 1
                this.pageList = this.teacherList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageList = this.teacherList.slice((val-1)*this.pageSize,val*this.pageSize)
            }
        }
    }
</script>

<style lang="scss" scoped>
.teacher-teacher {
    .teacher-teacher-header {
        display: flex;
        justify-content: left;
    }
}
</style>
