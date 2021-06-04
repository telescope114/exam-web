<template>
    <div class="teacher-exam">
        <el-card>
            <div class="search" slot="header">
                <el-button type="primary" @click="choiceExamType" v-if="$store.state.role">添加考试</el-button>
<!--                <el-button type="primary" @click="addExam">添加考试</el-button>-->
                <div class="search-main">
                    <!--<label>试题类型：</label>
                    <el-select v-model="selectForm.examQuestionType" style="width: 100px">
                        <el-option v-for="item of examQuestionTypeTitle" :key="item.value" :label="item.title" :value="item.value" @click.native="checkExamQuestionType"></el-option>
                    </el-select>-->
                    <label>考试名称：</label>
                    <el-input v-model="selectForm.examName" style="width: 150px" clearable @keydown.native.enter="select"></el-input>
                    <label>开始考试日期：</label>
                        <el-date-picker
                            v-model="selectForm.openTime"
                            type="date"  style="width: 150px"
                            placeholder="选择日期" @keydown.native.enter="select">
                        </el-date-picker>
                    <label>最迟考试日期：</label>
                        <el-date-picker
                            v-model="selectForm.closeTime"
                            type="date"  style="width: 150px"
                            placeholder="选择日期" @keydown.native.enter="select">
                        </el-date-picker>
                    <el-button type="primary" @click="select" circle icon="el-icon-search"></el-button>
                </div>
            </div>
            <div>
                <el-table :data="pageList" border style="width: 100%" v-loading="loadingExam" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.8)">
                    <el-table-column fixed width="200" prop="examName" label="考试名称"></el-table-column>
                    <el-table-column v-if="isDirector" width="100" prop="realName" label="发布人"></el-table-column>
                    <el-table-column label="开始时间">
                        <template slot-scope="scope">
                            <p>{{scope.row.openTime|dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间">
                        <template slot-scope="scope">
                            <p>{{scope.row.closeTime|dateFormat}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="考试时长">
                        <template slot-scope="scope">
                            <p>{{scope.row.duration + '分钟'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalScore" label="总分"></el-table-column>
                    <el-table-column label="试卷类型">
                        <template slot-scope="scope">
                            <p>{{scope.row.examPaperId?'自定义试卷': '随机试卷'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="当前状态">
                        <template slot-scope="scope">
                            <p :class="'exam-status-'+checkExamTime(scope.row)">{{checkExamTime(scope.row)>0?(checkExamTime(scope.row)>1?'考试结束':'考试中'):'未开考'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="seeExam(scope.row)">详情</el-button>
<!--                            <el-button size="mini" type="info" @click="editExam(scope.row)" >编辑</el-button>-->
                            <el-button size="mini" type="info" @click="editExam(scope.row)" :disabled="checkExamTime(scope.row)!==0">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
        <el-dialog title="参考班级" :visible.sync="dialogSeeExamDetail">
            <see-exam-detail
                v-if="dialogSeeExamDetail"
                :examInfo="examInfo"
                @cancel="cancel"
            ></see-exam-detail>
        </el-dialog>
        <el-dialog :visible.sync="dialogChoiceExamType" width="20%" :show-close="false">
            <div class="choice-exam-type">
                <h1>请设置出题类型</h1>
                <div class="choice-exam-type-footer">
                    <el-button type="success" @click="addCustomExam">自定义出题</el-button>
                    <el-button type="primary" @click="addExam">随机出题</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="isEdit?'编辑':'添加'+'考试'" :visible.sync="dialogCreateOrEditCustomExam">
            <create-or-edit-custom-exam
                v-if="dialogCreateOrEditCustomExam"
                :examInfo="examInfo"
                :isEdit="isEdit"
                @cancel="cancel"
                @success="success"
            ></create-or-edit-custom-exam>
        </el-dialog>
    </div>
</template>

<script>
    import {teacherExam, teacherExamSearchExam} from "../../services/teacher";
    import dateFormat from "../../utils/dateFormat";
    import CreateOrEditExam from "./component/CreateOrEditExam";
    import SeeExamDetail from "./component/SeeExamDetail";
    import CreateOrEditCustomExam from "./component/CreateOrEditCustomExam";

    export default {
        name: "TeacherExam",
        components: {CreateOrEditExam, SeeExamDetail, CreateOrEditCustomExam},
        created() {
            this.loadExam()
            if (this.isEdit) {
                for (const item in this.examInfo) {
                    console.log(item)
                }
            }
        },
        data () {
            return {
                selectForm: {
                    examName: '',
                    openTime: '',
                    closeTime: ''
                },
                examList: [],
                examInfo: {},
                dialogChoiceExamType: false,
                dialogCreateOrEditCustomExam: false,
                dialogCreateOrEditExam: false,
                dialogSeeExamDetail: false,
                isEdit: false,
                loadingExam: true,
                pageList: [],
                pageExam: 1,
                pageSize: 5,
                pageSizes: [5,10,20,50,100],
                isDirector: false
            }
        },
        methods: {
            async loadExam () {
                try {
                    this.loadingExam = true
                    const {data} = await teacherExam()
                    if (data.code === '200') {
                        this.examList = data.data
                            this.examList.sort((a,b) => {
                            switch (new Date(a.openTime) > new Date(b.openTime)) {
                                case true: return -1
                                case false: return 1
                            }
                        })
                        if (data.data[0].realName) {
                            this.isDirector = true
                        }
                        this.handleSizeChange(5)
                    }
                    this.loadingExam = false
                } catch (e) {
                    this.loadingExam = false
                }
            },
            // 选择添加考试类型
            choiceExamType () {
                this.dialogChoiceExamType = true
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
                let form = {}
                for (const item in this.selectForm) {
                    if (this.selectForm[item]) {
                        form[item] = this.selectForm[item]
                    }
                }
                if (form) {
                    this.selectReq(form)
                } else {
                    this.loadExam()
                }
            },
            async selectReq (form) {
                try {
                    this.loadingExam = true
                    const {data} = await teacherExamSearchExam(form)
                    this.loadingExam = false
                    if (data.code === '200') {
                        this.examList = data.data
                        // console.log(this.examList)
                        this.handleSizeChange(this.pageSize)
                    }
                } catch (e) {
                    this.loadingExam = false
                }
            },
            addExam () {
                this.examInfo = {}
                this.isEdit = false
                this.dialogChoiceExamType = false
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditCustomExam = false
                this.dialogCreateOrEditExam = true
            },
            addCustomExam () {
                this.examInfo = {}
                this.isEdit = false
                this.dialogChoiceExamType = false
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditExam = false
                this.dialogCreateOrEditCustomExam = true
            },
            // 查看考试详情
            seeExam (row) {
                this.examInfo = row
                this.isEdit = true
                this.dialogChoiceExamType = false
                this.dialogCreateOrEditCustomExam = false
                this.dialogCreateOrEditExam = false
                this.dialogSeeExamDetail = true
            },
            editExam (row) {
                // console.log('row:')
                // console.log(row)
                this.isEdit = true
                this.examInfo = {...row}
                this.dialogChoiceExamType = false
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditCustomExam = false
                this.dialogCreateOrEditExam = false
                if (row.examPaperId) {
                    this.dialogCreateOrEditCustomExam = true
                } else {
                    this.dialogCreateOrEditExam = true
                }
            },
            cancel () {
                this.dialogChoiceExamType = false
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditCustomExam = false
                this.dialogCreateOrEditExam = false
            },
            success () {
                this.dialogChoiceExamType = false
                this.dialogSeeExamDetail = false
                this.dialogCreateOrEditCustomExam = false
                this.dialogCreateOrEditExam = false
                this.loadExam()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.handleCurrentChange(1)
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageExam = val
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
.choice-exam-type {
    h1 {
        font-size: 30px;
        margin-bottom: 50px;
    }
    .choice-exam-type-footer {
        display: flex;
        justify-content: space-between;
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
