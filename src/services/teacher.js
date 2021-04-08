/**
 * Created by Xiaoxiaoxuan on 2021/3/27
 */
import request from "@/utils/request";
import qs from 'qs'

/**
 * 班级管理-获取班级列表
 */
export const teacherClass = () => {
    return request({
        method: 'GET',
        url: '/teacher/class/list'
    })
}

/**
 * 学院管理-获取学院列表
 */
export const teacherCollege = () => {
    return request({
        method: 'GET',
        url: '/teacher/college/list'
    })
}

/**
 * 获取专业列表
 */
export const teacherGetMajor = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/getMajorName',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 添加学院
 * @param form
 */
export const teacherCollegeAddCollege = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/addCollege',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 编辑学院
 * @param form
 */
export const teacherCollegeEditCollege = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/editCollege',
        data: JSON.stringify(form)
    })
}

/**
 * 删除学院
 * @param form
 */
export const teacherCollegeDelCollege = (form) => {
    return request({
        method: 'DELETE',
        url: '/teacher/college/delCollege',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 添加专业
 */
export const teacherCollegeAddMajor = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/addMajor',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 编辑专业
 */
export const teacherCollegeEditMajor = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/editMajor',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 删除专业
 */
export const teacherCollegedelMajor = (form) => {
    return request({
        method: 'DELETE',
        url: '/teacher/college/delMajor',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 按专业添加班级
 */
export const teacherCollegeAddClass = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/addClass',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 获取班级列表
 */
export const teacherCollegeGetClassName = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/college/getClassName',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 删除班级
 */
export const teacherCollegedelClass = (form) => {
    return request({
        method: 'DELETE',
        url: '/teacher/college/delClass',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 教师管理-获取教师列表
 */
export const teacherTeacher = () => {
    return request({
        method: 'GET',
        url: '/teacher/teacher/list'
    })
}

/**
 * 查询教师
 */
export const teacherTeacherSearchTeacher = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/searchTeacher',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 添加教师
 */
export const teacherTeacherAddTeacher = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/addTeacher',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 编辑教师
 */
export const teacherTeacherEditTeacher = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/editTeacher',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 重置教师密码
 */
export const teacherTeacherResetPassword = (form) => {
    return request({
        method: 'POST',
        url: '/common/resetPassword',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 启用教师
 */
export const teacherTeacherEnable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 禁用教师
 */
export const teacherTeacherDisable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 获取所有学院、班级
 */
export const teacherTeacherGetClassName = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/getClassName',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 获取教师拥有的班级
 */
export const teacherTeacherGetAllClassByTeacherId = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/getAllClassByTeacherId',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 给教师分配班级
 */
export const teacherTeacherAssignClass = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/assignClass',
        data: JSON.stringify(form)
    })
}

/**
 * 学生管理-获取学院
 */
export const teacherStudent = () => {
    return request({
        method: 'GET',
        url: '/teacher/student/list'
    })
}

/**
 * 获取学生列表
 */
export const teacherStudentGetStudentList = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/getStudentList',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 启用学生
 */
export const teacherStudentEnable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 禁用学生
 */
export const teacherStudentDisable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 搜索学生
 */
export const teacherStudentSearchStudentName = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/searchStudentName',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 重置学生密码
 */
export const teacherStudentResetPassword = (form) => {
    return request({
        method: 'POST',
        url: '/common/resetPassword',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 添加学生
 */
export const teacherStudentAddStudent = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/addStudent',
        data: JSON.stringify(form)
    })
}

/**
 * 编辑学生
 */
export const teacherStudentEditStudent = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/editStudent',
        data: JSON.stringify(form)
    })
}

/**
 * 题库管理-获取题库列表
 */
export const teacherQuestionBank = () => {
    return request({
        method: 'GET',
        url: '/teacher/questionBank/list'
    })
}

/**
 * 添加题库
 */
export const teacherQuestionBankAddQuestionBank = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/questionBank/addQuestionBank',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 启用题库
 */
export const teacherQuestionBankEnable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/questionBank/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 禁用题库
 */
export const teacherQuestionBankDisable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/questionBank/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 编辑题库
 */
export const teacherQuestionBankImportQuestionBank = (data) => {
    return request({
        method: 'POST',
        url: '/teacher/questionBank/importQuestionBank',
        headers: {
            'Content-Type':' multipart/form-data; boundary=----WebKitFormBoundaryAlmClKFW3cmPvi5Y'
        },
        data
    })
}

/**
 * 编辑题库
 */
export const teacherQuestionBankEditQuestionBank = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/questionBank/editQuestionBank',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 搜索题库名称
 */
export const teacherQuestionBankSearchQuestionBankName = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/questionBank/searchQuestionBank',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 获取模板文件
 */
export const teacherQuestionBankTemplateDownload = (fileName) => {
    return request({
        method: 'POST',
        url: '/common/download',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({fileName: fileName}),
        responseType: 'blob'
    })
}

/**
 * 试题管理-获取试题
 */
export const teacherExamQuestion = () => {
    return request({
        method: 'GET',
        url: '/teacher/examQuestion/list'
    })
}

/**
 * 获取题库名称
 */
export const teacherExamQuestionGetAllQuestionBank = () => {
    return request({
        method: 'GET',
        url: '/teacher/examQuestion/getAllQuestionBank'
    })
}

/**
 * 添加试题
 */
export const teacherExamQuestionAddExamQuestion = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/examQuestion/addExamQuestion',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 启用试题
 */
export const teacherExamQuestionEnable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/examQuestion/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 禁用试题
 */
export const teacherExamQuestionDisable = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/examQuestion/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 编辑试题
 */
export const teacherExamQuestionEditExamQuestion = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/examQuestion/editExamQuestion',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 获取选择题的选项
 */
export const teacherExamQuestionGetExamQuestionOption = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/examQuestion/getExamQuestionOption',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}


/**
 * 获取题库名称
 */
export const teacherExamAddExamAdd = () => {
    return request({
        method: 'GET',
        url: '/teacher/exam/addExam/add'
    })
}


/**
 * 获取选择题的选项
 */
export const teacherExamQuestionSearchTitle = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/examQuestion/searchTitle',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}


/**
 * 考试管理-获取所有考试列表
 */
export const teacherExam = () => {
    return request({
        method: 'GET',
        url: '/teacher/exam/list'
    })
}

/**
 * 获取教师管理的班级
 */
export const teacherExamGetClass = () => {
    return request({
        method: 'GET',
        url: '/teacher/exam/addExam/getClass'
    })
}

/**
 *
 * @param form
 */
export const teacherExamDetails = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/exam/details',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 添加考试
 */
export const teacherExamAddExamSubmit = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/exam/addExam/submit',
        data: JSON.stringify(form)
    })
}

/**
 * 获取考试详情
 */
export const teacherExamEditExamGetExamInfo = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/exam/editExam/getExamInfo',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 搜索考试
 */
export const teacherExamSearchExam = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/exam/searchExam',
        data: JSON.stringify(form)
    })
}

/**
 * 编辑考试
 */
export const teacherExamEditExamSubmit = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/exam/editExam/submit',
        data: JSON.stringify(form)
    })
}

/**
 * 成绩管理-成绩查询
 * @Author 郭瑞峰
 * @Date 2021/4/1 11:48
 * @param data
 * @returns
 **/
export const teacherScore = () => {
    return request({
        method: 'GET',
        url: '/teacher/score/list'
    })
}

/**
 * 成绩管理-查看学生成绩
 * @Author 郭瑞峰
 * @Date 2021/4/1 11:48
 * @param data
 * @returns
 **/
export const teacherScoreGetStudentScore = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/score/getClassScore',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 成绩管理-打印学生成绩
 * @Author 郭瑞峰
 * @Date 2021/4/1 11:48
 * @param data
 * @returns
 **/
export const teacherScorePrintClassScore = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/score/printClassScore',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 成绩管理-下载班级成绩
 * @param form
 * @returns {AxiosPromise}
 */
export const teacherScoreDownloadClassScore = (fileName) => {
// export const studentDownLoadScore = (form) => {
    /*return request({
        method: 'POST',
        url: '/download',
        data: qs.stringify(form)
    })*/
    return request({
        method: 'POST',
        url: '/common/download',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({fileName: fileName}),
        responseType: 'blob'
    })
}
