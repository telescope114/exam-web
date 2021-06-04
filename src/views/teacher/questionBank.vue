<template>
    <div class="teacher-question-bank">
        <el-card>
            <div class="select-header">
                <el-button @click="addQuestionBank" type="primary" v-if="$store.state.role">添加题库</el-button>
                <el-button type="success" icon="el-icon-upload2" @click="uploadQuestionBank" v-if="$store.state.role">导入题库</el-button>
                <div class="select">
                    <label>题库搜索</label>
                    <el-input placeholder="请输入题库" style="width: 150px" v-model="selectForm.questionBankName" clearable></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="search" circle></el-button>
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
                    v-if="$store.state.role === 0"
                    prop="teacherName"
                    label="负责教师"
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
                    label="状态"
                >
                    <template slot-scope="scope">
                        <el-tooltip :content="'当前状态：'+(scope.row.status>0?'启用':'禁用')" placement="top" :enterable="false">
                            <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0"
                                inactive-color="#ff4949"
                                @click.native="enableOrDisable(scope.row)"
                            ></el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <!--<el-tooltip content="查看" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="seeQuestionBank(scope.row)" circle></el-button>
                        </el-tooltip>-->
                        <el-tooltip content="编辑" placement="top">
                            <el-button type="info" size="mini" icon="el-icon-edit" @click="editQuestionBank(scope.row)" circle></el-button>
                        </el-tooltip>
                        <!--<el-tooltip content="删除" placement="top">
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delQuestionBank(scope.row)" circle></el-button>
                        </el-tooltip>-->
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
        <el-dialog title="上传文件" :visible.sync="dialogUpdateFile">
                <!--<el-upload
                        class="upload-demo"
                        drag
                        action="http://172.22.162.111:8080/teacher/questionBank/importQuestionBank"
                        :headers="{'Authorization': $store.state.user}"
                        multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>-->
                <!-- 自定义上传 -->
                <!--<el-upload
                        class="upload-demo"
                        drag
                        action="http://172.22.162.111:8080/teacher/questionBank/importQuestionBank"
                        :headers="{'Authorization': $store.state.user}"
                        multiple>
                    &lt;!&ndash; 图片预览修改为当前Upload对应数据 &ndash;&gt;
                    <img v-if="course.courseListFile" :src="course.courseListFile" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>-->
            <upload-file v-if="dialogUpdateFile" @cancel="cancel" @success="success"></upload-file>
        </el-dialog>
    </div>
</template>

<script>
    import {
        teacherQuestionBank,
        teacherQuestionBankDisable,
        teacherQuestionBankEnable,
        teacherQuestionBankSearchQuestionBankName
    } from "../../services/teacher";
    import CreateOrEditQuestionBank from "./component/CreateOrEditQuestionBank";
    import UploadFile from "./component/UploadFile";

    export default {
        name: "TeacherQuestionBank",
        components: { CreateOrEditQuestionBank,UploadFile },
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
                dialogUpdateFile: false,
                questionBankInfo: {},
                isEdit: false,
                pageSize: 5,
                pageSizes: [5,10,20,50],
                pageList: [],
                pageQuestionBank: 1,
                loadingQuestionBank: true,
                course: {
                    courseListFile: ''
                }
                // fileList: []            //  上传的文件列表
                // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            }
        },
        methods: {
            async loadQuestionBank () {
                try {
                    this.loadingQuestionBank = true
                    const {data} = await teacherQuestionBank()
                    this.loadingQuestionBank = false
                    if (data.code === '200') {
                        this.questionBankList = data.data
                        this.handleSizeChange(5)
                    }
                } catch (e) {
                    this.loadingQuestionBank = false
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
            search () {
                if (this.selectForm.questionBankName) {
                    this.searchReq()
                } else {
                    this.loadQuestionBank()
                }
            },
            async searchReq () {
                const { data } = await teacherQuestionBankSearchQuestionBankName({questionBankName: this.selectForm.questionBankName})
                if (data.code === '200') {
                    this.questionBankList = data.data
                    this.handleSizeChange(5)
                }
            },
            // 启用禁用
            enableOrDisable (row) {
                if (row.status === 1) {
                    this.enableQuestionBank(row)
                } else {
                    this.$confirm(`警告：你正在禁用 ${row.questionBankName}`,'禁用警告',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.disableQuestionBank(row)
                    }).catch(() => {
                        this.$message.info('已经取消')
                        row.status = 1
                    })
                }
            },
            async enableQuestionBank (row) {
                try {
                    const {data} = await teacherQuestionBankEnable({questionBankId: row.id})
                    if (data.code === '200') {
                        this.$message.success('启用成功')
                        row.status = 1
                    } else {
                        this.$message.error('无权操作！！')
                        row.status = 0
                    }
                } catch (e) {
                    row.status = 0
                }
            },
            async disableQuestionBank (row) {
                try {
                    const {data} = await teacherQuestionBankDisable({questionBankId: row.id})
                    if (data.code === '200') {
                        this.$message.warning('禁用成功')
                        row.status = 0
                    } else {
                        this.$message.error('无权操作！！')
                        row.status = 1
                    }
                } catch (e) {
                    row.status = 1
                }
            },
            // 编辑题库
            editQuestionBank: function (row) {
                this.questionBankInfo = {
                    questionBankId: row.id,
                    questionBankName: row.questionBankName
                }
                this.isEdit = true
                this.dialogCreateOrEditQuestionBank = true
            },
            // 上传题库
            uploadQuestionBank () {
                this.dialogUpdateFile = true
            },
            cancel () {
                this.dialogCreateOrEditQuestionBank = false
                this.dialogUpdateFile = false
                this.questionBankInfo = {}
            },
            success () {
                this.dialogCreateOrEditQuestionBank = false
                this.dialogUpdateFile = false
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
