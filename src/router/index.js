import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */'@/views/login')
  },
  {
    path: '/student',
    // name: 'ExamForStudent',
    component: () => import(/* webpackChunkName: "student" */'@/views/student'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'StudentInfo',
        component: () => import(/* webpackChunkName: "studentInfo" */'@/views/student/studentInfo')
      },
      {
        path: 'examList',
        name: 'ExamList',
        component: () => import(/* webpackChunkName: "examList" */'@/views/student/examList')
      },
      {
        path: 'getStudentScore',
        name: 'GetStudentScore',
        component: () => import(/* webpackChunkName: "getStudentScore" */'@/views/student/studentScore')
      },
      {
        path: 'score/:id/',
        name: 'StudentScore',
        component: () => import(/* webpackChunkNameL "getExamScore" */'@/views/student/getExamScore')
      },
      {
        path: '*',
        name: 'StudentErrorPage',
        component: () => import(/* webpackChunkName: "404" */'@/views/errorPage')
      }
    ]
  },
  {
    path: '',
    // name: 'Layout',
    component: () => import(/* webpackChunkName: "admin" */'@/views/layout'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import(/* webpackChunkName: "index" */'@/views/teacher/')
      },
      //  系统管理
      {
        path: 'system/menu',
        name: 'Menu',
        component: () => import(/* webpackChunkName: "menu" */'@/views/admin/menu'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'system/role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "role" */'@/views/admin/role'),
        meta: { title: '角色管理' }
      },
      {
        path: 'system/user',
        name: 'User',
        component: () => import(/* webpackChunkName: "user" */'@/views/admin/user'),
        meta: { title: '用户管理' }
      },
      // 系统管理结束
      // 教师管理
      {
        path: 'teacher/student/',
        name: 'Student',
        component: () => import(/* webpackChunkName: "student" */'@/views/teacher/student'),
        meta: { title: '学生管理' }
      },
      {
        path: 'teacher/teacher',
        name: 'Teacher',
        component: () => import(/* webpackChunkName: "teacher" */'@/views/teacher/teacher'),
        meta: { title: '教师管理' },
        // alias: '/'
      },
      {
        path: 'teacher/questionBank',
        name: 'QuestionBank',
        component: () => import(/* webpackChunkName: "questionBank" */'@/views/teacher/questionBank'),
        meta: { title: '题库管理' }
      },
      {
        path: 'teacher/examQuestion',
        name: 'ExamQuestion',
        component: () => import(/* webpackChunkName: "examQuestion" */'@/views/teacher/examQuestion'),
        meta: { title: '试题管理' }
      },
      {
        path: 'teacher/exam',
        name: 'exam',
        component: () => import(/* webpackChunkName: "exam" */'@/views/teacher/exam'),
        meta: { title: '考试管理' }
      },
      {
        path: 'teacher/class',
        name: 'Class',
        component: () => import(/* webpackChunkName: "class" */'@/views/teacher/class'),
        meta: { title: '班级管理' }
      },
      {
        path: 'teacher/college',
        name: 'College',
        component: () => import(/* webpackChunkName: "college" */'@/views/teacher/college'),
        meta: { title: '学院管理' }
      },
      {
        path: 'teacher/score',
        name: 'Score',
        component: () => import(/* webpackChunkName: "score" */'@/views/teacher/score'),
        meta: { title: '成绩管理' }
      },
      {
        path: 'teacher/examPaper',
        name: 'ExamPaper',
        component: () => import(/* webpackChunkName: "examPaper" */'@/views/teacher/examPaper'),
        meta: { title: '试卷管理' }
      },
      {
        path: 'teacher/examPaper/addExamPaper',
        name: 'AddExamPaper',
        component: () => import(/* webpackChunkName: "CreateOrEditExamPaper" */'@/views/teacher/component/CreateOrEditExamPaper'),
        meta: { title: '添加试卷' }
      },
      {
        path: 'teacher/examPaper/editExamPaper/:id',
        name: 'EditExamPaper',
        component: () => import(/* webpackChunkName: "CreateOrEditExamPaper" */'@/views/teacher/component/CreateOrEditExamPaper'),
        meta: { title: '编辑试卷' }
      },
      {
        path: '*',
        name: 'LayoutErrorPage',
        component: () => import(/* webpackChunkName: "404" */'@/views/errorPage')
      }
      // 教师管理结束
    ],
  },
  {
    path: '/examInfo/:eid',
    name: 'ExamInfo',
    component: () => import(/* webpackChunkName: "examInfo" */'@/views/exam')
  },
  {
    path: '*',
    name: 'ErrorPage',
    component: () => import(/* webpackChunkName: "404" */'@/views/errorPage')
  }
]

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫判定
// let oneRun = true
router.beforeEach((to,from,next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      if (parseInt(store.state.role) === 0) {
        if (to.fullPath === '/login' || to.fullPath === '/') {
          // console.log(102)
          next()
        } else if (store.state.menus.has(to.fullPath)) {
          next()
        } else {
          next({name: 'LayoutErrorPage'})
        }
      }else if (parseInt(store.state.role) === 1) {
        if (to.fullPath === '/login' || to.fullPath === '/') {
          next()
        } else if (to.fullPath.startsWith('/teacher/examPaper/addExamPaper') || to.fullPath.startsWith('/teacher/examPaper/editExamPaper')) {
          next()
        }else if (store.state.menus.has(to.fullPath)) {
          next()
        } else {
          console.log(123)
          next({name: 'LayoutErrorPage'})
        }
      } else if (parseInt(store.state.role) === 2) {
        if (to.fullPath.startsWith('/student')) {
          console.log(to)
          next()
        } else if (to.fullPath.startsWith('/examInfo')) {
          next()
        }else {
          next({name: 'StudentInfo'})
        }
      }
    }
  } else {
    next()
  }
})

export default router
