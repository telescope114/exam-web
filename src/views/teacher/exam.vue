<template>
    <div class="teacher-exam">
        <el-card>
            <div class="search" slot="header">
                <el-button type="primary" @click="addExam">添加试题</el-button>
                <div class="search-main">
                    <!--<label>试题类型：</label>
                    <el-select v-model="selectForm.examQuestionType" style="width: 100px">
                        <el-option v-for="item of examQuestionTypeTitle" :key="item.value" :label="item.title" :value="item.value" @click.native="checkExamQuestionType"></el-option>
                    </el-select>-->
                    <label>考试名称：</label>
                    <el-input v-model="selectForm.examName" style="width: 150px" clearable></el-input>
                    <label>考试日期：</label>
                        <el-date-picker
                            v-model="selectForm.date"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    <el-button type="primary" @click="select" circle icon="el-icon-search"></el-button>
                </div>
            </div>
            <div>
                <el-table :data="pageList" border style="width: 100%" v-loading="loadingExam" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.8)">
                    <el-table-column fixed width="200" prop="examName" label="考试名称"></el-table-column>
                    <el-table-column width="200" label="开始时间">
                        <template slot-scope="scope">
                            <p>{{scope.row.openTime|dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" label="结束时间">
                        <template slot-scope="scope">
                            <p>{{scope.row.closeTime|dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="考试时长">
                        <template slot-scope="scope">
                            <p>{{scope.row.duration + '分钟'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" prop="totalScore" label="总分"></el-table-column>
                    <el-table-column width="100" label="当前状态">
                        <template slot-scope="scope">
                            <p :class="'exam-status-'+checkExamTime(scope.row)">{{checkExamTime(scope.row)>0?(checkExamTime(scope.row)>1?'考试结束':'考试中'):'未开考'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="seeExam(scope.row)">详情</el-button>
                            <el-button size="mini" type="info" @click="editExam(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageExam"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="examList.length"></el-pagination>
        </el-card>
        <el-dialog :title="isEdit?'编辑':'添加'+'考试'" :visible.sync="dialogCreateOrEditExam">
            <create-or-edit-exam
                v-if="dialogCreateOrEditExam"
                :examInfo="examInfo"
                :isEdit="isEdit"
                @cancel="cancel"
                @success="success"
            ></create-or-edit-exam>
        </el-dialog>
    </div>
</template>

<script>
    import {teacherExam} from "../../services/teacher";
    import dateFormat from "../../utils/dateFormat";
    import CreateOrEditExam from "./component/CreateOrEditExam";

    export default {
        name: "TeacherExam",
        components: {CreateOrEditExam},
        created() {
            this.loadExam()
        },
        data () {
            return {
                selectForm: {
                    examName: '',
                    date: ''
                },
                examList: [],
                examInfo: {},
                dialogCreateOrEditExam: false,
                dialogSeeExamDetail: false,
                isEdit: false,
                loadingExam: true,
                pageList: [],
                pageExam: 1,
                pageSize: 5,
                pageSizes: [5,10,20,50,100]
            }
        },
        methods: {
            async loadExam () {
                this.loadingExam = true
                const { data } = await teacherExam()
                if (data.code === '200') {
                    this.examList = data.data
                    console.log(this.examList)
                    this.handleSizeChange(5)
                }
                this.loadingExam = false
            },
            // 判断考试当前状态 0:未开考 1:开考 2:考完
            checkExamTime (row) {
                const time = new Date()
                const openTime = new Date(row.openTime)
                const closeTime = new Date(row.closeTime)
                if (time > closeTime) {
                    return 2
                } else if (time < openTime)
                    return 0
                else {
                    return 1
                }
            },
            select () {
                console.log(this.selectForm)
            },
            addExam () {
                this.examInfo = {}
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditExam = true
            },
            // 查看考试详情
            seeExam (row) {
                this.examInfo = row
                this.dialogSeeExamDetail = true
                this.dialogCreateOrEditExam = false
            },
            editExam (row) {
                console.log('row:')
                console.log(row)
                this.isEdit = true
                this.examInfo = row
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditExam = true
            },
            cancel () {
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditExam = false
            },
            success () {
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditExam = false
                this.loadExam()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.pageExam = 1
                this.pageList = this.examList.slice(0,val)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageList = this.examList.slice((val-1)*this.pageSize,val*this.pageSize)
            }
        },
        filters: {dateFormat}
    }
</script>

<style lang="scss" scoped>
.teacher-exam {
    .search {
        display: flex;
        justify-content: left;
        align-items: center;
        .search-main {
            label {
                margin: 0 5px;
            }
            .el-button {
                margin-left: 20px;
            }
        }
    }
}
.exam-status-0 {
    color: $danger-color;
}
.exam-status-1 {
    color: $warning-color;
}
.exam-status-2 {
    color: $primary-color;
}
</style>
