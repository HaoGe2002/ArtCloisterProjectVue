import request from '@/utils/request'

export function userCreatOrder (cartItemIds, associationId) {
    return request({
        url: '/orderDetails/userCreatOrder',
        method: 'post',
        data: {
            cartItemIds,
            associationId
        },
        headers: {
            isToken: true
        },
    })
}
export function selectOrderDetailsList (pageParam,data){
    return request({
        url: '/orderDetails/selectOrderDetailsList',
        method: 'get',
        params: { ...pageParam,...data},
        headers: {
            isToken: true
        },
    })
}

export function confirmReceipt(orderId){
    return request({
        url: '/orderDetails/confirmReceipt',
        method: 'post',
        params: {
            orderId
        },
        headers: {
            isToken: true
        },
    })
}

export function updateOrder (data) {
    return request({
        url: '/orderDetails/updateOrder',
        method: 'put',
        data,
        headers: {
            isToken: true
        },
    })
}

export function confirmPaymentOrder(orderIds) {
    return request({
        url: '/orderDetails/confirmPayment',
        method: 'post',
        params: {
            orderIds: orderIds.join(',') // 变成 "28,29,30"
        },
        headers: {
            isToken: true
        },
    })
}



export function deleteOrderDetail(orderIds) {
    return request({
        url: '/orderDetails/deleteOrderDetail',
        method: 'delete',
        params: { orderIds: orderIds.join(",") },  // ✅ 传递字符串 "40,41,42"
        headers: {
            isToken: true
        }
    })
}

// 官方收货
export function officialReceiveOrder(orderId){
    return request({
        url: '/orderDetails/officialReceiveOrder',
        method: 'post',
        params:{
            orderId
        },
        headers: {
            isToken: true
        },
    })
}
//官方已经裱框完毕
export function officialFramedOrder(orderId){
    return request({
        url: '/orderDetails/officialFramedOrder',
        method: 'post',
        params:{
            orderId
        },
        headers: {
            isToken: true
        },
    })
}

//官方发货
export function officialShipped(orderId,trackingNumber){
    return request({
        url: '/orderDetails/officialShipped',
        method: 'post',
        params:{
            orderId,
            trackingNumber
        },
        headers: {
            isToken: true
        },
    })
}

//卖家发货
export function Shipping (orderId,trackingNumber){
    return request({
        url: '/orderDetails/Shipping',
        method: 'post',
        params:{
            orderId,
            trackingNumber
        },
        headers: {
            isToken: true
        },
    })
}

export function selectSellerOrderList(){
    return request({
        url: '/orderDetails/selectSellerOrderList',
        method: 'get',
        headers: {
            isToken: true
        },
    })
}