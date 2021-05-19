<template>
    <div class="director-echarts">
        <div class="echarts">
            <div class="info">
                <div ref="studentEcharts" v-loading="loadingStudentEcharts" element-loading-text="拼命加载中"  class="student-echarts"></div>
                <div ref="questionBankEcharts" v-loading="loadingQuestionBankEcharts" element-loading-text="拼命加载中" class="question-bank-echarts"></div>
            </div>
            <h2>近四次考试成绩</h2>
            <div class="exam-echarts">
                <div ref="scoreEcharts_0" v-loading="loadingScoreEcharts" element-loading-text="拼命加载中" class="score-echarts"></div>
                <div ref="scoreEcharts_1" v-loading="loadingScoreEcharts" element-loading-text="拼命加载中" class="score-echarts"></div>
                <div ref="scoreEcharts_2" v-loading="loadingScoreEcharts" element-loading-text="拼命加载中" class="score-echarts"></div>
                <div ref="scoreEcharts_3" v-loading="loadingScoreEcharts" element-loading-text="拼命加载中" class="score-echarts"></div>
            </div></div>
    </div>
</template>

<script>
    import Echarts from "echarts";
    import {
        commonTeacherGetClassAverageScore,
        commonTeacherGetCollegeNumber,
        commonTeacherGetQuestionBankInfo
    } from "../../../services/teacher";

    export default {
        name: "DirectorEcharts",
        data () {
            return {
                loadingStudentEcharts: true,
                loadingQuestionBankEcharts: true,
                loadingScoreEcharts: false,
                studentEcharts: {
                    title: {
                        text: '学院信息',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '60%',
                            label: {
                                show: false,
                            },
                            data: [],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                questionBankEcharts: {
                    tooltip: {
                        trigger: 'item'
                    },
                    title: {
                        text: '题库信息',
                        left: 'center'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                /*label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }*/
                            },
                            labelLine: {
                                show: false
                            },
                            data: []
                        }
                    ]
                },
                scoreEcharts:  [
                    {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            name: '分数',
                            max: 100,
                            min: 0,
                            interval: 10
                        },
                        series: [{
                            data: [],
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.2)'
                            }
                        }]
                    },
                    {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            name: '分数',
                            max: 100,
                            min: 0,
                            interval: 10
                        },
                        series: [{
                            data: [],
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.2)'
                            }
                        }]
                    },
                    {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            name: '分数',
                            max: 100,
                            min: 0,
                            interval: 10
                        },
                        series: [{
                            data: [],
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.2)'
                            }
                        }]
                    },
                    {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        xAxis: {
                            type: 'category',
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            name: '分数',
                            max: 100,
                            min: 0,
                            interval: 10
                        },
                        series: [{
                            data: [],
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.2)'
                            }
                        }]
                    }
                ]
            }
        },
        mounted () {
            this.loadEcharts()
        },
        methods: {
            loadEcharts () {
                this.studentReq()
                this.questionBankReq()
                this.scoreReq()
            },
// 学院数据请求接口
            async studentReq() {
                const { data } = await commonTeacherGetCollegeNumber()
                this.loadingStudentEcharts = false
                if (data.code === '200') {
                    this.studentEcharts.series[0].data = data.data.map(item => {
                        return { value: item.number, name: item.collegeName }
                    })
                    this.student()
                }
            },
// 学院数据可视化
            student () {
                const studentEcharts = Echarts.init(this.$refs['studentEcharts'])
                studentEcharts.setOption(this.studentEcharts)
            },
// 题库数据请求接口
            async questionBankReq() {
                const { data } = await commonTeacherGetQuestionBankInfo()
                this.loadingQuestionBank = false
                if (data.code === '200') {
                    // console.log(data.data)
                    this.questionBankEcharts.series[0].data = data.data.map(item => {
                        return { value: item.number, name: item.questionBankName }
                    })
                    this.questionBank()
                }
            },
// 题库数据可视化
            questionBank () {
                const questionBankEcharts = Echarts.init(this.$refs['questionBankEcharts'])
                questionBankEcharts.setOption(this.questionBankEcharts)
            },
// 近期考试请求接口
            async scoreReq () {
                const { data } = await commonTeacherGetClassAverageScore()
                this.loadingScoreEcharts = false
                if (data.code === '200') {
                    // console.log(data.data)
                    this.getInfo(data.data)
                    this.recentlyScore()
                }
            },
            async getInfo(data) {
                await data.forEach((item, index) => {
                    this.scoreEcharts[index].title = { text: item.examName }
                    this.scoreEcharts[index].xAxis.data = []
                    this.scoreEcharts[index].series[0].data = []
                    item.class.forEach(element => {
                        this.scoreEcharts[index].xAxis.data.push(element.className)
                        this.scoreEcharts[index].series[0].data.push(parseFloat(element.averageScore).toFixed(1))
                    })
                    console.log(this.scoreEcharts[index].series.data)
                })
            },
// 近期考试可视化界面
            recentlyScore () {
                const scoreEcharts_0 = Echarts.init(this.$refs['scoreEcharts_0'])
                scoreEcharts_0.setOption(this.scoreEcharts[0])
                const scoreEcharts_1 = Echarts.init(this.$refs['scoreEcharts_1'])
                scoreEcharts_1.setOption(this.scoreEcharts[1])
                const scoreEcharts_2 = Echarts.init(this.$refs['scoreEcharts_2'])
                scoreEcharts_2.setOption(this.scoreEcharts[2])
                const scoreEcharts_3 = Echarts.init(this.$refs['scoreEcharts_3'])
                scoreEcharts_3.setOption(this.scoreEcharts[3])
            }
        }
    }
</script>

<style lang="scss" scoped>
    .director-echarts {
        .echarts {
            .info {
                display: flex;
                justify-content: center;
                height: 200px;
                .student-echarts {
                    width: 30%;
                    height: 200px;
                }
                .question-bank-echarts {
                    width: 30%;
                    height: 200px;
                }
            }
            .exam-echarts {
                display: flex;
                justify-content: center;
                .score-echarts {
                    width: 25%;
                    /*margin-top: 30px;*/
                    height: 300px;
                }
            }
        }
    }
</style>
