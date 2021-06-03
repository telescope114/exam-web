<template>
    <div class="assign-permissions-tree">
        <div class="dialog-header">
            {{roleInfo.roleName}}
        </div>
        <div class="dialog-main">
            <el-tree
                v-loading="loadingCreateOrEditMenu"
                element-loading-background="rgba(255,255,255,0.8)"
                :data="assignData"
                :props="defaultProps"
                :default-checked-keys="ids"
                node-key="id"
                ref="assignData"
                @node-click="handleNodeClick"
                accordion
                show-checkbox
            ></el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit" v-loading="loadingSubmit">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {systemRoleAssignPermissions, systemRoleGetRolePermission} from "../../../services/admin";
    import {getMenuList} from "../../../utils/common";

    export default {
        name: "assignPermissionsTree",
        props: {
            roleInfo: {
                type: Object
            }
        },
        created() {
            this.loadAssign()
        },
        data () {
            return {
                assignData: [],
                defaultProps: {
                    children: 'children',
                    label: 'menuName'
                },
                // 给予权限的菜单ID
                ids: [],
                noIds: new Set(),
                loadingCreateOrEditMenu: true,
                loadingSubmit: false
            }
        },
        methods: {
            // 获取权限列表
            async loadAssign () {
                try {
                    this.loadingCreateOrEditMenu = true
                    const {data} = await systemRoleGetRolePermission({rid: this.roleInfo.id})
                    this.loadingCreateOrEditMenu = false
                    // 生成树的数据
                    if (data.code === '200') {
                        this.assignData = getMenuList(data.data)
                        // 赋予的权限
                        /* this.assignData.forEach(item => {
                            this.getChecked(item)
                        }) */
                        this.getMenuList(data.data)
                    } else {
                        this.$message.error('请求失败')
                    }
                } catch (e) {
                    this.loadingCreateOrEditMenu = false
                    this.cancel()
                }
            },
            getMenuList (list) {
                this.noIds = new Set()
                list.forEach(item => {
                    if (item.hasPermission) {
                        this.noIds.add(item.parentId)
                        this.ids.push(item.id)
                    }
                })
                this.ids.forEach((item,index) => {
                    if (this.noIds.has(item)) {
                        this.ids.splice(index,1)
                    }
                })
            },
            // 点击树
            handleNodeClick (data) {
                console.log(data);
            },
            async submit () {
                try {
                    this.loadingSubmit = true
                    const form = {
                        id: this.roleInfo.id,
                        ids: this.$refs.assignData.getCheckedKeys().concat(this.$refs.assignData.getHalfCheckedKeys())
                    }
                    const {data} = await systemRoleAssignPermissions(form)
                    this.loadingSubmit = false
                    if (data.code === '200') {
                        this.$message.success('设置成功！！')
                        this.$emit('success')
                    } else {
                        this.$message.error('无权操作！！')
                    }
                } catch (e) {
                    this.loadingSubmit = false
                }
            },
            cancel () {
                this.$emit('cancel')
            }
        }
    }
</script>

<style lang="scss" scoped>
.assign-permissions-tree {
    .dialog-header {
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: bold;
    }
}
</style>
