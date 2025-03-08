import request from '@/utils/request'

export function getAllStatuses () {
    return request({
        url: '/notifications/getAllNotifications',
        method: 'get',
        headers: {
            isToken: true
        },
    })
}
export function markNotificationAsRead(notificationId){
    return request({
        url: '/notifications/markAsRead',
        method: 'post',
        headers: {
            isToken: true
        },
        params: {
            notificationId: notificationId
        }
    })
}