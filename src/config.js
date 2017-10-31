export const getUrlParams = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return ''
}

export const dd =
  (process.env.NODE_ENV !== 'development' && window.parent)
  ? window.parent.dd
  : window.dd

export const modelType = getUrlParams('modelType')

export const prodApi =
  modelType !== 1
  ? 'http://120.77.209.222/wagestest/'
  : 'http://wages.hz.taeapp.com/'

export const devApi = '/api/'

export const ddurl =
  modelType !== 1
  ? 'http://120.77.209.222/wagestest/'
  : 'http://wages.hz.taeapp.com/'

export const isDev = process.env.NODE_ENV === 'development'

export const env = process.env.PROJ_ENV

export default {
  dd,
  modelType,
  prodApi,
  devApi,
  ddurl,
  isDev,
  env
}
