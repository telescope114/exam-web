<template>
    <div class="admin-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.path !== '/'">{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown>
            <span class="el-dropdown-link">
                <el-avatar size="medium" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
            </span>
<!--            <el-dropdown-menu>-->
<!--                <el-dropdown-item divided @click.native="changePassword">修改密码</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dialog title="修改密码" :visible.sync="dialogChangePassword">
            <div>
                <el-form :model="passwordForm" ref="passwordForm" :rules="rules" v-if="dialogChangePassword">
                    <el-form-item label="旧的密码" label-width="120" prop="oldPassword">
                        <el-input v-model="passwordForm.oldPassword" @keydown.native.enter="submit" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item label="新的密码" label-width="120" prop="newPassword">
                        <el-input v-model="passwordForm.newPassword" @keydown.native.enter="submit" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" label-width="120" prop="checkPassword">
                        <el-input v-model="passwordForm.checkPassword" @keydown.native.enter="submit" show-password clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { layout } from "@/services/common";
    import {teacherChangePassword} from "../../../services/common";

    export default {
        name: "AdminHeader",
        data () {
            return {
                dialogChangePassword: false,
                passwordForm: {},
                rules: {
                    oldPassword: [
                        {required:true, message: '不能为空！！', trigger: 'blur'},
                        {min: 6, message: '长度至少6位数！！', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required:true, message: '不能为空！！', trigger: 'blur'},
                        {min: 6, message: '长度至少6位数！！', trigger: 'blur'}
                    ],
                    checkPassword: [
                        {required:true, message: '不能为空！！', trigger: 'blur'},
                        {min: 6, message: '长度至少6位数！！', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            async logout () {
                const { data } = await layout()
                if (data.code === '200') {
                    this.$store.commit('setUser','')
                    this.$store.commit('setMenu',new Set())
                    this.$store.commit('setRole', '')
                    this.$router.push('/login')
                } else {
                    this.$message.error("登出错误")
                }
            },
            changePassword () {
                this.dialogChangePassword = true
            },
            cancel () {
                this.dialogChangePassword = false
            },
            submit () {
                this.$refs.passwordForm.validate(valid => {
                    if (valid) {
                        if (this.passwordForm.oldPassword === this.passwordForm.newPassword) {
                            this.$message.error('新旧密码不能一样！！')
                            this.passwordForm.newPassword = ''
                            this.passwordForm.checkPassword = ''
                        } else if (this.passwordForm.checkPassword !== this.passwordForm.newPassword) {
                            this.$message.error('确认密码不一致！！')
                            this.passwordForm.checkPassword = ''
                        }  else if (this.passwordForm.checkPassword === this.passwordForm.newPassword) {
                            this.submitPassword()
                        }
                    } else {
                        this.$message.error('都不能为空！！！')
                        return false
                    }
                })
            },
            async submitPassword () {
                const { data } = await teacherChangePassword({
                    oldPassword: this.passwordForm.oldPassword,
                    newPassword: this.passwordForm.newPassword
                })
                if (data.code === '200') {
                    this.$alert('密码修改成功，请重新登录', '修改成功', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.$store.commit('setUser','')
                            this.$store.commit('setMenu',new Set())
                            this.$store.commit('setRole', '')
                            this.$router.push({name: 'Login'})
                        }
                    })
                } else if (data.code === '301') {
                    this.$message.error('旧密码没输对，请好好回忆')
                } else if (data.code === '302') {
                    this.$message.error('不能重置管理员密码！！！')
                } else if (data.code === '303') {
                    this.$message.error('不能修改管理员账号密码！！！')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .admin-header {
        height: 100%;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-dropdown-link {
            margin-right: 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }
    }
</style>
