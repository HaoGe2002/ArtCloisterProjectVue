import request from '@/utils/request';

/**
 * 关注用户
 */
export function followUser(followedId) {
    return request({
        url: '/user/follow/follow',
        method: 'post',
        headers: {
            isToken: true
        },
        params: {followedId }
    });
}

/**
 * 取消关注
 */
export function unfollowUser(followedId) {
    return request({
        url: '/user/follow/unfollow',
        method: 'post',
        headers: {
            isToken: true
        },
        params: {  followedId }
    });
}

/**
 * 查询是否已关注
 */
export function isFollowingState(followedId) {
    return request({
        url: '/user/follow/isFollowing',
        method: 'get',
        params: {  followedId }
    });
}

/**
 * 查询关注数量
 */
export function getFollowingCount(userId) {
    return request({
        url: '/user/follow/following/count',
        method: 'get',
        params: { userId }
    });
}

/**
 * 查询粉丝数量
 */
export function getFollowersCount(userId) {
    return request({
        url: '/user/follow/followers/count',
        method: 'get',
        params: { userId }
    });
}
