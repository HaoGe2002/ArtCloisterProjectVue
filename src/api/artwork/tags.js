import request from '@/utils/request'
export function getArtworkTags(pageNum = 1, pageSize = 5, keyword = '') {
    return request({
        url: '/getArtworkTags',
        method: 'get',
        headers: { isToken: true },
        params: { pageNum, pageSize, keyword } // ✅ 传递搜索关键词
    });
}



export function artworkInsertArtworkTags(data) {
    return request({
        url: '/artworkInsertArtworkTags',
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
} 

export function insertArtworkTags(data) {
    return request({
        url: '/insertArtworkTags',
        headers: {
            isToken: true
        },
        method: 'post',
        data: data
    })
}