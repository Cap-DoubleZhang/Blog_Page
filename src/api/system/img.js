import request from '@/utils/request'

export function saveImage(data) {
  return request({
    url: `https://images.doublezh.com/api/file/file`,
    method: 'post',
    data
  })
}
