<template>
    <div class="choice-question">
        <div class="choice-question-main">
            <!--<el-table
                :data="questionList"
                ref="multipleTable"
            >
                <el-table-column >
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
            </el-table>-->
            <el-table
                    ref="multipleTable"
                    :data="questionList"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
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
            <!--<div style="margin-top: 20px">
                <el-button @click="toggleSelection([...checkedList])">切换第二的选中状态</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
            </div>-->
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
        beforeUpdate() {
            this.aimList()
        },
        methods: {
            aimList() {
                this.backQuestionList = [...this.checkedList]
                this.toggleSelection([...this.checkedList])
            },
            toggleSelection(rows) {
                // console.log(rows)
                const checked = new Set(this.backQuestionList.map(item => item.id))
                // console.log(this.$refs.multipleTable)
                if (rows) {
                    rows.forEach(row => {
                        if (checked.has(row.id)) {
                            checked.delete(row.id)
                            console.log(123)
                            this.$refs.multipleTable.toggleRowSelection(row, true)
                        }
                    })
                } else {
                    this.$refs.multipleTable.clearSelection()
                }
            },
            handleSelectionChange(val) {
                // console.log(val)
                this.backQuestionList = [...val];
            },
            success () {
                this.$emit('success', this.backQuestionList)
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
</style>
