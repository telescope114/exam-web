<template>
    <div class="teacher-score">
        <el-card>
            <el-table
            ></el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "TeacherScore",
        data () {
            return {
                loadingScore: true,
                loadingDownload: false,
                dialogStudentList: false,
                pageSize: 5,
                pageSizes: [5,10,20,50],
                pageExamList: 1
            }
        },
        created() {
        },
        methods: {
            async loadExamList () {}
        }
    }
</script>

<style scoped>

</style>
