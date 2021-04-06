<template>
    <div class="upload-file">
        <div>
            <el-form>
                <el-form-item>
                    <!--<el-upload
                        class="avatar-uploader"
                        action="http://172.22.162.111:8080/teacher/questionBank/importQuestionBank"
                        :show-file-list="false"
                        :on-success="successUploadFile"
                        :before-upload="beforeUploadFile"
                        :http-request="httpRequestFile">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>-->
                    <el-progress
                            type="circle"
                            :percentage="precentage"
                            :width="178"
                            v-if="isUpload"
                            :status="precentage === 100 ? 'success' : undefined"
                    ></el-progress>
                    <el-upload
                        drag
                        v-else
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="successUploadFile"
                        :http-request="httpRequestFile"
                        :before-upload="beforeUploadFile">
                        <div v-if="isUpload" >
                            <h1 v-if="isUploadSuccess" style="color: #288f5d;text-align: center;font-size: 30px;width: 100%;" class="avatar">上传成功！！</h1>
                            <h1 v-else style="color: #ED4646;text-align: center;font-size: 30px;width: 100%;" class="avatar">上传失败</h1>
                        </div>
<!--                        <img v-if="isUpload" src="http://pic9.nipic.com/20100819/2649661_225611012956_2.jpg" class="avatar">-->
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="$emit('cancel')">返回</el-button>
        </div>
    </div>
</template>

<script>
    import {teacherQuestionBankImportQuestionBank} from "../../../services/teacher";

    export default {
        name: 'UploadFile',
        data () {
            return {
                fileUrl: '',
                isUpload: false,
                isUploadSuccess: false,
                precentage: 0
            }
        },
        created() {
        },
        methods: {
            successUploadFile (res,file) {
                console.log(res)
                console.log(file)
            },
            // 上传文件前检验文件类型、大小
            beforeUploadFile (file) {
                console.log(file)
            },
            async httpRequestFile (option) {
                const fd = new FormData()
                console.log(option)
                this.isUploadSuccess = true
                // fd.append('questionBankName',option.file)
                fd.append('file',option.file)
                const { data } = await teacherQuestionBankImportQuestionBank(fd)
                if (data.code === '200') {
                    // console.log(data)
                    if (data.data.errorRow || data.data.errorQuestionBank) {
                        this.$alert(`导入失败：${data.data.errorRow?data.data.errorRow:''} ${(data.data.errorRow&&data.data.errorQuestionBank)||(data.data.errorRow&&data.data.error)?'、':''} ${data.data.errorQuestionBank?data.data.errorQuestionBank:''} ${data.data.errorQuestionBank&&data.data.error?'、':''} ${data.data.error}`,`上传错误`)
                    } else {
                        this.$message.success('上传成功！！！')
                        this.isUploadSuccess = true
                        this.$emit('success')
                    }
                    this.precentage = 0
                } else {
                    this.$message.error('无权操作！！')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
