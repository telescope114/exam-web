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
        url: '/teacher/class'
    })
}

/**
 * 学院管理-获取学院列表
 */
export const teacherCollege = () => {
    return request({
        method: 'GET',
        url: '/teacher/college'
    })
}

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


export const teacherTeacher = () => {
    return request({
        method: 'GET',
        url: '/teacher/teacher'
    })
}

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

export const teacherTeacherAssignClass = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/teacher/assignClass',
        data: JSON.stringify(form)
    })
}

export const teacherStudent = () => {
    return request({
        method: 'GET',
        url: '/teacher/student'
    })
}

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

export const teacherStudentAddStudent = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/student/addStudent',
        data: JSON.stringify(form)
    })
}

export const teacherQuestionBank = () => {
    return request({
        method: 'GET',
        url: '/teacher/questionBank'
    })
}

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

export const teacherExamQuestion = () => {
    return request({
        method: 'GET',
        url: '/teacher/examQuestion'
    })
}

export const teacherExamQuestionGetAllQuestionBank = () => {
    return request({
        method: 'GET',
        url: '/teacher/examQuestion/getAllQuestionBank'
    })
}

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

export const teacherExam = () => {
    return request({
        method: 'GET',
        url: '/teacher/exam'
    })
}

export const teacherExamGetClass = () => {
    return request({
        method: 'GET',
        url: '/teacher/exam/addExam/getClass'
    })
}

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

export const teacherExamAddExamSubmit = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/exam/addExam/submit',
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
        url: '/teacher/score'
    })
}

/**
 * 成绩管理-查看所有学生成绩
 * @Author 郭瑞峰
 * @Date 2021/4/1 11:48
 * @param data
 * @returns
 **/
export const teacherScoreGetStudentScore = (form) => {
    return request({
        method: 'POST',
        url: '/teacher/score/getClassScore',headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}
