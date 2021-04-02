<template>
    <div class="admin-user">
        <el-card>
            <div slot="header" class="admin-user-header">
                <span>用户管理</span>
                <el-button type="primary" @click="createUser">添加用户</el-button>
            </div>
            <div class="admin-user-main">
                <el-table
                    v-loading="loadingUser"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255,255,255,0.8)"
                    :data="userListPagination"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="username"
                        label="账号">
                    </el-table-column>
                    <el-table-column
                        label="创建时间">
                        <template slot-scope="scope">
                            <p>{{ scope.row.createTime | dateFormat }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        width="180">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态： ' + (scope.row.status === 1?'启用':'禁用')" placement="top">
                                <el-switch
                                    v-model="scope.row.status"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @click.native="enableOrDisable(scope.row)"
                                ></el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="300">
                        <template slot-scope="scope">
                            <el-button @click="editUser(scope.row)" type="primary" size="small">编辑</el-button>
                            <el-button @click="setUser(scope.row)" type="info" size="small">授予角色</el-button>
                            <el-button @click="reset(scope.row)" type="danger" size="small">重置密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
<!--                <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>-->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="userPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="userList.length">
                </el-pagination>
            </div>
            <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogCreateOrEditUser">
                <create-or-edit-user
                        v-if="dialogCreateOrEditUser"
                        :userInfo="userInfo"
                        :isEdit="isEdit"
                        @success = 'success'
                        @cancel = 'cancel'
                ></create-or-edit-user>
            </el-dialog>
        </el-card>
        <el-dialog title="授予角色" :visible.sync="dialogSetRole">
            <set-role
                v-loading="loadingUser"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                v-if="dialogSetRole"
                :userInfo="userInfo"
                @success="success"
                @cancel="cancel"
            ></set-role>
        </el-dialog>
    </div>
</template>

<script>
    import {systemUser, systemUserDisable, systemUserEnable} from '../../services/admin';
    import dateFormat from '@/utils/dateFormat'
    import CreateOrEditUser from "./component/CreateOrEditUser";
    import SetRole from "./component/SetRole";
    import {resetPassword} from "../../services/common";

    export default {
        name: "AdminUser",
        components: { CreateOrEditUser, SetRole },
        created() {
            this.loadUser()
        },
        data () {
            return {
                userList: [],
                userListPagination: [],
                // 添加、编辑用户
                userInfo: {},
                // 是否编辑用户
                isEdit: false,
                // 添加、编辑用户弹窗状态
                dialogCreateOrEditUser: false,
                dialogSetRole: false,
                loadingUser: true,
                userPage: 1,
                pageSize: 5,
                pageSizes: [5,10,20,50]
            }
        },
        methods: {
            async loadUser () {
                const { data } = await systemUser()
                this.loadingUser = false
                if (data.code === '200') {
                    this.userList = data.data
                    this.userListPagination = this.userList.slice(0,this.pageSize)
                    this.userPage = 1
                }
            },
            // 添加用户
            createUser () {
                this.isEdit = false
                this.dialogCreateOrEditUser = true
                this.userInfo = {}
            },
            // 编辑用户
            editUser (row) {
                this.isEdit = true
                this.dialogCreateOrEditUser = true
                this.userInfo = row
            },
            // 授予用户角色
            setUser (row) {
                this.dialogSetRole = true
                this.userInfo = row
            },
            // 重置用户密码
            reset (row) {
                this.$confirm(`警告：你正在重置 ${row.username} 的密码`,'重置密码',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.resetPassword(row)
                }).catch(() => {
                    this.$message.info('取消重置')
                })
            },
            async resetPassword (row) {
              const { data } = await resetPassword({userId: row.id})
              if (data.code === '200') {
                  this.$message.success('重置成功')
              } else if (data.code === '302') {
                  this.$message.error('不能重置管理员密码')
              } else {
                  this.$message.error('无权操作')
              }
            },
            // 添加、编辑成功
            success () {
                this.loadingUser = true
                this.dialogCreateOrEditUser = false
                this.dialogSetRole = false
                this.userInfo = {}
                this.loadUser()
            },
            // 启用禁用
            enableOrDisable (row) {
                if (row.status === 0) {
                    this.$confirm(`警告：你正在重置 ${row.username} 的密码`,'重置密码',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableUser(row)
                    }).catch(() => {
                        row.status = 1
                    })
                } else {
                    this.ableUser(row)
                }
            },
            async ableUser (row) {
                const { data } = await systemUserEnable({userId: row.id})
                if (data.code === '200') {
                    this.$message.success('启用成功')
                    row.status = 1
                } else {
                    this.$message.error('无权操作')
                    row.status = 0
                }
            },
            async disableUser (row) {
                const { data } = await systemUserDisable({userId: row.id})
                if (data.code === '200') {
                    this.$message.warning('禁用成功')
                    row.status = 0
                } else if (data.code ==='304') {
                    this.$message.error('不能禁用管理员！！！')
                    row.status = 1
                } else {
                    this.$message.error('无权操作')
                    row.status = 1
                }
            },
            // 取消添加、编辑
            cancel () {
                this.dialogCreateOrEditUser = false
                this.dialogSetRole = false
                this.userInfo = {}
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.userListPagination = this.userList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.userListPagination = this.userList.slice((val-1)*this.pageSize,val*this.pageSize)
            }
        },
        filters: {
            dateFormat
        }
    }
</script>

<style lang="scss" scoped>
.admin-user {
    .el-card {
        /*height: 80vh;*/
        /*overflow: auto;*/
        .admin-user-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-weight: bold;
                font-size: 20px;
            }
        }
        .admin-user-main {}
    }
}
</style>
