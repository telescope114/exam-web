<template>
    <div class="teacher-teacher-get-class">
        <el-table
            :data="classList">
            <el-table-column
                property="className" label="班级"
                width="300">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="success">确 定</el-button>
        </div>
    </div>
</template>
<script>
    import {teacherTeacherGetClassName} from "../../../services/teacher";

    export default {
        name: "teacherSeeClass",
        props: {
            teacherInfo: {
                type: Object
            }
        },
        created() {
            this.loadingClass()
        },
        data () {
            return {
                classList: [],
                table: false
            }
        },
        methods: {
            async loadingClass () {
                console.log(this.teacherInfo)
                const { data } = await teacherTeacherGetClassName({
                    tid: this.teacherInfo.tid
                })
                if (data.code === '200') {
                    this.table = true
                    this.classList = data.data
                    console.log(this.classList)
                }
            },
            success () {
                this.$emit('success')
            }
        }
    }
</script>

<style lang="scss" scoped>
.teacher-teacher-get-class {
    .el-table {
        height: 50vh;
        overflow: auto;
    }
}
</style>
