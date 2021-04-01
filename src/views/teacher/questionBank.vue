<template>
    <div class="teacher-question-bank">
        <el-card>
            <div class="select-header">
                <el-button @click="addQuestionBank" type="primary">添加题库</el-button>
                <div class="select">
                    <label>题库搜索</label>
                    <el-input placeholder="请输入学院" style="width: 150px" v-model="selectForm.questionBankName" clearable></el-input>
                    <el-button type="primary" icon="el-icon-search" circle></el-button>
                </div>
            </div>
        </el-card>
        <el-card>
            <el-table
                v-loading="loadingQuestionBank"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="'el-icon-loading"
                :data="pageList"
                border
                style="width: 100%;"
            >
                <el-table-column
                    fixed
                    prop="questionBankName"
                    label="题库名称"
                    width="120"
                ></el-table-column>
                <el-table-column
                    prop="choiceQuestion"
                    label="选择题数量"
                ></el-table-column>
                <el-table-column
                    prop="judgmentQuestion"
                    label="判断题数量"
                ></el-table-column>
                <el-table-column
                    prop="fillQuestion"
                    label="填空题数量"
                ></el-table-column>
                <el-table-column
                    label="填空题数量"
                >
                    <template slot-scope="scope">
                        <el-tooltip content="查看" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="seeQuestionBank(scope.row)" circle></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top">
                            <el-button type="info" size="mini" icon="el-icon-edit" @click="editQuestionBank(scope.row)" circle></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delQuestionBank(scope.row)" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageQuestionBank"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="questionBankList.length"></el-pagination>
        </el-card>
        <el-dialog :title="isEdit?'编辑题库':'添加题库'" :visible.sync="dialogCreateOrEditQuestionBank">
            <create-or-edit-question-bank
                v-if="dialogCreateOrEditQuestionBank"
                :isEdit="isEdit"
                :questionBankInfo="questionBankInfo"
                @cancel="cancel"
                @success="success"
            ></create-or-edit-question-bank>
        </el-dialog>
    </div>
</template>

<script>
    import {teacherQuestionBank} from "../../services/teacher";
    import CreateOrEditQuestionBank from "./component/CreateOrEditQuestionBank";

    export default {
        name: "TeacherQuestionBank",
        components: { CreateOrEditQuestionBank },
        created() {
            this.loadQuestionBank()
        },
        data () {
            return {
                selectForm: {
                    questionBankName: ''
                },
                questionBankList: [],
                dialogCreateOrEditQuestionBank: false,
                questionBankInfo: {},
                isEdit: false,
                pageSize: 5,
                pageSizes: [5,10,20,50],
                pageList: [],
                pageQuestionBank: 1,
                loadingQuestionBank: true
            }
        },
        methods: {
            async loadQuestionBank () {
                this.loadingQuestionBank = true
                const { data } = await teacherQuestionBank()
                this.loadingQuestionBank = false
                if (data.code === '200') {
                    this.questionBankList = data.data
                    this.handleSizeChange(5)
                }
            },
            // 添加题库
            addQuestionBank () {
                this.questionBankInfo = {}
                this.isEdit = false
                this.dialogCreateOrEditQuestionBank = true
            },
            // 添加题目
            seeQuestionBank (row) {
                console.log(row)
            },
            // 编辑题库
            editQuestionBank (row) {
                console.log(row)
            },
            // 删除题库
            delQuestionBank (row) {
                console.log(row)
            },
            cancel () {
                this.dialogCreateOrEditQuestionBank = false
                this.questionBankInfo = {}
            },
            success () {
                this.dialogCreateOrEditQuestionBank = false
                this.questionBankInfo = {}
                this.loadQuestionBank()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`)
                this.pageSize = val
                this.pageQuestionBank = 1
                this.pageList = this.questionBankList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`)
                this.pageList = this.questionBankList.slice((val-1)*this.pageSize,val*this.pageSize)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .teacher-question-bank {
        .el-card {
            margin: 5px;
            .el-card__body {
                .select-header {
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    .select {
                        label {
                            margin-left: 10px;
                            margin-right: 10px;
                        }
                        .el-button {
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
    }
</style>
