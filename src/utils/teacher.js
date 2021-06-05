/**
 * Created by Xiaoxiaoxuan on 2021/3/28
 * 划分学院
 */
export const collegeMajorClass = (Array) => {
    if (Array) {
        let treeData = []
        let collegeMap = {}
        let majorMap = {}
        let id = 0
        Array.forEach(item => {
            if (majorMap[item.majorId]) {
                majorMap[item.majorId].children.push({
                    collegeId: item.collegeId,
                    majorId: item.majorId,
                    grade: item.grade || '',
                    classId: item.classId,
                    name: item.className
                })
            } else {
                majorMap[item.majorId] = {
                    classId: 't' + id++,
                    collegeId: item.collegeId,
                    collegeName: item.collegeName,
                    majorId: item.majorId,
                    name: item.majorName,
                    children: [{
                        collegeId: item.collegeId,
                        majorId: item.majorId,
                        grade: item.grade || '',
                        classId: item.classId,
                        name: item.className
                    }]
                }
            }
        })
        for (let item in majorMap) {
            if (collegeMap[majorMap[item].collegeId]) {
                collegeMap[majorMap[item].collegeId].children.push(majorMap[item])
            } else {
                collegeMap[majorMap[item].collegeId] = {
                    classId: 't' + id++,
                    collegeId: majorMap[item].collegeId,
                    name: majorMap[item].collegeName,
                    children: [majorMap[item]]
                }
            }
        }
        // console.log(collegeMap)
        for (const item in collegeMap) {
            treeData.push(collegeMap[item])
        }
        return treeData
    }
}

export const hideString = (str) => {
    if (str.length > 10) {
        return str.slice(0,10)+'...'
    } else {
        return str
    }
}
