import request from '@/utils/request'

export function saveArtwork(artFrom){
    return request({
        url: '/saveArtwork',
        method: 'post',
        headers: { isToken: true },
        data: artFrom
    });
}

export function selectSaveArtwork(artworkId){
    return request({
        url: '/selectSaveArtwork',
        method: 'get',
        params: {artworkId}
    });
}

export function setArtworkStatus(artworkId,status){
    return request({
        url: '/updateArtworkStatus',
        method: 'post',
        params: {artworkId,status}
    }); 
}

export function deleteArtwork(artworkId){
    return request({
        url: '/deleteArtwork',
        method: 'post',
        params: {artworkId}
    }); 
}

export function getArtworkList(params){
    return request({
        url: '/getArtworkList',
        method: 'get',
        params: params
    });
}

export function getArtworkDetail(artworkId){
    return request({
        url: '/getArtworkDetail',
        method: 'get',
        params: {artworkId}
    });
}

export function updateArtworkStatus(artworkId,status)
{
    return request({
        url: '/updateArtworkStatus',
        method: 'post',
        data: {artworkId,status}
    });
}