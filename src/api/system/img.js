import request from '@/utils/request'

export function saveImage(data) {
  return request({
    url: `waterfallImage/image`,
    method: 'post',
    data
  })
}
