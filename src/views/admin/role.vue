<template>
    <div class="admin-role">
        <el-card>
            <div slot="header" class="el-card-header">
                <span>角色详情</span>
                <el-button @click="addRole" type="primary">添加角色</el-button>
            </div>
            <div>
                <el-table
                    v-loading="loadingRole"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    :data="roleListPagination"
                    border>
                    <el-table-column
                        fixed
                        prop="roleName"
                        label="角色名称"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        label="说明">
                        <template slot-scope="scope">
                            <p v-if="scope.row.description">{{scope.row.description}}</p>
                            <p v-else style="color: #939397;">无</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="创建时间">
                        <template slot-scope="scope">
                            <p>{{scope.row.createTime | dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="'当前状态： ' + (scope.row.status === 1?'启用':'禁用')" placement="top">
                                <el-switch
                                    v-model="scope.row.status"
                                    inactive-color="#ff4949"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @click.native="ableOrDisable(scope.row)"
                                ></el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="300">
                        <template slot-scope="scope">
                            <el-button @click="assignPermissions(scope.row)" type="primary" size="small">分配权限</el-button>
                            <el-button @click="editRole(scope.row)" type="info" size="small">编辑</el-button>
<!--                            <el-button type="danger" size="small">删除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
<!--            <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="rolePage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="roleList.length">
            </el-pagination>
        </el-card>
        <el-dialog :title="isEdit?'编辑角色':'添加角色'" :visible.sync="dialogFormVisible">
            <create-or-edit-role
                v-if="dialogFormVisible"
                :roleInfo="roleInfo"
                :isEdit="isEdit"
                @success = 'success'
                @cancel = 'cancel'
            ></create-or-edit-role>
        </el-dialog>
        <el-dialog
            title="分配权限"
            :visible.sync="dialogAssignPermission"
        >
            <assign-permissions-tree
                :roleInfo="roleInfo"
                :isEdit="isEdit"
                @success="success"
                @cancel="cancel"
                v-if="dialogAssignPermission"
            ></assign-permissions-tree>
        </el-dialog>
    </div>
</template>

<script>
    import {systemRole} from "@/services/admin";
    import CreateOrEditRole from "./component/CreateOrEditRole";
    import dateFormat from '@/utils/dateFormat'
    import AssignPermissionsTree from "./component/AssignPermissionsTree";
    import {systemRoleDisable, systemRoleEnable} from "../../services/admin";

    export default {
        name: "AdminRole",
        components: { CreateOrEditRole, AssignPermissionsTree},
        created() {
            this.loadRole()
        },
        data () {
            return {
                roleList: [],
                roleListPagination: [],
                // 添加角色弹窗
                dialogFormVisible: false,
                // 是否编辑
                isEdit: false,
                // 添加/编辑角色信息
                roleInfo: {},
                // 权限管理弹窗
                dialogAssignPermission: false,
                loadingRole: true,
                pageSize: 5,
                pageSizes: [5,10,20,50],
                rolePage: 1
            }
        },
        methods: {
            async loadRole () {
                this.loadingRole = true
                const { data } = await systemRole()
                // console.log(data)
                if (data.code === '200') {
                    this.roleList = data.data
                    this.handleSizeChange(this.pageSize)
                    this.loadingRole = false
                }
            },
            // 添加绝色
            addRole () {
                this.roleInfo = {}
                this.isEdit=false
                this.dialogFormVisible=true
            },
            // 编辑角色
            editRole (row) {
                this.isEdit = true
                this.roleInfo = {
                    id: row.id,
                    roleName: row.roleName,
                    description: row.description,
                }
                this.dialogFormVisible=true
            },
            // 添加、编辑成功
            success () {
                this.loadingRole = true
                this.roleInfo = {}
                this.dialogFormVisible = false
                this.dialogAssignPermission = false
                this.loadRole()
            },
            // 取消添加、编辑
            cancel () {
                this.roleInfo = {}
                this.roleInfo = {}
                this.dialogFormVisible = false
                this.dialogAssignPermission = false
            },
            ableOrDisable (row) {
                if (row.status === 0) {
                    this.$confirm('是否禁用？？？','警告！',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableRole(row)
                    }).catch(() => {
                        row.status = 1
                    })
                } else {
                    this.ableRole(row)
                }
            },
            async disableRole (row) {
                const {data} = await systemRoleDisable({roleId:row.id})
                // console.log(data)
                if (data.code === '200') {
                    row.status = 0
                    this.$message.warning('禁用成功！')
                } else if (data.code === '201') {
                    row.status = 0
                    this.$message.warning('禁用成功！')
                }  else if (data.code === '304') {
                    row.status = 1
                    this.$message.error('不能禁用自己使用的角色！')
                } else {
                    row.status = 1
                    this.$message.error('无权操作！')
                }
            },
            async ableRole (row) {
                const {data} = await systemRoleEnable({roleId:row.id})
                // console.log(data)
                if (data.code === '200') {
                    row.status = 1
                    this.$message.success('启用成功！')
                } else if (data.code === '201') {
                    row.status = 1
                    this.$message.success('启用成功！')
                } else {
                    row.status = 0
                    this.$message.error('无权操作！')
                }
            },
            /*seeRole (row) {
                this.$alert(`${row.description?row.description:'暂无描述'}`, '角色描述', {
                    confirmButtonText: '确定'
                });
            },*/
            // 分配权限
            assignPermissions (row) {
                this.dialogAssignPermission = true
                this.roleInfo = row
                // console.log(row)
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                // this.roleListPagination = this.roleList.slice(0,val)
                this.rolePage = 1
                this.pageSize = val
                this.handleCurrentChange(1)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.roleListPagination = this.roleList.slice((val-1)*this.pageSize,val*this.pageSize)
                this.rolePage = val
            }
        },
        filters: {
            dateFormat
        }
    }
</script>

<style lang="scss" scoped>
.admin-role {
    .el-card {
        /*height: 80vh;*/
        /*overflow: auto;*/
        .el-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 20px;
                font-weight: bold;
            }
        }
    }
}
</style>
