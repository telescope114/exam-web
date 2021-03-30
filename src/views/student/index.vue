<template>
    <div class="student-exam">
        <el-container>
            <el-header>
                <el-menu
                    :default-active="titleAim"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleClick"
                    background-color="#288F5D"
                    text-color="#fff"
                    active-text-color="#FCC419">
                    <el-menu-item index="1">个人信息</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">考试信息</template>
                        <el-menu-item index="2-1">去考试</el-menu-item>
                        <el-menu-item index="2-2">成绩查询</el-menu-item>
                        <!--<el-menu-item index="2-3">选项3</el-menu-item>
                        <el-submenu index="2-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="2-4-1">选项1</el-menu-item>
                            <el-menu-item index="2-4-2">选项2</el-menu-item>
                            <el-menu-item index="2-4-3">选项3</el-menu-item>
                        </el-submenu>-->
                    </el-submenu>
                    <!--<el-menu-item index="3" disabled>消息中心</el-menu-item>
                    <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
                </el-menu>
            </el-header>
            <el-main>
                <el-card>
                    <div>
                        <div v-if="titleAim === '1'">
                            <h1>个人信息</h1>
                        </div>
                        <div v-else-if="titleAim === '2-1'">
                            <h1>考试信息</h1>
                            <el-table
                                :data="studentExamList"
                                v-loading="loadingStudentExam"
                            >
                                <el-table-column fixed label="考试科目">
                                    <template slot-scope="scope">
                                        <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.examName}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始考试时间">
                                    <template slot-scope="scope">
                                        <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.openTime|dateFormat}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="最迟参考时间">
                                    <template slot-scope="scope">
                                        <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.closeTime|dateFormat}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="考试科目">
                                    <template slot-scope="scope">
                                        <p :class="checkExamTime(scope.row)?'examing':'before-exam'">{{scope.row.duration + '分钟'}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button v-if="checkExamTime(scope.row)" type="primary" @click="toJoinExan(scope.row)">去考试</el-button>
                                        <el-button v-else type="success" @click="beforeExam" disabled>未开考</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-else-if="titleAim === '2-2'">
                            <h1>成绩信息</h1>
                        </div>
                    </div>
                    <div>
                    </div>
                </el-card>
            </el-main>
        </el-container></div>
</template>

<script>
    import {studentExamGetExamList /*,studentExamGetStartExam*/} from "../../services/student";
    import dateFormat from "../../utils/dateFormat";

    export default {
        name: "index",
        data () {
            return {
                loadingStudentExam: true,
                studentExamList: [],
                titleAim: '1'
            }
        },
        created() {
            // this.loadStudentExam()
        },
        methods: {
            async loadStudentExam () {
                this.loadingStudentExam = true
                const { data } = await studentExamGetExamList()
                this.loadingStudentExam = false
                if (data.code === '200') {
                    this.studentExamList = data.data
                    console.log(this.studentExamList)
                }
            },
            // 头部菜单
            handleClick(key, keyPath) {
                this.titleAim = key
                if (this.titleAim === '2-1') {
                    this.loadStudentExam()
                }
                console.log(key, keyPath)
            },
            // 去考试按钮
            toJoinExan (row) {
                /*const { data } = await studentExamGetStartExam({eid:row.id})
                if (data.code === '200') {*/
                    this.$router.push({name:'ExamInfo',params:{eid:row.id}})
                /*} else if (data.code === '201') {
                    this.$message.warning('当前还没考试呢！！！')
                } else if (data.code === '203') {
                    this.$message.error('正在考试，不可重复考试！！！')
                }*/
                // console.log(row)
            },
            // 未开考按钮
            beforeExam () {
                this.$message.error('当前还没考试呢！！')
            },
            // 判断考试状态
            checkExamTime (row) {
                const date = new Date()
                const open = new Date(row.openTime)
                const close = new Date(row.closeTime)
                // console.log(open)
                if (date < open || date > close) {
                    return false
                    // return true
                } else {
                    return true
                }
            }
        },
        filters: {
            dateFormat
        }
    }
</script>

<style lang="scss" scoped>
.student-exam {
    .el-header {
        background-color: $primary-color;
        color: #333;
        text-align: center;
        line-height: 10vh;
        .el-menu {
            width: 50%;
        }
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        .el-card {
            height: 80vh;
            .before-exam {
                color: $success-color;
            }
            .examing {
                color: $primary-color;
                font-weight: bold;
                font-size: 20px;
            }
        }
    }
}
</style>
