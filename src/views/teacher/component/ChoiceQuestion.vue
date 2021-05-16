<template>
    <div class="choice-question">
        <div class="choice-question-main">
<!--            <el-button class="all-checked-or-no-checked" type="primary" size="small" v-show="checkedList.length !== questionList.length" @click="setAllIsChecked(true)">全选</el-button>-->
<!--            <el-button class="all-checked-or-no-checked" type="warm" size="small" v-show="checkedList.length === questionList.length" @click="setAllIsChecked(false)">不选</el-button>-->
            <el-table
                    ref="multipleTable"
                    :data="backQuestionList">
                <el-table-column
                        width="55">
                    <template slot-scope="scope">
                        <el-checkbox :checked="scope.row.isChecked" @change="changeChecked(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="题目" prop="title"></el-table-column>
                <el-table-column label="答案" prop="answer"></el-table-column>
                <el-table-column label="选项" v-if="questionListType === 0">
                    <template slot-scope="scope">
                        <div>
                            <p v-for="(item, index) in scope.row.option" :key="index">{{item.option}}</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer">
            <el-button type="primary" @click="success">确定</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ChoiceQuestion",
        props: {
            questionList: {
                type: Array,
                default: new Array([])
            },
            questionListType: {
                type: Number,
                default: -1
            },
            checkedList: {
                type: Array,
                default: new Array([])
            }
        },
        data () {
            return {
                backQuestionList: []
            }
        },
        created() {
            this.setChecked()
        },
        methods: {
            setChecked () {
                const check = new Set(this.checkedList.map(item => item.id))
                this.backQuestionList = this.questionList.map(item => {
                    // console.log(123)
                    if (check.has(item.id)) {
                        check.delete(item.id)
                        return { ...item, isChecked: true }
                    } else {
                        return { ...item, isChecked: false }
                    }
                })
            },
            changeChecked (row) {
                row.isChecked = !row.isChecked
                console.log(row)
            },
            setAllIsChecked (isChecked) {
                for (let i = 0; i < this.backQuestionList.length; i++) {
                    this.backQuestionList[i].isChecked = isChecked
                }
            },
            success () {
                this.$emit('success', this.backQuestionList.filter(item => item.isChecked))
            },
            cancel () {
                this.$emit('cancel')
            }
        }
    }
</script>

<style lang="scss" scoped>
.footer {
    margin-top: 10px;
}
.all-checked-or-no-checked {
    float: left;
}
</style>
