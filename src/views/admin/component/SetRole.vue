<template>
    <div class="set-role">
        <el-form :model="form">
            <el-form-item label="当前角色" label-width="120px">
                <el-select v-model="form.rid" placeholder="请选择">
                    <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" >取 消</el-button>
            <el-button v-loading="loadingRole" type="primary" @click="submit">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {systemUserAssignRoles, systemUserGetRole} from "../../../services/admin";

    export default {
        name: "SetRole",
        props: {
            userInfo: {
                tyep: Object
            }
        },
        created () {
            this.loadRole()
        },
        data () {
            return {
                form: {
                    uid: '',
                    rid: ''
                },
                roleList: [],
                loadingRole: false
            }
        },
        methods: {
            async loadRole () {
                this.loadingRole = true
                this.form.uid = this.userInfo.id
                const { data } = await systemUserGetRole({id: this.userInfo.id})
                if (data.code === '200') {
                    this.roleList = data.data
                    for (const role of data.data) {
                        // console.log(role)
                        if (role.hasRole) {
                            this.form.rid = role.id
                            break
                        }
                    }
                }
                this.loadingRole = false
            },
            async submit () {
                const { data } = await systemUserAssignRoles(this.form)
                if (data.code === '200') {
                    this.$message.success('请求成功')
                    this.$emit('success')
                } else {
                    this.$message.error('请求失败!!!')
                }
            },
            cancel () {
                this.$emit('cancel')
            }
        }
    }
</script>

<style scoped>

</style>
