import request from '@/utils/request'
export function addCartItem (artworkId,frameTypeId){
    return request({
        url:'/cart/add',
        method:'post',
        params:{
            artworkId:artworkId,
            frameTypeId:frameTypeId
        }
    })

}

export function getCartItems(){
    return request({
        url:'/cart/items',
        method:'get'
    })
}

export function removeCartItems(ids){
    return request({
        url:'/cart/clear',
        method:'delete',
        params:{
            ids:ids.join(",")
        }
    })
}