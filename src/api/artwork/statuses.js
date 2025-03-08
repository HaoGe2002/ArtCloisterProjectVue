import request from '@/utils/request'

export function getAllStatuses () {
    return request({
        url: '/artworkStatuses/getAll',
        method: 'get'
    })
}