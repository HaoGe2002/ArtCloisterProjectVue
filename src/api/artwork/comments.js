import request from '@/utils/request'

export function selectComments(params) {
    return request({
        url: '/selectComments',
        method: 'get',
        params: params
    });
}

export function sendComment(data){
    return request({
        url: '/sendComment',
        method: 'post',
        data: data
    });
}

