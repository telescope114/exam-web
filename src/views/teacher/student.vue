<template>
    <div class="teacher-student">
        <div class="teacher-student-aside">
            <el-card class="el-card-aside">
                <el-tree
                    v-loading="loadingClassList"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255,255,255,0.8)"
                    :data="classList"
                    :props="defaultProps"
                    node-key="classId"
                    ref="classList"
                    @node-click="handleNodeClick"
                    accordion
                ></el-tree>
            </el-card>
        </div>
        <div class="teacher-student-main">
            <el-card class="el-card-search">
                <div class="teacher-student-header">
                    <el-button @click="addStudent" :disabled="!classInfo" size="small" type="primary" v-if="$store.state.role===0">添加学生</el-button>
                    <div class="select">
                        <label>学生姓名</label>
                        <el-input placeholder="请输入学生姓名" style="width: 150px" v-model="selectForm.studentName" clearable></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="selectStudentName" circle></el-button>
                    </div>
                </div>
            </el-card>
            <el-card class="el-card-content">
                <div class="teacher-student-content">
                    <h5 style="text-align: left">{{this.classInfo.name}}</h5>
                    <el-table
                        :data="studentList"
                        border
                        v-loading="loadingStudentList"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255,255,255)"
                        style="width: 100%">
                        <el-table-column
                            fixed
                            prop="realName"
                            label="姓名"
                            width="100"
                        ></el-table-column>
                        <el-table-column
                            label="学号"
                            width="150"
                        >
                            <template slot-scope="scope">
                                <p>{{scope.row.studentNumber?scope.row.studentNumber:'******'}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            width="100"
                            v-if="$store.state.role===0"
                        >
                            <template slot-scope="scope">
                                <el-tooltip :content="'当前状态：'+(scope.row.status?'启用':'禁用')" placement="top" :enterable="false">
                                    <el-switch
                                        v-model="scope.row.status"
                                        @click.native="ableOrDisableStatus(scope.row)"
                                        :active-value="1"
                                        :inactive-value="0"
                                        inactive-color="#ff4949"
                                    ></el-switch>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="班级"
                        >
                            <template slot-scope="scope">
                                <p>{{scope.row.majorName + scope.row.grade + '' + scope.row.classNumber}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="majorName"
                            label="专业"
                        ></el-table-column>
                        <el-table-column
                            prop="collegeName"
                            label="学院"
                        ></el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="150"
                        >
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="editStudent(scope.row)" v-if="$store.state.role===0">编辑</el-button>
                                <el-button size="mini" type="text" @click="resetStudentPassword(scope.row)">重置密码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
        <el-dialog :title="isEdit?'编辑学生':'添加学生'" :visible.sync="dialogCreateOrEditStudent">
            <create-or-edit-student
                v-if="dialogCreateOrEditStudent"
                :classInfo="classInfo"
                :studentInfo="studentInfo"
                :classList="classList"
                :isEdit="isEdit"
                @success="success"
                @cancel="cancel"
            ></create-or-edit-student>
        </el-dialog>
    </div>
</template>

<script>
    import {
        teacherStudent,
        teacherStudentDisable,
        teacherStudentEnable,
        teacherStudentGetStudentList, teacherStudentResetPassword, teacherStudentSearchStudentName
    } from "../../services/teacher";
    import {collegeMajorClass} from "../../utils/teacher";
    import CreateOrEditStudent from "./component/CreateOrEditStudent";

    export default {
        name: "TeacherStudent",
        components: { CreateOrEditStudent },
        created() {
            this.loadClassList()
            this.loadStudentList()
        },
        data () {
            return {
                selectForm: {
                    studentName: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                classList: [],
                studentList: [],
                dialogCreateOrEditStudent: false,
                isEdit: false,
                classInfo: '',
                studentInfo: {},
                loadingClassList: false,
                loadingStudentList: false
            }
        },
        methods: {
            async loadClassList() {
                try {
                    this.loadingClassList = true
                    const {data} = await teacherStudent()
                    this.loadingClassList = false
                    if (data.code === '200') {
                        this.classList = collegeMajorClass(data.data)
                    }
                } catch (e) {
                    this.loadingClassList = false
                }
            },
            loadStudentList() {
                if (this.$store.studentList !== '') {
                    this.studentList = this.$store.state.studentList
                    // this.$message.warning('当前为查看状态,若是要添加学生,请选则到对应为班级')
                    this.$store.commit('setStudentList', null)
                }
            },
            // 搜索学生
            selectStudentName () {
                if (!this.selectForm.studentName) {
                    return
                } else {
                    this.selectStudentNameReq()
                }
            },
            async selectStudentNameReq () {
                const { data } = await teacherStudentSearchStudentName({studentName: this.selectForm.studentName})
                if (data.code === '200') {
                    this.studentList = data.data
                } else if (data.code === '402') {
                    console.log(data)
                }
            },
            addStudent() {
                // console.log(this.classInfo)
                this.studentInfo = {}
                this.isEdit = false
                this.dialogCreateOrEditStudent = true
            },
            handleNodeClick(data) {
                if (typeof (data.classId) === "number") {
                    this.classInfo = data
                    // console.log(data)
                    this.getStudentList(this.classInfo)
                }
            },
            // 获取学生列表
            async getStudentList(row) {
                try {
                    this.loadingStudentList = true
                    const {data} = await teacherStudentGetStudentList({classId: row.classId})
                    this.loadingStudentList = false
                    if (data.code === '200') {
                        this.studentList = data.data
                    }
                } catch (e) {
                    this.loadingStudentList = false
                }
            },
            // 启用/禁用
            ableOrDisableStatus(row) {
                if (row.status === 0) {
                    this.$confirm(`警告：你正在禁用 ${row.realName} `,'禁用警告',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableStudent(row)
                    }).catch(() => {
                        row.status = 1
                    })
                } else {
                    this.ableStudent(row)
                }
            },
            // 启用
            async ableStudent (row) {
                try {
                    const {data} = await teacherStudentEnable({userId: row.userId})
                    if (data.code === '200') {
                        this.$message.success('启用成功！！')
                        row.status = 1
                    } else {
                        this.$message.error('无权操作！！')
                        row.status = 0
                    }
                } catch (e) {
                    row.status = 0
                }
            },
            // 禁用
            async disableStudent (row) {
                // console.log('userId='+row.userId)
                try {
                    const {data} = await teacherStudentDisable({userId: row.userId})
                    if (data.code === '200') {
                        this.$message.warning('禁用成功！！')
                        row.status = 0
                    } else {
                        this.$message.error('无权操作！！')
                        row.status = 1
                    }
                } catch (e) {
                    row.status = 1
                }
            },
            // 编辑学生
            editStudent (row) {
                console.log(row)
                this.studentInfo = {
                    collegeId: this.classInfo.collegeId,
                    majorId: this.classInfo.majorId,
                    classId: this.classInfo.classId,
                    id: row.id,
                    realName: row.realName,
                    userId: row.userId
                }
                // this.classInfo = this.classList
                this.isEdit = true
                this.dialogCreateOrEditStudent = true
            },
            // 重置密码
            resetStudentPassword (row) {
                this.$confirm(`警告！你正在重置 ${row.realName} 的密码`,`警告`,{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.resetStudentPasswordReq(row)
                }).catch(() => {
                    this.$message.info('已经取消了')
                })
            },
            async resetStudentPasswordReq (row) {
                const { data } = await teacherStudentResetPassword({userId: row.userId})
                if (data.code === '200') {
                    this.$message.warning('重置成功，初始密码为 123456')
                } else {
                    this.$message.error('无权操作')
                }
            },
            success () {
                this.dialogCreateOrEditStudent = false
                this.studentInfo = {}
                this.getStudentList(this.classInfo)
            },
            cancel () {
                this.dialogCreateOrEditStudent = false
                this.studentInfo = {}
            }
        }
    }
</script>

<style lang="scss" scoped>
.teacher-student {
    display: flex;
    justify-content: left;
    .teacher-student-aside {
        width: 20%;
        margin-right: 10px;
        /*.el-card {
            height: 60vh;
        }*/
    }
    .teacher-student-main {
        width: 75%;
        /*.el-card {
            .el-card__body {
                .teacher-student-header {
                    height: 8vh;
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
        }*/
    }
    .el-card-aside {
        height: 70vh;
        padding-bottom: 5px;
    }
    .el-card-search {
        height: 10vh;
        .teacher-student-header {
            padding: 0;
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
    .el-card-content {
        height: 60vh;
        margin-top: 5px;
        overflow: auto;
        .teacher-student-content {
            /*height: 60vh;*/
        }
    }
}
</style>
