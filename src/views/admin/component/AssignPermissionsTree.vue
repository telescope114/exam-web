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
                loadingCreateOrEditMenu: true,
                loadingSubmit: false
            }
        },
        methods: {
            // 获取权限列表
            async loadAssign () {
                // console.log(this.roleInfo.id)
                this.loadingCreateOrEditMenu = true
                const { data } = await systemRoleGetRolePermission({ rid: this.roleInfo.id })
                // 生成树的数据
                if (data.code === '200') {
                    this.assignData = getMenuList(data.data)
                    this.loadingCreateOrEditMenu = false
                    // 赋予的权限
                    /* this.assignData.forEach(item => {
                        this.getChecked(item)
                    }) */
                    this.getMenuList(data.data)
                } else {
                    this.$message.error('请求失败')
                    this.loadingCreateOrEditMenu = false
                }
            },
            getMenuList (list) {
                list.forEach(item => {
                    if (item.hasPermission) {
                        this.ids.push(item.id)
                    }
                })
            },
            /* getChecked (list) {
                if (list.children) {
                    let checked = true
                    list.children.forEach(item => {
                        checked = this.getChecked(item) && checked
                    })
                    if (checked) {
                        this.ids.push(list.id)
                    }
                    return checked
                } else {
                    if (list.hasPermission) {
                        // console.log(list.id)
                        this.ids.push(list.id)
                    }
                    return list.hasPermission
                }
            }, */
            // 点击树
            handleNodeClick (data) {
                // console.log(this.$refs.assignData.getCheckedKeys())
                console.log(data);
            },
            async submit () {
                this.loadingSubmit = true
                const form = {
                    id: this.roleInfo.id,
                    ids: this.$refs.assignData.getCheckedKeys().concat(this.$refs.assignData.getHalfCheckedKeys())
                }
                const { data } = await systemRoleAssignPermissions(form)
                if (data.code === '200') {
                    this.$message.success('设置成功！！')
                    this.$emit('success')
                    this.loadingSubmit = false
                } else {
                    this.$message.error('请求失败！！')
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
