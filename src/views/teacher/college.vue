<template>
    <div class="teacher-college">
        <el-card>
            <div class="select-header">
                <el-button @click="addCollege" type="primary">新建学院</el-button>
                <el-button @click="addMajor" type="primary" :disabled="!collegeInfo">新建专业</el-button>
                <el-button @click="addClass" type="primary" :disabled="!majorInfo">新建班级</el-button>
            </div>
        </el-card>
        <div class="teacher-college-main">
            <el-card style="width: 340px">
                <el-table
                    :data="collegeList"
                    v-loading="loadingCollege"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    border
                    style="width: 100%">
                    <el-table-column
                            prop="collegeName"
                            label="学院">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="180">
                        <template slot-scope="scope">
                            <el-button @click="seeMajor(scope.row)" type="primary" size="small" icon="el-icon-search" circle></el-button>
<!--                            <el-button @click="addMajor(scope.row)" type="success" size="small" icon="el-icon-circle-plus" circle></el-button>-->
                            <el-button @click="editCollege(scope.row)" type="info" icon="el-icon-edit" size="small" circle></el-button>
                            <el-button @click="delCollege(scope.row)" type="danger" icon="el-icon-delete" size="small" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card style="width: 340px">
                <el-table
                    :data="majorList"
                    border
                    v-loading="loadingMajor"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    style="width: 100%">
                    <el-table-column
                            prop="majorName"
                            label="专业">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="180">
                        <template slot-scope="scope">
                            <el-button @click="seeClass(scope.row)" type="primary" size="small" icon="el-icon-search" circle></el-button>
<!--                            <el-button @click="addClass(scope.row)" type="success" size="small" icon="el-icon-circle-plus" circle></el-button>-->
                            <el-button @click="editMajor(scope.row)" type="info" icon="el-icon-edit" size="small" circle></el-button>
                            <el-button @click="delMajor(scope.row)" type="danger" icon="el-icon-delete" size="small" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card style="width: 340px">
                <el-table
                    :data="classList"
                    v-loading="loadingClass"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="className"
                        label="班级">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="130">
                        <template slot-scope="scope">
<!--                            <el-button @click="editClass(scope.row)" type="info" icon="el-icon-edit" size="small" circle></el-button>-->
                            <el-button @click="delClass(scope.row)" type="danger" icon="el-icon-delete" size="small" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <div>
            <el-dialog :title="(dialogType%2===1?'编辑':'添加') + (dialogType-2<0?'学院':dialogType-4<0?'专业':'班级')" :visible.sync="dialog">
                <el-form :model="formInfo" v-if="dialogType-2<0">
                    <el-form-item label="学院名称" label-width="12rem">
                        <el-input v-model="formInfo.collegeName" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="formInfo" v-else-if="dialogType-4<0">
                    <h1>学院：{{collegeInfo.collegeName}}</h1>
                    <el-form-item label="专业名称" label-width="12rem">
                        <el-input v-model="formInfo.majorName" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="formInfo" v-else-if="dialogType===4">
                    <h1>学院：{{collegeInfo.collegeName}}</h1>
                    <h1>专业：{{majorInfo.majorName}}</h1>
                    <span>只能填年份，如：2017</span>
                    <el-form-item label="年级" label-width="12rem">
                        <el-input v-model="formInfo.className" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="success">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {
        teacherCollege,
        teacherCollegeAddCollege,
        teacherCollegeAddMajor,
        teacherGetMajor,
        teacherCollegeGetClassName,
        teacherCollegeAddClass,
        teacherCollegeEditCollege,
        teacherCollegeEditMajor, teacherCollegeDelCollege, teacherCollegedelMajor, teacherCollegedelClass
    } from "../../services/teacher";

    export default {
        name: "TeacherCollege",
        created() {
            this.loadCollege()
        },
        data () {
            return {
                collegeList: [],
                majorList: [],
                classList: [],
                // 弹窗状态
                dialog: false,
                // 弹窗显示内容属性
                // 0:添加学院, 1:编辑学院, 2:添加专业, 3: 修改专业， 4:添加班级， 5：修改班级
                dialogType: 0,
                // 被选中的学院信息
                collegeInfo: '',
                // 被选中的专业信息
                majorInfo: '',
                // 专业信息
                formInfo: {},
                // 弹窗请求状态
                wat: false,
                loadingCollege: true,
                loadingMajor: false,
                loadingClass: false
            }
        },
        methods: {
            async loadCollege () {
                try {
                    this.loadingCollege = true
                    const {data} = await teacherCollege()
                    this.loadingCollege = false
                    console.log(data)
                    if (data.code === '200') {
                        console.log(data.data)
                        this.collegeList = data.data
                        this.collegeInfo = ''
                        this.majorList = []
                        this.majorInfo = ''
                        this.classList = []
                    }
                } catch (e) {
                    this.loadingCollege = false
                }
            },
            // 添加学院的弹窗
            addCollege () {
                this.dialog = true
                this.dialogType = 0
                this.isEdit = false
                this.formInfo = {}
            },
            // 添加专业的弹窗
            addMajor () {
                // this.collegeInfo = row
                this.dialog = true
                this.dialogType = 2
                this.isEdit = false
                this.formInfo = {}
            },
            /*// 添加专业的弹窗
            addMajor ( row ) {
                this.collegeInfo = row
                this.dialog = true
                this.dialogType = 2
                this.isEdit = false
                this.formInfo = {}
            },*/
            // 添加班级
            addClass () {
                this.dialog = true
                this.dialogType = 4
                this.isEdit = false
                this.formInfo = {}
            },
            /*// 添加班级
            addClass ( row ) {
                this.majorInfo = row
                this.dialog = true
                this.dialogType = 4
                this.isEdit = false
                this.formInfo = {}
            },*/
            // 查看专业
            async seeMajor (row) {
                this.majorInfo = ''
                try {
                    this.loadingMajor = true
                    this.collegeInfo = {
                        collegeName: row.collegeName,
                        id: row.id
                    }
                    this.classList = {}
                    const {data} = await teacherGetMajor({collegeId: row.id})
                    if (data.code === '200') {
                        this.majorList = data.data
                        this.classList = []
                    }
                    this.loadingMajor = false
                } catch (e) {
                    this.loadingMajor = false
                }
            },
            //
            editCollege (row) {
                this.dialog = true
                this.dialogType = 1
                this.isEdit = true
                this.formInfo = {...row}
            },
            // 删除学院
            delCollege (row) {
                this.$confirm(`警告：你正在删除 ${row.collegeName} ，确认么？？？`,'删除警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.delCollegeReq(row)
                }).catch(() => {
                    this.$message.info('已经取消')
                })
            },
            async delCollegeReq (row) {
                const { data } = await teacherCollegeDelCollege({collegeId: row.id})
                if (data.code === '200') {
                    this.$message.warning('删除成功！')
                    this.loadCollege()
                } else {
                    this.$message.error('无权操作')
                }
            },
            // 查询班级
            async seeClass (row) {
                try {
                    this.majorInfo = {
                        collegeId: row.collegeId,
                        majorName: row.majorName,
                        id: row.id
                    }
                    this.loadingClass = true
                    // console.log(row)
                    const {data} = await teacherCollegeGetClassName({majorId: row.id})
                    if (data.code === '200') {
                        this.classList = data.data
                        // console.log(this.classList)
                    }
                    this.loadingClass = false
                } catch (e) {
                    this.loadingClass = false
                }
            },
            // 编辑专业
            editMajor (row) {
                this.dialog = true
                this.dialogType = 3
                this.isEdit = true
                this.formInfo = {...row}
            },
            // 删除专业
            delMajor (row) {
                this.$confirm(`警告：你正在删除 ${row.majorName} ，确认么？？？`,'删除警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.delMajorReq(row)
                }).catch(() => {
                    this.$message.info('已经取消')
                })
            },
            async delMajorReq (row) {
                const { data } = await teacherCollegedelMajor({majorId: row.id})
                if (data.code === '200') {
                    this.$message.warning('删除成功！')
                    this.seeMajor(this.collegeInfo)
                    // this.loadCollege()
                } else {
                    this.$message.error('无权操作')
                }
            },
            /*// 未完成 编辑班级
            editClass (row) {
                this.dialog = true
                this.dialogType = 5
                this.isEdit = true
                this.formInfo = row
            },*/
            // 删除班级
            delClass (row) {
                this.$confirm(`警告：你正在删除 ${row.className} ，确认么？？？`,'删除警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.delClassReq(row)
                }).catch(() => {
                    this.$message.info('已经取消')
                })
            },
            async delClassReq (row) {
                const { data } = await teacherCollegedelClass({classId: row.id})
                if (data.code === '200') {
                    this.$message.warning('删除成功！')
                    this.seeClass(this.majorInfo)
                } else {
                    this.$message.error('无权操作')
                }
            },
            // 取消
            cancel () {
                this.dialog = false
            },
            // 未完成 成功
            success () {
                this.wat = false
                switch (this.dialogType) {
                    case 0: this.createCollege(); break;
                    case 1: this.editCollegeReq(); break;
                    case 2: this.createMajor(); break;
                    case 3: this.editMajorReq(); break;
                    case 4: this.createClass(); break;
                }
                // console.log(this.wat)
                // if (this.wat) {
                //     this.$message.success('添加成功')
                // }
            },
            // 添加学院请求
            async createCollege () {
                const {data} = await teacherCollegeAddCollege(this.formInfo)
                if (data.code === '200') {
                    this.$message.success('添加成功')
                    this.loadingCollege = true
                    this.loadCollege()
                    this.dialog = false
                    this.wat = true
                } else if (data.code === '403') {
                    this.$message.error('学院重名!!!')
                    this.wat = false
                } else {
                    this.$message.error('添加失败!!!')
                    this.wat = false
                }
            },
            // 编辑学院请求
            async editCollegeReq () {
                const { data } = await teacherCollegeEditCollege(this.formInfo)
                if (data.code === '200') {
                    this.$message.success('编辑成功')
                    this.loadingCollege = true
                    this.loadCollege()
                    this.dialog = false
                    this.wat = true
                } else if (data.code === '403') {
                    this.$message.error('学院重名!!!')
                    this.wat = false
                } else {
                    this.$message.error('添加失败!!!')
                    this.wat = false
                }
            },
            // 添加专业请求
            async createMajor () {
                try {
                    this.loadingMajor = true
                    const {data} = await teacherCollegeAddMajor({
                        collegeId: this.collegeInfo.id,
                        majorName: this.formInfo.majorName
                    })
                    if (data.code === '200') {
                        this.loadingMajor = false
                        this.$message.success('添加成功')
                        this.seeMajor(this.collegeInfo)
                        this.wat = true
                        this.dialog = false
                    } else if (data.code === '403') {
                        this.loadingMajor = false
                        this.$message.error('专业重名！！')
                        this.wat = true
                    } else {
                        this.$message.error('添加失败!!!')
                        this.wat = false
                    }
                } catch (e) {
                    this.loadingMajor = false
                }
            },
            // 编辑专业请求
            async editMajorReq () {
                // this.loadingMajor = true
                const {data} = await teacherCollegeEditMajor(this.formInfo)
                if (data.code === '200') {
                    // this.loadingMajor = false
                    this.$message.success('编辑成功')
                    this.seeMajor(this.collegeInfo)
                    this.wat = true
                    this.dialog = false
                } else if (data.code === '403') {
                    this.loadingMajor = false
                    this.$message.error('专业重名！！')
                    this.wat = true
                } else {
                    this.$message.error('编辑失败!!!')
                    this.wat = false
                }
            },
            // 添加班级
            async createClass () {
                let info = parseInt(this.formInfo.className)
                if (info>=2000&&info<=2100&&!/^[a-z\u4e00-\u9fa5]+$/g.test(this.formInfo.className)) {
                    // console.log('OK')
                    try {
                        this.loadingClass = true
                        const {data} = await teacherCollegeAddClass({
                            majorId: this.majorInfo.id,
                            grade: info
                        })
                        this.loadingClass = false
                        if (data.code === '200') {
                            this.$message.success('添加成功')
                            this.seeClass(this.majorInfo)
                            this.wat = true
                            this.dialog = false
                        } else {
                            this.$message.error('添加失败!!!')
                            this.wat = false
                        }
                    } catch (e) {
                        this.loadingClass = false
                    }
                } else {
                    this.$message.error('年级有误，请输入正确年份！')
                    this.wat = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.teacher-college {
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
    .teacher-college-main {
        display: flex;
        justify-content: left;
    }
}
</style>
