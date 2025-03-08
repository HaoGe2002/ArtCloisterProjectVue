import request from '@/utils/request'

//修改用户信息
export function addUser( data ) {
  return request({
    url: '/user/profile/add',
    method: 'post',
    data:data
  })
}

//新增用户

export function updateUserDetail( data) {
    return request({
      url: '/user/profile/updateUser',
      method: 'put',
      data:data
    })
  }