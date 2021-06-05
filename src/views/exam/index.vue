<template>
<!--    <div class="examInfo">-->
    <div class="examInfo" @mouseleave="checkMouseStatus" @mouseenter="enterMouseStatus">
        <el-container>
            <el-header>
                <div v-if="isExam"
                    :class="lastTime>3600?'last-time-over-one-hour':(
                        lastTime>1800?'last-time-no-more-than-one-hour':(
                            lastTime>900?'last-time-no-more-than-half-hour':'last-time-no-more-than-one-quarter-of-an-hour'
                        )
                    )"
                >离考试结束还有：{{lastTime|setTime}}</div>
            </el-header>
            <el-main>
                <div v-if="isBeforeExam">
                    <el-card style="height: 80vh;">
                        <div slot="header">
                            <h1>考试科目：{{examMsg.examName}}</h1>
                            <div class="exam-info">
                                <h3>开始考试时间：{{examMsg.openTime}}</h3>
                                <h3>总分：{{examMsg.totalScore}}</h3>
                                <h3>时长：{{examMsg.duration}}分钟</h3>
                                <h3>最迟考试时间：{{examMsg.closeTime}}</h3>
                            </div>
                        </div>
                        <div>
                            <div class="exam-notice">
                                <h1>考试技巧</h1>
                                <span>
                                    <h4><span class="blue">选择题、填空题</span>可以<span class="blue">双击</span>进入下一题</h4>
                                    <h4><span class="blue">填空题</span>按<span class="blue">“Enter”</span>可以进入下一题</h4>
                                    <h4>只有<span class="blue">最后一道题</span>才有<span class="blue">提交</span>按钮</h4>
                                </span>
                                <h1>考试须知</h1>
                                <span>
                                    <h4 class="red">请在规定时间内答题</h4>
                                    <h4 class="red">鼠标不能移除界面内，不然会有进入警告倒计时！！</h4>
                                    <h4 class="red">警告只有三次</h4>
                                </span>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div>
                    <examming v-if="isExam"
                          :question="questionList"
                          @endExam="endExam"
                          @lastTime="setLastTime"
                          @setSEID="setSEID"
                          :code="code"
                    ></examming>
                </div>
            </el-main>
            <el-footer v-if="!isExam">
                <el-button type="info" size="big" @click="backToStudentInfo">返回</el-button>
                <el-button type="primary" @click="startExam" v-loading="loadingStratExam" size="big">开始考试</el-button>
            </el-footer>
        </el-container>
        <el-dialog title="自觉把鼠标放回来！！！" :visible.sync="dialogWarning">
            <h1 style="text-align:center;">违规次数：{{warning}}，超过3次自动交卷！</h1>
            <h1 style="text-align:center;color: #ED4646;">倒计时：{{warningTime}}</h1>
        </el-dialog>
    </div>
</template>

<script>
    import {studentExamGetStartExam} from "../../services/student";
    import {examGetExamDetails,examEndExam} from "../../services/exam";
    import Examming from "./components/Examming";
    import {setTime} from '@/utils/dateFormat'
    import {SECOND} from "../../config";

    export default {
        name: "examInfo",
        components: {Examming},
        data () {
            return {
                loadingStratExam: false,    //  开始考试按钮状态
                isBeforeExam: false,        //  是否处于考试前
                isExam: false,              //  在考试中？
                examMsg: {},                //  当堂考试信息
                // examInfo: {},
                questionList: {},           //  考题列表
                lastTime: 0,                //  倒计时
                warning: 0,                 //  警告次数（鼠标移除浏览器）
                warningStatus: false,       //  警告时鼠标状态
                warningTime: 10,            //  警告时间
                dialogWarning: false,       //  警告弹窗
                code: 0,                    //  考生状态 200 能开考， 201 不能考， 202 考试结束， 203 正在考试
                seid: 0
            }
        },
        created() {
            this.loadExamInfo()
        },
        methods: {
            async loadExamInfo () {
                // 判断该考生是否能参加考试
                // this.isExam = true
                this.isExam = false
                this.isBeforeExam = false
                const { data } = await examGetExamDetails({eid: this.$route.params.eid})
                if (data.code === '200') {
                    this.examMsg = data.data.exam
                    this.lastTime = parseInt(this.examMsg.duration) * 60
                    this.seid = data.data.seid
                    this.isBeforeExam = true
                    this.code = '200'
                    // console.log(data)
                } else if (data.code === '201') {
                    this.$message.warning('当前还没考试呢！！！')
                    this.backToStudentInfo()
                } else if (data.code === '202') {
                    this.$message.error('考试结束')
                    this.code = '202'
                    this.$router.push({name: 'GetStudentScore'})
                } else if (data.code === '203') {
                    // this.$message.error('正在考试，不可重复考试！！！')
                    this.code = '203'
                    this.$message.warning('返回考试中')
                    this.loadingStratExam = true
                    this.isBeforeExam = false
                    this.isExam = true
                    this.setTime()
                }
            },
            // 返回个人信息
            backToStudentInfo () {
                this.$router.push({name:'ExamList'})
            },
            // 开始考试
            async startExam () {
                this.loadingStratExam = true
                const { data } = await studentExamGetStartExam({eid: this.$route.params.eid})
                if (data.code === '200') {
                    // this.$message.success('开始考试！！！')
                    this.$notify({
                        title: '',
                        message: '开始考试！！！',
                        type: 'success'
                    })
                    this.seid = data.data.seid
                    this.questionList = data.data
                    this.isBeforeExam = false
                    this.isExam = true
                    this.code = '200'
                    this.setTime()
                } else if (data.code === '201') {
                    this.$message.warning('当前还没考试呢！！！')
                    this.code = '201'
                    this.backToStudentInfo()
                } else if (data.code === '202') {
                    this.$message.error('考试结束')
                    this.code = '202'
                    this.$router.push({name: 'GetStudentScore'})
                } else if (data.code === '203') {
                    this.code = '203'
                    this.$message.success('返回考试中')
                }
                // this.isBeforeExam = false
                // this.isExam = true
            },
            setTime () {
                // this.lasTime = this.examMsg.duration * 60
                const pass = setInterval(() => {
                    this.lastTime --
                    if (this.lastTime < 0) {
                        clearInterval(pass)
                        /*this.$message.error('考试结束！')
                        this.$router.push({name: 'GetStudentScore'})*/
                        this.endExam(this.seid)
                    } else if (this.lastTime === 3600) {
                        // this.$message.success('还有60分钟')
                        this.$notify({
                            message: '还有60分钟',
                            type: 'success'
                        })
                    } else if (this.lastTime === 1800) {
                        // this.$message.info('还有30分钟')
                        this.$notify({
                            message: '还有30分钟',
                            type: 'info'
                        })
                    } else if (this.lastTime === 900) {
                        // this.$message.warning('还有15分钟')
                        this.$notify({
                            message: '还有15分钟',
                            type: 'warning'
                        })
                    } else if (this.lastTime === 300) {
                        // this.$message.error('还有5分钟')
                        this.$notify({
                            message: '还有5分钟',
                            type: 'error'
                        })
                    }
                },/*1000*/SECOND)
            },
            async endExam (seid) {
                this.loadingStratExam = false    //  开始考试按钮状态
                this.isBeforeExam = false        //  是否处于考试前
                this.isExam = false
                const { data } = await examEndExam({seid: seid})
                if (data.code === '200') {
                    this.lastTime = 0
                    this.$router.push({name: 'GetStudentScore'})
                }
            },
            setLastTime (time) {
                // console.log(time)
                this.lastTime = parseInt(time)
            },
            // 判断鼠标状态
            checkMouseStatus () {
                if (this.isExam) {
                    if (this.warning < 3) {
                        this.warning++
                        this.warningTime = 10
                        this.dialogWarning = true
                        const lastWarningTime = setInterval(() => {
                            if (this.dialogWarning) {
                                this.warningTime --
                                if (this.warningTime < 0) {
                                    clearInterval(lastWarningTime)
                                    this.dialogWarning = false
                                    this.endExam(this.seid)
                                }
                            } else {
                                clearInterval(lastWarningTime)
                            }
                        },1000/*SECOND*/)
                    } else {
                        this.dialogWarning = false
                        this.endExam(this.seid)
                    }

                }
            },
            enterMouseStatus () {
                if (this.isExam) {
                    this.dialogWarning = false
                }
            },
            setSEID (seid) {
                this.seid = seid
            }
        },
        filters: {
            setTime
        }
    }
</script>

<style lang="scss" scoped>
.el-container {
    height: 100vh;
    overflow: hidden;
    .el-header {
        background-color: $primary-color;
        color: #333;
        text-align: center;
        line-height: 60px;
        .last-time-over-one-hour {
            color: $info-color;
            font-size: 20px;
        }
        .last-time-no-more-than-one-hour {
            color: white;
            font-size: 20px;
        }
        .last-time-no-more-than-half-hour {
            color: $warning-color;
            font-size: 22px;
        }
        .last-time-no-more-than-one-quarter-of-an-hour {
            color: $danger-color;
            font-size: 30px;
            font-weight: bold;
        }
    }
    .el-footer {
        background-color: #fff;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-main {
        background-color: #fff;
        color: #333;
        text-align: center;
        /*line-height: 160px;*/
        h1 {
            color: $danger-color;
        }
        .exam-info {
            display: flex;
            justify-content: center;
            h3 {
                margin: 0 20px;
            }
        }
    }
}
.blue {
    color: $success-color;
}
.red {
    color: $danger-color;
}
</style>
