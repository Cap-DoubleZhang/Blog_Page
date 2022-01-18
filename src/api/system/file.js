import request from '@/utils/request'

export function getWaterfallImages(query) {
    return request({
      url: `waterfallImage/images`,
      method: 'get',
      params: query
    })
}

export function getFiles(query) {
  return request({
    url: `file/files`,
    method: 'get',
    params: query
  })
}

