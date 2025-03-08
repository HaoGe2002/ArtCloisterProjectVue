import request from '@/utils/request';

export function getAddressList(userId) {
  return request({
    url: '/user/address/list',
    method: 'get',
    params: {
      userId
    }
  })
}

export function addAddress(data) {
  return request({
    url: '/user/address/add',
    method: 'post',
    data
  })
}

export function setDefault(addressId) {
    return request({
        url: `/user/address/setDefault/${addressId}`,
        method: 'post'
    });
}

export function deleteUserAddress(addressId){
    return request({
        url: `/user/address/delete/${addressId}`,
        method: 'delete'
    });
}

export function updateAddress(addressData) {
  return request({
      url: `/user/address/update`,
      method: 'put',
      data: addressData
  });
}
