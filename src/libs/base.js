import { hashHistory } from 'react-router'
import config, { isDev, getUrlParams } from '@/config'
import fetch from 'isomorphic-fetch'
import {
  toast as ddToast,
  alert as ddAlert,
  confirm as ddConfirm
} from './ddApi'

export const toast = (text = '', icon = '') => {
  if (isDev) {
    window.alert(text)
  } else {
    ddToast(icon, text)
  }
}

export const alert = (message = '', title = '', buttonName = '确定') => {
  if (isDev) {
    window.alert(message)
  } else {
    ddAlert(message, title, buttonName)
  }
}

export const confirm = (message = '', title = '', callback, buttonLabels) => {
  if (isDev) {
    const r = window.confirm('message')
    if (r) {
      callback && callback()
    } else {
      toast('取消')
    }
  } else {
    ddConfirm(message = '', title = '', callback, buttonLabels)
  }
}

export const get = (url, params = {}) => {
  const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  })
  let queryUrl = url
  if (queryUrl.indexOf('?') < 0) {
    queryUrl += '?'
  }
  for (let str in params) {
    queryUrl += `${str}=${params[str]}&`
  }
  return fetch(queryUrl, {
    method: 'GET',
    credentials: 'same-origin',
    headers: headers
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    } else {
      return response
    }
  })
}

export const post = (url, params = {}) => {
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  })
  let query = ''
  for (let str in params) {
    if (params[str] instanceof Array) {
      params[str].forEach((v, i) => {
        if (typeof v === 'number' ||
          typeof v === 'boolean' ||
          typeof v === 'string') {
          query += `${str}[${i}]=${v}&`
        } else {
          for (let child in v) {
            query += `${str}[${i}].${child}=${v[child]}&`
          }
        }
      })
    } else {
      query += `${str}=${params[str]}&`
    }
  }
  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: query
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    } else {
      return response
    }
  })
}

export const asyncFetch = (action, params = {}, cb) => {
  if (!cb) {
    cb = (data, dispatch, getState) => {
      let msg = data.msg || '操作成功'
      return dispatch({
        type: 'FETCH_FIN',
        msg
      })
    }
  }
  return (dispatch, getState) => {
    fetchData(action, params)
    .then((data) => {
      if (!data.result) {
        return cb(data, dispatch, getState)
      } else {
        toast(data.msg)
        return dispatch({
          type: 'FETCH_FAIL',
          err: data.msg || '系统忙，请稍后再试'
        })
      }
    })
    .catch((e) => {
      return dispatch({
        type: 'FETCH_FAIL',
        err: e
      })
    })
  }
}

export const fetchData = (action, params = {}) => {
  let [method, url] = action.split(' ')
  if (url.indexOf('/') === 0) {
    url = url.substr(1)
  }

  for (let v in params) {
    if (params[v] === null) {
      delete params[v]
    }
  }
  if (method.toLowerCase() === 'get') {
    return get(url, params)
  } else {
    return post(url, params)
  }
}

export const getTestAccount = () => {
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  })
  return fetch('/api/setUser.jsp', {
    method: 'GET',
    credentials: 'same-origin',
    headers: headers
  })
}

const corpid = getUrlParams('corpid') || 'dinge66a5fd3ad45cc2a35c2f4657eb6378f'
Object.assign(config, {
  host: config.modelType !== 1
    ? `http://120.77.209.222/wagestest/?corpid=${corpid}`
    : `http://wages.hz.taeapp.com/?corpid=${corpid}`,
  corpid
})

export const goLocation = (location = { pathname: '/' }) =>
  hashHistory.push(location)

export const getDate = (nDate = (new Date()), fmt = 'yyyy-MM-dd hh:mm:ss') => {
  const sDate = new Date(nDate)
  const dateObj = {
    'M+': sDate.getMonth() + 1,
    'd+': sDate.getDate(),
    'h+': sDate.getHours(),
    'm+': sDate.getMinutes(),
    's+': sDate.getSeconds(),
    'q+': Math.floor((sDate.getMonth() + 3) / 3),
    'S': sDate.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (sDate.getFullYear() + '')
      .substr(4 - RegExp.$1.length))
  }
  for (const s in dateObj) {
    if (new RegExp('(' + s + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (dateObj[s])
        : (('00' + dateObj[s]).substr(('' + dateObj[s]).length)))
    }
  }
  return fmt
}

export const getCash = (cash = 0, symbol = '') => {
  if (isNaN(cash)) {
    return '--'
  }
  cash = Math.floor(cash * 100) / 100
  let result = '' + cash
  let dot = result.indexOf('.')
  if (dot < 0) {
    dot = result.length
    result += '.'
  }
  while (result.length <= dot + 2) {
    result += '0'
  }
  return symbol + result
}

export const getNumber = (number = 0, dot = 2, min, max) => {
  if (isNaN(number) || isNaN(dot)) {
    return ''
  }
  if (max !== '' && max !== undefined && number > max) {
    number = max
  }
  if (min !== '' && min !== undefined && number < min) {
    number = min
  }
  dot = Math.floor(dot)
  const str = '' + number
  let [integer, decimal] = str.split('.')
  integer = isNaN(integer) ? 0 : +integer
  decimal = decimal ? decimal.substr(0, dot) : ''
  while (decimal.length < dot) {
    decimal += '0'
  }
  return `${integer}.${decimal}`
}

export const removeYear = (time) => {
  time = time.split('-')
  time.shift()
  time = time.join('-')
  return time
}

export const highLightDate = (str) => {
  let strReg = /^[a-zA-Z]{2}[0-9]{8}/
  let dateReg = /[0-9]{8}$/
  let fStr = strReg.exec(str)[0]
  let dateStr = dateReg.exec(fStr)[0]
  let dateArr = str.split(dateStr)
  return (
    <span>{dateArr[0]}{
      <span className='wm-color-important'>{dateStr}</span>
    }{dateArr[1]}</span>
  )
}

export const getChosenSource = (list = [], keyLabel = 'name') => {
  let source = []
  list.forEach((v, i) => {
    source.push({
      key: v[keyLabel],
      value: i
    })
  })
  return source
}

export const getArray = (obj) => {
  let result = []
  for (const i in obj) {
    result[i] = obj[i]
  }
  return result
}

export const getObjArray = (obj, idLabel = 'id', valueLabel = 'value') => {
  let result = []
  for (const i in obj) {
    let temp = {}
    temp[idLabel] = i
    temp[valueLabel] = obj[i]
    result.push(temp)
  }
  return result
}

export const doFetch = (action, params = {}) => {
  return fetchData(action, params)
    .then((data) => {
      if (data.result) {
        toast(data.msg || '系统忙，请稍后再试')
      }
      return data
    })
    .catch((e) => {
      toast('请求失败，请检查网络并稍后再试')
    })
}

export const blurInput = () => {
  const isIPHONE = navigator.userAgent.toUpperCase().indexOf('IPHONE') !== -1
  if (isIPHONE) {
    const obj = document.querySelectorAll('.need-blur input, .need-blur textarea')
    for (let i = 0; i < obj.length; i++) {
      obj[i].blur()
    }
  }
}


export default {
  fetchData,
  goLocation,
  getDate,
  getCash,
  alert,
  toast,
  confirm,
  doFetch,
  blurInput
}
