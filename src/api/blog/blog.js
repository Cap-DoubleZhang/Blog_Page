import request from '@/utils/request'

// 获取字典列表
export function getBlogs(query) {
    return request({
        url: 'blog/blogs',
        method: 'get',
        params: query
    })
}

// 新增/编辑字典信息
export function saveBlog(data) {
    return request({
        url: 'blog/blog',
        method: 'post',
        data
    })
}

// 删除字典
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
