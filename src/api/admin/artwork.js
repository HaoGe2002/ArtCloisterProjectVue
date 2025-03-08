import request from '@/utils/request'

export function getArtworks (data,pageParam) {
    return request({
        url: '/list',
        method: 'get',
        params:{...pageParam,...data},
        headers: {
            isToken: true
        },
    });
}

export function deleteArtworks(ids) {
    return request({
        url: `/deleteArtworks`,
        method: 'delete',
        params: { ids: ids.join(",") },  // ✅ 传递字符串 "40,41,42"
        headers: { isToken: true }
    });
}

