<template>
    <div class="teacher-teacher">
        <el-card>
            <div slot="header" class="teacher-teacher-header">
                <el-button @click="addTeacher" type="primary">添加教师</el-button>
            </div>
            <div slot="default">
                <el-table
                        :data="pageList"
                        border
                        style="width: 100%">
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
                            label="隶属学院"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态： ' + (scope.row.status === 1?'启用':'禁用')" placement="top">
                                <el-switch
                                    v-model="scope.row.status"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                ></el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="380">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="assignClass(scope.row)" size="small">分配班级</el-button>
                            <el-button type="success" @click="seeClass(scope.row)" size="small">查看班级</el-button>
                            <el-button type="info" @click="editTeacher(scope.row)" size="small">编辑</el-button>
                            <el-button type="danger" @click="delTeacher(scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
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
    import {teacherTeacher} from "../../services/teacher";
    import CreateOrEditTeacher from "./component/CreateOrEditTeacher";
    import TeacherGetClass from "./component/TeacherGetClass";
    import AssignClassTree from "./component/AssignClassTree";

    export default {
        name: "TeacherTeacher",
        components: { CreateOrEditTeacher, TeacherGetClass, AssignClassTree },
        created() {
            this.loadingTeacher()
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
                pageList: []
            }
        },
        methods: {
            async loadingTeacher () {
                const { data } = await teacherTeacher()
                if (data.code === '200') {
                    this.teacherList = data.data
                    this.handleSizeChange(10)
                }
            },
            // 添加教师
            async addTeacher () {
                this.dialogCreateOrEditTeacher = true
                this.teacherInfo = new Object({})
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
            // 未完成
            editTeacher (row) {
                console.log(row)
            },
            // 未完成
            delTeacher (row) {
                console.log(row)
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
                this.loadingTeacher()
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
