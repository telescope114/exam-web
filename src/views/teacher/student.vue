<template>
    <div class="teacher-student">
        <div class="teacher-student-aside">
            <el-card>
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
            <el-card>
                <div class="teacher-student-header">
                    <el-button @click="addStudent" :disabled="!classInfo" size="small" type="primary">添加学生</el-button>
                    <div class="select">
                        <label>学生姓名</label>
                        <el-input placeholder="请输入年级" style="width: 150px" v-model="selectForm.studentName" clearable></el-input>
                        <el-button type="primary" icon="el-icon-search" circle></el-button>
                    </div>
                </div>
            </el-card>
            <el-card>
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
                            prop="studentNumber"
                            label="学号"
                            width="150"
                        ></el-table-column>
                        <el-table-column
                            label="状态"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-tooltip :content="'当前状态：'+(scope.row.status?'启用':'禁用')" placement="top">
                                    <el-switch
                                        v-model="scope.row.status"
                                        :active-value="1"
                                        :inactive-value="0"
                                        inactive-color="#ff4949"
                                    ></el-switch>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="班级"
                            width="150"
                        >
                            <template slot-scope="scope">
                                <p>{{scope.row.majorName + scope.row.grade + '' + scope.row.classNumber}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="majorName"
                            label="专业"
                            width="150"
                        ></el-table-column>
                        <el-table-column
                            prop="collegeName"
                            label="学院"
                            width="150"
                        ></el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="150"
                        >
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="editStudent(scope.row)">编辑</el-button>
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
                :isEdit="isEdit"
                @success="success"
                @cancel="cancel"
            ></create-or-edit-student>
        </el-dialog>
    </div>
</template>

<script>
    import {teacherStudent, teacherStudentGetStudentList} from "../../services/teacher";
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
            async loadClassList () {
                this.loadingClassList = true
                const { data } = await teacherStudent()
                this.loadingClassList = false
                if (data.code === '200') {
                    this.classList = collegeMajorClass(data.data)
                }
            },
            loadStudentList () {
                if (this.$store.studentList !== '') {
                    this.studentList = this.$store.state.studentList
                    // this.$message.warning('当前为查看状态,若是要添加学生,请选则到对应为班级')
                    this.$store.commit('setStudentList',null)
                }
            },
            addStudent () {
                // console.log(this.classInfo)
                this.studentInfo = {}
                this.isEdit = false
                this.dialogCreateOrEditStudent = true
            },
            handleNodeClick (data) {
                if (typeof(data.classId) === "number") {
                    this.classInfo = data
                    // console.log(data)
                    this.getStudentList(this.classInfo)
                }
            },
            // 获取学生列表
            async getStudentList (row) {
                this.loadingStudentList = true
                const { data } = await teacherStudentGetStudentList({classId: row.classId})
                this.loadingStudentList = false
                if (data.code === '200') {
                    this.studentList = data.data
                }
            },
            // 编辑学生
            editStudent (row) {
                console.log(row)
            },
            // 重置密码
            resetStudentPassword (row) {
                console.log(row)
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
        .el-card {
            height: 60vh;
        }
    }
    .teacher-student-main {
        width: 75%;
        .el-card {
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
                .teacher-student-content {
                    height: 60vh;
                    overflow: auto;
                }
            }
        }
    }
}
</style>
