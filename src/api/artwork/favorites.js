import request from '@/utils/request'

export function isFavorite(params) {
    return request({
        url: '/userArtworkFavorites/isFavorite',
        method: 'get',
        params: params
    });
}

export function addFavorite(artworkId){
    let params = {
        artworkId: artworkId
    }
    return request({
        url: '/userArtworkFavorites/addFavorite',
        method: 'post',
        params: params
    });
}

export function cancelFavorite(artworkId){
    let params = {
        artworkId: artworkId
    }
    return request({
        url: '/userArtworkFavorites/cancelFavorite',
        method: 'post',
        params: params
    });
}
