import request from "../utils/request";
// import da from "element-ui/src/locale/lang/da";
import qs from 'qs'

/**
 * 获取菜单请求
 * @returns 响应：
 */
export const getMenuName = () => {
    return request({
        method: 'GET',
        url: '/common/getUserHasMenu'
    })
}

/**
 * 菜单管理-获取菜单请求
 * @returns 响应：
 */
export const systemMenu = () => {
    return request({
        method: 'GET',
        url: '/system/menu/list'
    })
}

/**
 * 菜单管理-添加菜单请求
 * @Author guo
 * @Date 2021/3/24 19:46
 * @param form 请求参数：menuName, menuUrl, type, parentId
 * @returns
 **/
export const systemMenuAdd = (form) => {
    return request({
        method: 'POST',
        url: '/system/menu/add',
        data: JSON.stringify(form)
    })
}

/**
 * 菜单管理-编辑菜单请求
 * @param data
 */
export const systemMenuEdit = (form) => {
    return request({
        method: 'POST',
        url: '/system/menu/edit',
        data: JSON.stringify(form)
    })
}

/**
 * 菜单管理-启用菜单请求
 * @param form id
 */
export const systemMenuEnable = (form) => {
    return request({
        method: 'POST',
        url: '/system/menu/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}

/**
 * 菜单管理-禁用菜单请求（未实现）
 * @param form id
 */
export const systemMenuDisable = (form) => {
    return request({
        method: 'POST',
        url: '/system/menu/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}

/**
 * 角色管理-获取角色请求
 * @returns {AxiosPromise}
 */
export const systemRole = () => {
    return request({
        method: 'GET',
        url: '/system/role/list'
    })
}

/**
 * 角色管理-添加角色请求
 * @param form 请求：roleName
 * @returns {AxiosPromise}
 */
export const systemRoleAdd = (form) => {
    return request({
        method: 'POST',
        url: '/system/role/add',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 角色管理-编辑角色请求
 * @param form 请求：id, roleName
 * @returns {AxiosPromise}
 */
export const systemRoleEdit = (form) => {
    return request({
        method: 'POST',
        url: '/system/role/edit',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 角色管理-启用角色请求
 * @param form 请求：id
 * @returns {AxiosPromise}
 */
export const systemRoleEnable = (form) => {
    return request({
        method: 'POST',
        url: '/system/role/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}

/**
 * 角色管理-禁用角色请求
 * @param form 请求：id
 * @returns {AxiosPromise}
 */
export const systemRoleDisable = (form) => {
    return request({
        method: 'POST',
        url: '/system/role/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}

/**
 * 角色管理-访问权限请求
 * @param form 请求：id
 * @returns {AxiosPromise}
 */
export const systemRoleGetRolePermission = (form) => {
    return request({
        method: 'POST',
        url: '/system/role/getRolePermission',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: qs.stringify(form)
    })
}

/**
 * 角色管理-权限分配请求
 * @param form 请求：id, ids
 * @returns {AxiosPromise}
 */
export const systemRoleAssignPermissions = (form) => {
    console.log(form)
    return request({
        method: 'POST',
        url: '/system/role/assignPermissions',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 用户管理-查看所有用户
 * @returns {AxiosPromise}
 */
export const systemUser = () => {
    return request({
        method: 'GET',
        url: '/system/user/list'
    })
}

/**
 * 用户管理-添加用户
 */
export const systemUserAddUser = (form) => {
    return request({
        method: 'POST',
        url: '/system/user/addUser',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        },
        data: qs.stringify(form)
    })
}

/**
 * 用户管理-编辑用户
 */
export const systemUserEditUser = (form) => {
    return request({
        method: 'POST',
        url: '/system/user/edit',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        // },
        data: JSON.stringify(form)
    })
}

/**
 * 用户管理-授予角色
 * @param form 请求： id, rid
 * @returns {AxiosPromise}
 */
export const systemUserAssignRoles = (form) => {
    return request({
        method: 'POST',
        url: '/system/user/assignRoles',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        },
        data: qs.stringify(form)
    })
}

/**
 * 用户管理-访问用户扮演角色
 */
export const systemUserGetRole = (form) => {
    return request({
        method: 'POST',
        url: '/system/user/getRole',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 用户管理-启用用户
 */
export const systemUserEnable = (form) => {
    return request({
        method: 'POST',
        url: '/system/user/enable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 用户管理-禁用用户
 */
export const systemUserDisable = (form) => {
    return request({
        method: 'POST',
        url: '/system/user/disable',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
    })
}

/**
 * 用户管理-搜索名字（未实现）
 * @param form
 */
export const systemUserSearchUserByName = (form) => {
    console.log(form)
}
