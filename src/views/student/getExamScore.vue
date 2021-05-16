<template>
    <div class="get-exam-score">
        <div v-if="isJoinExam" class="join-exam">
            <el-card style="width: 20%">
                <div slot="header">
                    <h1 style="color: #ed4646">{{studentScoreInfo.examName}}</h1>
                    <div class="score">
                        <h4>总分：{{studentScoreInfo.totalScore}}</h4>
                        <h4>得分：{{studentScoreInfo.studentTotalScore}}</h4>
                    </div>
                </div>
                <div>
                    <div>
                        <h3>题目</h3>
                        <div>
                            <el-tag v-for="(item,index) in questionList" :type="item.answer === item.myAnswer?'primary':'danger'" :key="index" @click="enterToQuestion(index)">{{index+1}}</el-tag>
                        </div>
                    </div>
                    <div style="margin-top: 10px">
                        <el-button type="info" @click="backToScoreList">返回</el-button>
                        <el-button :disabled="loadingScore" type="warning" v-loading="loadingPrintScore" @click="printScore">打印</el-button>
                    </div>
                </div>
            </el-card>
            <el-card style="width: 80%">
                <div slot="header">
                    <h1 style="text-align: left">第{{questionFirst + 1}}题：{{questionInfo.title}}</h1>
                </div>
                <div>
                    <div class="answer" :style="questionInfo.myAnswer===questionInfo.answer?'color: #288f5d;':'color: #ed4646;'">
                        <label v-show="isShow">我的答案：{{questionInfo.myAnswer}}</label>
                        <label v-show="isShow">正确答案：{{questionInfo.answer}}</label>
                    </div>
                </div>
                <div v-if="questionInfo.optionList">
                    <p v-for="(item,index) in questionInfo.optionList" :key="index" style="text-align: left">{{item.option}}</p>
                </div>
                <el-button v-if="isShow" type="text" @click="isShow=false">隐藏答案</el-button>
                <el-button v-else type="primary" @click="isShow=true">显示答案</el-button>
            </el-card>
        </div>
        <div v-else class="not-join-exam">
            <el-card>
                <div slot="header">
                    <h1 style="color: #ed4646">{{studentScoreInfo.examName}}</h1>
                    <div class="score">
                        <h4>总分：{{studentScoreInfo.totalScore}}</h4>
                        <h4>得分：{{studentScoreInfo.studentTotalScore}}</h4>
                    </div>
                </div>
                <div>
                    <div>
                        <h1 style="color: #ED4646;text-align: center;">未参考！！！</h1>
                    </div>
                    <el-button type="info" @click="backToScoreList">返回</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {studentDownLoadScore, studentPrintScore, studentScoreFindScore} from "../../services/student";

    export default {
        name: "getExamScore",
        data () {
            return {
                loadingScore: true,
                loadingPrintScore: false,
                studentScoreInfo: {},
                questionList: [],
                questionFirst: 0,
                isJoinExam: false,
                isShow: true,
                questionInfo: {}
            }
        },
        created() {
            this.loadExam()
        },
        methods: {
            async loadExam () {
                this.loadingScore = true
                const { data } = await studentScoreFindScore({eid:this.$route.params.id})
                this.loadingScore = false
                this.studentScoreInfo = data.data.studentAndExamInfo
                if (data.code === '200') {
                    this.isJoinExam = true
                    this.questionList = data.data.studentScore
                    this.enterToQuestion(0)
                } else if (data.code === '204') {
                    this.isJoinExam = false
                }
            },
            enterToQuestion (index) {
                this.questionFirst = index
                this.questionInfo = this.questionList[index]
            },
            backToScoreList () {
                this.$router.push({name: 'GetStudentScore'})
            },
            async printScore () {
                this.loadingPrintScore = true
                const { data } = await studentPrintScore({eid:this.$route.params.id})
                if (data.code === '200') {
                    // console.log(data)
                    // const download = document.createElement('a')
                    // download.href = `${serve}/file/download?fileName=${data.data}`
                    // download.target = '_blank'
                    // download.click()
                    // window.open('172.22.162.111:8080/file/download?fileName='+data.data, '_blank')
                    this.downloadScore(data.data)
                }
                this.loadingPrintScore = false
            },
            async downloadScore (fileName) {
                const data = await studentDownLoadScore(fileName)
                /*const binaryData = [];
                binaryData.push(data.data);
                //获取blob链接
                this.pdfUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }));
                window.open(this.pdfUrl);*/
                this.pdfUrl = window.URL.createObjectURL(new Blob([data.data], { type: `application/pdf` }));
                const fname = `${this.studentScoreInfo.examName}成绩表`
                const link = document.createElement('a')
                link.href = this.pdfUrl
                link.setAttribute('download', fname)
                document.body.appendChild(link)
                link.click()
                // if (data.code === '200') {
                //     console.log(data)
                // }
            }
        }
    }
</script>

<style lang="scss" scoped>
.get-exam-score {
    .join-exam {
        display: flex;
        justify-content: center;
        .el-card {
            height: 80vh;
            .score {
                display: flex;
                justify-content: center;
                h4 {
                    margin: 0 10px;
                }
            }
            .answer {
                display: flex;
                justify-content: left;
                align-items: center;
                label {
                    margin: 0 10px;
                }
            }
        }
    }
    .not-join-exam {
        .el-card {
            height: 80vh;
            .score {
                display: flex;
                justify-content: center;
                h4 {
                    margin: 0 10px;
                }
            }
        }
    }
    .el-tag {
        cursor: pointer;
    }
}
</style>
