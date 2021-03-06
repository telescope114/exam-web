<template>
    <div class="admin-menu">
        <el-card class="box-card-aside">
            <el-tree
                v-loading="loadingMenu"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                :data="menusList"
                :props="menusProps"
                accordion
                @node-click="handleNodeClick"
            ></el-tree>
        </el-card>
        <el-card class="box-card-main">
            <div slot="header" class="box-card-main-header">
                <span>菜单详情</span>
                <el-button type="primary" @click="addMenu" :disabled="parent===''">添加菜单</el-button>
            </div>
            <div class="box-card-main-main">
                <el-table
                    v-if="menuInfo"
                    :data="menuInfo"
                >
                <el-table-column
                        prop="menuName"
                        label="菜单名称">
                </el-table-column>
                <el-table-column
                    label="菜单URL">
                    <template slot-scope="scope">
                        <p>{{scope.row.menuUrl?scope.row.menuUrl:'******'}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="当前状态">
                    <template slot-scope="scope">
                        <el-tooltip :content="'当前状态： ' + (scope.row.status === 1?'启用':'禁用')" placement="top" :enterable="false">
                            <el-switch
                                @click.native="ableOrDisable(scope.row)"
                                v-model="scope.row.status"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                            ></el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                        label="菜单类型"
                        width="100">
                    <template slot-scope="scope">
                        {{scope.row.type === 0?'菜单':'按钮'}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button type="info" @click="editMenu(scope.row)" size="small">编辑</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-dialog :title="isEdit?'编辑菜单':'新建菜单'" :visible.sync="dialogFormVisible">
            <create-or-edit-menu
                v-if="dialogFormVisible"
                :isEdit="isEdit"
                :menuInfo="createOrEditMenuInfo"
                :parent="parent"
                @success="success"
                @cancel="cancel"
            ></create-or-edit-menu>
        </el-dialog>
    </div>
</template>

<script>
    import {systemMenu} from "@/services/admin";
    import {getMenuTree} from "@/utils/common";
    import CreateOrEditMenu from "./component/CreateOrEditMenu";
    import {systemMenuDisable, systemMenuEnable} from "../../services/admin";

    export default {
        name: "AdminMenu",
        components: { CreateOrEditMenu },
        created () {
            this.loadMenulist()
        },
        data () {
            return {
                selectForm: {
                    id: '',
                    name: '',
                    age: ''
                },
                menusList: [],
                menusProps: {
                    children: 'children',
                    label: 'menuName'
                },
                menuInfo: [],
                createOrEditMenuInfo: {},
                // 添加弹窗
                dialogFormVisible: false,
                // 是否是编辑
                isEdit: false,
                // 创建、编辑菜单
                parent: {},
                loadingMenu: true
            }
        },
        methods: {
            // 加载侧边栏的菜单树
            async loadMenulist () {
                try {
                    const {data} = await systemMenu()
                    if (data.code === '200') {
                        console.log(data.data)
                        this.menusList = getMenuTree(data.data)
                        this.menuInfo = []
                    }
                    this.loadingMenu = false
                } catch (e) {
                    this.loadingMenu = false
                }
            },
            // 侧边栏选中菜单树
            handleNodeClick(data) {
                this.parent = { id:data.id, menuName: data.menuName }
                this.menuInfo = data.children
            },
            // 添加菜单弹窗
            addMenu () {
                this.isEdit=false
                this.createOrEditMenuInfo = {}
                this.dialogFormVisible=true
            },
            // 添加成功后关闭对话框
            success () {
                this.loadingMenu = true
                this.dialogFormVisible = false
                this.loadMenulist()
                this.createOrEditMenuInfo = {}
            },
            // 取消后关闭对话框
            cancel () {
                this.createOrEditMenuInfo = {}
                this.dialogFormVisible = false
            },
            // 编辑
            editMenu (row) {
                this.isEdit = true
                this.createOrEditMenuInfo = {
                    id: row.id,
                    menuName: row.menuName,
                    menuUrl: row.menuUrl,
                    type: row.type
                }
                this.dialogFormVisible = true
            },
            // 启用禁用
            ableOrDisable (row) {
                if (row.status === 0) {
                    this.$confirm(`警告：你正在禁用 ${row.menuName} 功能`,'警告',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableMenu(row)
                    }).catch(() => {
                        this.$message.info('已经取消')
                        row.status = 1
                    })
                } else {
                    this.ableMenu(row)
                }
            },
            getChildrenId (row) {
                let ids = [row.id]
                if (row.children) {
                    for (const item of row.children) {
                        // console.log([item.id])
                        ids = ids.concat(this.getChildrenId(item))
                    }
                    return ids
                } else {
                    return ids
                }
            },
            refreshMenuStatus (row,status) {
                row.status = status
                if (row.children) {
                    row.children.forEach(item => {
                        this.refreshMenuStatus(item,status)
                    })
                }
            },
            async disableMenu (row) {
                try {
                    const ids = this.getChildrenId(row)
                    const {data} = await systemMenuDisable({menuIds: ids.join(',')})
                    if (data.code === '200') {
                        this.$message.warning('已经禁用！')
                        row.status = 0
                        this.refreshMenuStatus(row, 0)
                    } else if (data.code === '201') {
                        this.$message.warning('已经禁用！')
                        row.status = 0
                        this.refreshMenuStatus(row, 0)
                    } else {
                        this.$message.error('无权操作！')
                        row.status = 1
                    }
                } catch (e) {
                    row.status = 1
                }
                // console.log(row)
            },
            async ableMenu (row) {
                /*console.log(row)
                this.$message.success('启用成功！')*/
                try {
                    const ids = this.getChildrenId(row)
                    const {data} = await systemMenuEnable({menuIds: ids.join(',')})
                    if (data.code === '200') {
                        this.$message.success('已经启用！')
                        this.status = 1
                        this.refreshMenuStatus(row, 1)
                    } else if (data.code === '201') {
                        this.$message.success('已经启用！')
                        this.status = 1
                        this.refreshMenuStatus(row, 1)
                    } else {
                        this.$message.error('无权操作！')
                        row.status = 0
                    }
                } catch (e) {
                    row.status = 0
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.admin-menu {
    display: flex;
    justify-content: left;
    .box-card-aside {
        width: 15rem;
        height: 80vh;
        margin-right: 20px;
        padding: 0;
        .el-tree {
            margin-left: -10px;
        }
    }
    .box-card-main {
        width: 70%;
        height: 80vh;
        overflow: auto;
        .box-card-main-header {
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

<!--
 {
     courseID: 1,
     courseName: '语文',
     score: 77
 }

 -->
