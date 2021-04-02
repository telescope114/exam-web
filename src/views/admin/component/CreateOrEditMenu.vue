<template>
    <div class="create-or-edit-menu">
        <h3>当前目录：{{parent.menuName}}</h3>
        <el-form :model="menuInfo" :rules="rules" ref="menuInfo">
            <el-form-item label="菜单名称" prop="menuName" label-width="120px">
                <el-input @keydown.native.enter="submit" v-model="menuInfo.menuName" clearable></el-input>
            </el-form-item>
            <el-form-item label="菜单URL" prop="menuUrl" label-width="120px">
                <el-input @keydown.native.enter="submit" v-model="menuInfo.menuUrl" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="type" label-width="120px">
                <el-select v-model="menuInfo.type" placeholder="请选择" autocomplete="off">
                    <el-option label="菜单" :value="0"></el-option>
                    <el-option label="按钮" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import { systemMenuAdd } from "@/services/admin";
    import {systemMenuEdit} from "../../../services/admin";

    export default {
        name: "AdminCreateOrEditMenu",
        props: {
            isEdit: {
                type: Boolean,
                default: false
            },
            menuInfo: {
                type: Object,
                default: new Object({})
            },
            parent: {
                type: Object,
                default: new Object({})
            }
        },
        data () {
            return {
                rules: {
                    menuName: [
                        { required: true, message: '请输入菜单名', trigger: 'blur' }
                    ],
                    menuUrl: [
                        { required: true, message: '请输入菜单URL', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入菜单URL', trigger: 'blur' }
                    ]
                },
                loadingSubmit: false,
                checkMenu: {}
            }
        },
        created() {
            if (this.isEdit) {
                this.checkMenu.menuName = this.menuInfo.menuName
                this.checkMenu.menuUrl = this.menuInfo.menuUrl
                this.checkMenu.type = this.menuInfo.type
            }
        },
        methods: {
            submit () {
                this.$refs.menuInfo.validate((valid) => {
                    if (valid) {
                        // console.log(this.menuInfo)
                        if (!this.isEdit) {
                            this.createMenu()
                        } else {
                            this.editMenu()
                        }
                    } else {
                        this.$message.error("请填完后提交！！！")
                        return false
                    }
                })
            },
            // 创建菜单
            async createMenu () {
                this.loadingSubmit = true
                this.menuInfo.parentId = this.parent.id
                const { data } = await systemMenuAdd(this.menuInfo)
                console.log(data)
                if (data.code === '200') {
                    this.$message.success('添加成功！')
                    this.$emit('success')
                    this.loadingSubmit = false
                } else {
                    this.$message.error('添加失败！！')
                    this.loadingSubmit = false
                }
            },
            // 编辑菜单
            async editMenu () {
                if (this.menuInfo.menuName !== this.checkMenu.menuName || this.menuInfo.menuUrl !== this.checkMenu.menuUrl || this.menuInfo.type !== this.checkMenu.type) {
                    this.menuInfo.parentId = this.parent.id
                    const { data } = await systemMenuEdit(this.menuInfo)
                    console.log(data)
                    if (data.code === '200') {
                        this.$message.success('修改成功！')
                        this.$emit('success')
                    } else {
                        this.$message.warning('修改失败！！')
                    }
                } else {
                    this.$message.error('没有任何修改！！！')
                }
            },
            cancel () {
                this.$emit('cancel')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .create-or-edit-menu {
    }
</style>
