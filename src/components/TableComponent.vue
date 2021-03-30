<template>
    <div class="table-component">
        <el-table
                :data="main"
                border
                style="width: 100%">
            <el-table-column
                v-for="(title,index) in titles"
                :prop="title.data"
                :key="index"
                :label="title.name"
                width="150">
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "ElTable",
        props: {
            titles: {
                type: Object
            },
            main: {
                type: Object
            }
        },
        methods: {
            handleClick(row) {
                console.log(row);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
