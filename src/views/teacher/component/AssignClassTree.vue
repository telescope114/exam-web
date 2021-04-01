<template>
    <div class="assign-permissions-tree">
        <div class="dialog-header">
            {{teacherInfo.roleName}}
        </div>
        <div class="dialog-main">
            <el-tree
                v-loading="loadingAssign"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255,255,255)"
                :data="assignClassList"
                :props="defaultProps"
                :default-checked-keys="cids"
                node-key="classId"
                ref="assignClassList"
                accordion
                show-checkbox
            ></el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button
                type="primary"
                @click="submit"
                v-loading="loadingAssign||loadingSubmit"
            >确 定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherTeacherAssignClass, teacherTeacherGetAllClassByTeacherId} from "../../../services/teacher";
    import {collegeMajorClass} from "../../../utils/teacher";

    export default {
        name: "assignPermissionsTree",
        props: {
            teacherInfo: {
                type: Object
            }
        },
        created() {
            this.loadAssign()
        },
        data () {
            return {
                assignClassList: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                // 给予班级ID
                cids: [],
                loadingAssign: true,
                loadingSubmit: true
            }
        },
        methods: {
            // 获取班级列表
            async loadAssign () {
                this.loadingAssign = true
                const { data } = await teacherTeacherGetAllClassByTeacherId({ tid: this.teacherInfo.tid })
                this.loadingAssign = false
                // 生成树的数据
                if (data.code === '200') {
                    this.assignClassList = collegeMajorClass(data.data)
                    this.getMenuList(data.data)
                    console.log(this.cids)
                } else {
                    this.$message.error('请求失败')
                }
            },
            getMenuList (list) {
                list.forEach(item => {
                    if (item.hasClass) {
                        this.cids.push(item.classId)
                    }
                })
            },
            async submit () {
                this.loadingSubmit = true
                this.cids = this.$refs.assignClassList.getCheckedKeys()
                let check = []
                this.cids.forEach(item => {
                    if (typeof(item) === "number") {
                        check.push(item)
                    }
                })
                console.log(check)
                const { data } = await teacherTeacherAssignClass({
                    tid: this.teacherInfo.tid,
                    cids: check
                })
                this.loadingSubmit = false
                if (data.code === '200') {
                    this.$message.success('分配成功!!')
                    this.$emit('success')
                } else {
                    this.$message.error('分配失败!!!')
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
