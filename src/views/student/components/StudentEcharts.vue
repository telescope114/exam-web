<template>
    <div class="student-echarts" ref="studentEcharts"></div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "StudentEcharts",
        data () {
            return {
                studentEcharts: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    /*toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },*/
                    legend: {
                        data: ['考试成绩', '专业排名']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '成绩',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} 分'
                            }
                        },
                        {
                            type: 'value',
                            name: '名次',
                            min: 0,
                            max: 400,
                            inverse: true,
                            interval: 40,
                            axisLabel: {
                                formatter: `{value}`
                            }
                        }
                    ],
                    series: [
                        {
                            name: '考试成绩',
                            type: 'bar',
                            data: [90.0, 88.0, 78.5, 60.8, 70.9, 79.9]
                        },
                        {
                            name: '专业排名',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [3, 5, 22, 180, 100, 52]
                        }
                    ]
                }
            }
        },
        mounted() {
            this.loadStudentEcharts()
        },
        methods: {
            loadStudentEcharts () {
                // student.xAxis[0].data  => 考试科目/横坐标
                // .series[1].data => 每科排名 正整型
                // .series[0].data => 每科成绩 数据
                // .yAxis[1].max => 专业人数
                const myEcharts = echarts.init(this.$refs.studentEcharts)
                myEcharts.setOption(this.studentEcharts)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
