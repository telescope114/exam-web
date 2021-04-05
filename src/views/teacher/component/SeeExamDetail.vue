<template>
    <div class="see-exam-detail">
        <el-table :data="classList" border v-loading="loadingClassList" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255)">
            <el-table-column prop="collegeName" label="学院"></el-table-column>
            <el-table-column prop="className" label="班级"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="cancel">确定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherExamGetClass} from "../../../services/teacher";

    export default {
        name: "SeeExamDetail",
        props: {
            examInfo: {
                type: Object
            }
        },
        data () {
            return {
                classList: [],
                loadingClassList: true
            }
        },
        created() {
            this.loadClassList()
        },
        methods: {
            async loadClassList () {
                this.loadingClassList = true
                const { data } = await teacherExamGetClass({id:this.examInfo.id})
                this.loadingClassList = false
                if (data.code === '200') {
                    this.classList = data.data
                }
            },
            cancel () {
                this.$emit('cancel')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dialog-footer {
        margin-top: 5px;
    }
</style>
