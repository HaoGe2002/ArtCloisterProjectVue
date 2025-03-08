import request from '@/utils/request'

// 获取大分类
export function getCategories() {
    return request({
        url: '/getCategories',
        headers: {
            isToken: false
        },
        method: 'post'
    })
}


// 获取小分类
export function getSubCategories() {
    return request({
        url: '/getSubCategories',
        headers: {
            isToken: false
        },
        method: 'get',
    })
}

export function getSubCategoriesList(pageParam,data){
    return request({
        url: '/getSubCategoriesList',
        method: 'get',
        params:{...pageParam,...data},
        headers: {
            isToken: true
        },
    });
}
/**
 * 新增子类别
 */
export function addSubcategory(data) {
    return request({
        url: '/subcategoriesAdd',
        method: 'post',
        data: data
    })
}

/**
 * 删除子类别
 */
export function deleteSubcategories(ids) {
    return request({
        url: '/subcategoriesDelete',
        method: 'delete',
        params:{
            ids:ids.join(",")
        }
    })
}

/**
 * 修改子类别
 */
export function updateSubcategory(data) {
    return request({
        url: '/subcategoriesUpdate',
        method: 'put',
        data: data
    })
}