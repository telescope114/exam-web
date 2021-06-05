/**
 * 封装菜单
 * Created by Xiaoxiaoxuan on 2021/3/24
 * @param data: 菜单
 */
export const getMenuList = (menus) => {
    if (menus) {
        var treeData = []
        var map = {}
        menus.forEach(function (item) {
            map[item.id] = item
        })
        menus.forEach(function (item) {
            var parent = map[item.parentId]
            if (parent) {
                (parent.children || (parent.children = [])).push(item)
            } else {
                treeData.push(item)
            }
        })
        return treeData
    } else {
        return []
    }
}

export const getMenuTree = (menus) => {
    if (menus) {
        var treeData = [];
        var map = {};
        menus.forEach(function (item) {
            map[item.id] = item;
        })
        menus.forEach(function (item) {
            var parent = map[item.parentId];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                treeData.push(item);
            }
        })
        return treeData;
    } else {
        return []
    }
}
