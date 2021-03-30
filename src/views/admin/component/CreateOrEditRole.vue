<template>
    <div class="create-or-edit-role">
        <el-form :model="roleInfo" :rules="rules" ref="roleInfo">
            <el-form-item label="角色名称" label-width="12rem" prop="roleName">
                <el-input v-model="roleInfo.roleName" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" v-loading="loadingSubmit" @click="submit('roleInfo')">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {systemRoleAdd} from "../../../services/admin";

    export default {
        name: "CreateOrEditRole",
        props: {
            roleInfo: {
                type: Object,
                default: new Object({})
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                rules: {
                    roleName: [
                        { required: true, message: '角色名不能为空！！！', trigger: 'blur' }
                    ]
                },
                loadingSubmit: false
            }
        },
        methods: {
            cancel () {
                this.$emit('cancel')
            },
            submit (roleInfo) {
                this.loadingSubmit = true
                this.$refs[roleInfo].validate((valid) => {
                    if (valid) {
                        // console.log(valid)
                        if (!this.isEdit) {
                            this.createRole()
                        } else {
                            this.editRole()
                        }
                    } else {
                        this.$message.error('请填完表格！！！！！')
                        return false
                    }
                })
                this.loadingSubmit = false
            },
            async createRole () {
                const { data } = await systemRoleAdd(this.roleInfo)
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                } else {
                    this.$message.error('添加失败！！！！！')
                }
            },
            async editRole () {
                // const { data } = await systemRoleAdd(this.roleInfo)
                // if (data.code === '200') {
                    this.$message.success('修改成功')
                    this.$emit('success')
                // } else {
                //     this.$message.error('修改失败！！！！！')
                // }
            }
        }
    }
</script>

<style scoped>

</style>
