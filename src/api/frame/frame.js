import request from '@/utils/request'

export function selectAllFrames (pageParam,data) {
  return request({
    url: '/frame/selectAllFrames',
    method: 'get',
    params: { ...pageParam,...data}
  })
}

export function addFrameToArtwork (artworkUrl,frameUrl){
    return request({
        url: '/frame/addFrameToArtwork',
        method: 'post',
        params:{
            artworkUrl:artworkUrl,
            frameUrl:frameUrl
        }
    })
}

export function deleteFrames (data){
    return request({
        url: '/frame/deleteFrames',
        method: 'post',
        data:data
    })
}

export function updateFrame (data){
    return request({
        url: '/frame/updateFrame',
        method: 'put',
        data:data
    })
}

export function addFrame (data){
    return request({
        url: '/frame/addFrame',
        method: 'post',
        data:data
    })
}