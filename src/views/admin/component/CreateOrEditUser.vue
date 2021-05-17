<template>
    <div class="create-or-edit-user">
        <el-form :model="userInfo" :rules="rules" ref="userInfo">
            <el-form-item label="账号" label-width="12rem" prop="username">
                <el-input v-model="userInfo.username" autocomplete="off" @keydown.native.enter="submit('userInfo')"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit('userInfo')">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {systemUserAddUser, systemUserEditUser} from "../../../services/admin";

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
                        { required: true, message: '用户名称不能为空！！！', trigger: 'blur' },
                        { min: 6, message: '账号长度至少6位', trigger: 'blur' }
                    ]
                },
                loadingSubmit: false,
                checkUser: {}
            }
        },
        created() {
            if (this.isEdit) {
                this.checkUser.username = this.userInfo.username
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
                        if (!this.isEdit) {
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
                } else if (data.code === '403') {
                    this.$message.error('该用户名已经被注册')
                } else {
                    this.$message.error('无权操作！！！')
                }
            },
            async editUser () {
                if (this.checkUser.username !== this.userInfo.username) {
                    const {data} = await systemUserEditUser(this.userInfo)
                    if (data.code === '200') {
                        this.$message.success('编辑成功')
                        this.$emit('success')
                    } else if (data.code === '303') {
                        this.$message.error('不能修改管理员！！！')
                    } else if (data.code === '403') {
                        this.$message.error('该用户名已经被注册')
                    } else {
                        this.$message.error('无权操作！！！')
                    }
                } else {
                    this.$message.error('没有任何修改')
                }
            }
        }
    }
</script>

<style scoped>

</style>
