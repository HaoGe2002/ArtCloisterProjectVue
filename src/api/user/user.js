import request from '@/utils/request'

// 查询用户详详情
export function getUser(userId) {
    return request({
      url: '/user/profile/getUser/' + userId,
      method: 'get',
      headers: {
        isToken: false
      },
    })
  }
  

  export function removerUser(userIds) {
    return request({
      url: `/user/profile`,
      method: 'delete',
      data: userIds, // 发送 JSON 数组
      headers: {
        isToken: true,
      },
    });
  }
  

export function selectUserList(data,pageParam,params){
  return request({
    url: '/user/profile/selectUsersList',
    method: 'get',
    params:{...pageParam,...data},
    headers: {
      isToken: true
    },
  });
}



//修改本人信息
export function updateUser(data) {
    return request({
      url: '/user/profile/update',
      method: 'put',
      data:data
    })
  }

//本人修改密码
export function updateUserPassword(oldPassword,newPassword,confirmPassword) {
    const data = {
      oldPassword,
      newPassword,
      confirmPassword
    }
    return request({
      url: '/user/profile/updatePwd',
      method: 'put',
      data:data
    })
  }