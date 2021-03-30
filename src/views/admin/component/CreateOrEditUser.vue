<template>
    <div class="create-or-edit-user">
        <el-form :model="userInfo" :rules="rules" ref="userInfo">
            <el-form-item label="账号" label-width="12rem" prop="username">
                <el-input v-model="userInfo.username" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit('userInfo')">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {systemUserAddUser} from "../../../services/admin";

    export default {
        name: "AdminCreateOrEditUser",
        props: {
            userInfo: {
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
                    username: [
                        { required: true, message: '用户名称不能为空！！！', trigger: 'blur' }
                    ]
                },
                loadingSubmit: false
            }
        },
        methods: {
            cancel() {
                this.$emit('cancel')
            },
            submit(userInfo) {
                this.loadingSubmit = true
                this.$refs[userInfo].validate((valid) => {
                    if (valid) {
                        // console.log(valid)
                        if (!this.isEidt) {
                            // console.log([])
                            this.addUser()
                        } else {
                            this.editUser()
                        }
                    } else {
                        this.$message.error('请填完表格！！！！！')
                        return false
                    }
                })
                this.loadingSubmit = false
            },
            async addUser () {
                const { data } = await systemUserAddUser(this.userInfo)
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                } else {
                    this.$message.error('添加失败！！！')
                }
            },
            async editUser () {
                // const { data } = await systemUserAddUser(this.userInfo)
                // if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.$emit('success')
                // } else {
                //     this.$message.error('添加失败！！！')
                // }
            }
        }
    }
</script>

<style scoped>

</style>
