import request from '@/utils/request'

export function getWaterfallImages(query) {
    return request({
      url: `waterfallImage/images`,
      method: 'get',
      params: query
    })
}
