import request from '@/utils/request'

//判断是不是管理员
export function isAdmin() {
  return request({
    url: '/admin/isAdmin',
    method: 'get'
  })
}
