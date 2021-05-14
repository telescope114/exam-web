<template>
    <div class="see-exam-paper">
        <div class="see-exam-paper-main">
            <div class="choice-question">
                <div v-if="choiceQuestionList.length">
                    <h1>选择题，每题{{this.examPaperInfo.choiceQuestionScore}}分，共{{this.examPaperInfo.choiceQuestionScore * this.examPaperInfo.choiceQuestion}}分</h1>
                    <el-table border :data="choiceQuestionList" >
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="试题名称" prop="title"></el-table-column>
                        <el-table-column label="答案" width="100px" prop="answer"></el-table-column>
                        <el-table-column label="选项">
                            <template slot-scope="scope">
                                <div>
                                    <p v-for="item in scope.row.optionList" :key="item.id" v-text="item.option"></p>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="judgmentQuestionList.length">
                    <h1>选择题，每题{{this.examPaperInfo.judgmentQuestionScore}}分，共{{this.examPaperInfo.judgmentQuestionScore * this.examPaperInfo.judgmentQuestion}}分</h1>
                    <el-table border :data="judgmentQuestionList" >
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="试题名称" prop="title"></el-table-column>
                        <el-table-column label="答案" width="200px" prop="answer"></el-table-column>
                    </el-table>
                </div>
                <div v-if="fillQuestionList.length">
                    <h1>选择题，每题{{this.examPaperInfo.fillQuestionScore}}分，共{{this.examPaperInfo.fillQuestionScore * this.examPaperInfo.fillQuestion}}分</h1>
                    <el-table border :data="fillQuestionList" >
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="试题名称" prop="title"></el-table-column>
                        <el-table-column label="答案" width="200px" prop="answer"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="$emit('cancel')">确定</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherExamPaperSeeExamPaper} from "../../../services/teacher";

    export default {
        name: "SeeExamPaper",
        props: {
            examPaperInfo: {
                type: Object,
                default: new Object({})
            }
        },
        data () {
            return {
                choiceQuestionList: [],
                judgmentQuestionList: [],
                fillQuestionList: []
            }
        },
        created() {
            this.loadExamPaper()
        },
        methods: {
            async loadExamPaper () {
                const { data } = await teacherExamPaperSeeExamPaper({
                    examPaperId: this.examPaperInfo.id
                })
                if (data.code === '200') {
                    data.data.forEach(item => {
                        switch (item.type) {
                            case 0: this.choiceQuestionList.push(item); break;
                            case 2: this.judgmentQuestionList.push(item); break;
                            case 1: this.fillQuestionList.push(item); break;
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.see-exam-paper {
    .footer {
        margin-top: 20px;
    }
}
</style>
