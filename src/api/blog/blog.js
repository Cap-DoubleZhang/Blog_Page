import request from '@/utils/request'

// 获取博客列表
export function getBlogs(query) {
    return request({
        url: 'blog/blogs',
        method: 'get',
        params: query
    })
}

// 新增/编辑博客信息
export function saveBlog(data) {
    return request({
        url: 'blog/blog',
        method: 'post',
        data
    })
}

// 删除博客
export function deleteBlog(data) {
    return request({
        url: 'blog/blog',
        method: 'delete',
        data
    })
}

// 更改博客发布类型
export function updateBlogPublishType(data) {
    return request({
        url: 'blog/blogPublishType',
        method: 'put',
        data
    })
}

// 获取博客详情
export function getBlogDetail(query) {
    return request({
        url: 'blog/detail/' + query,
        method: 'get'
    })
}

// 获取博客评论列表
export function getBlogComments(query) {
    return request({
        url: 'comment/blogComments',
        method: 'get',
        params: query
    })
}
