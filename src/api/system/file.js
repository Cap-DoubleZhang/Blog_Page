import request from '@/utils/request'

export function getSysFiles() {
    return request({
      url: `file/imgs`,
      method: 'get'
    })
}
