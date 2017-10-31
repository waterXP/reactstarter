import { dd, isDev } from '@/config'

export const alert = (message = '', title = '', buttonName = '确定') => {
  dd.device.notification.alert({
    message,
    title,
    buttonName
  })
}

export const toast = (text = '', icon = '') => {
  dd.device.notification.toast({
    icon,
    text
  })
}

export const confirm =
(message = '', title = '', callback, buttonLabels = ['确定', '取消']) => {
  dd.device.notification.confirm({
    message: message,
    title: title,
    buttonLabels: buttonLabels,
    onSuccess: function (result) {
      if (result.buttonIndex === 0) {
        callback && callback()
      }
    },
    onFail: function (err) { toast(err) }
  })
}

export const dingSend = (users = [], corpId = '', text = '') => {
  dd.biz.ding.post
  ? dd.biz.ding.post({
    users : users,
    corpId: corpId,
    type: 1,
    alertType: 2,
    text: text,
    onSuccess: () => {
    },
    onFail: () => {
    }
  })
  : dd.biz.ding.create({
    users: users,
    corpId: corpId,
    type: 1,
    alertType: 2,
    text: text,
    bizType: 0,
    onSuccess: () => {

    },
    onFail: () => {
    }
  })
}
export const dingApproveDetail = (url) => {
  dd.biz.util.openLink({
    url: url,
    onSuccess : function (result) {},
    onFail : function (err) { toast(err) }
  })
}

export const openDatePicker = (defaultValue = +new Date(), callback) => {
  if (isDev) {
    return +new Date()
  }
  dd.biz.util.datepicker({
    format: 'yyyy-MM-dd',
    value: getDate(defaultValue, 'yyyy-MM-dd'),
    onSuccess: function (result) {
      callback && callback(result.value)
    },
    onFail: function (err) {
      // when click cancel, the errorCode is 3
      if (err.errorCode !== 3) {
        toast(err)
      }
    }
  })
}

export const openChosen = (source, selectedKey = 0, callback) => {
  if (isDev) {
    return
  }
  dd.biz.util.chosen({
    source,
    selectedKey,
    onSuccess: function (result) {
      callback && callback(result)
    },
    onFail: function (err) {
      if (err.errorCode !== 3) {
        toast(err)
      }
    }
  })
}

export const uploadImage = (max, callback) => {
  if (isDev) {
    return
  }
  dd.biz.util.uploadImage({
    multiple: true,
    max: max,
    onSuccess : function (result) {
      callback(result)
    },
    onFail : function (err) {
      if (err.errorCode !== -1) {
        toast(err)
      }
    }
  })
}

export const previewImage = (img) => {
  if (isDev) {
    return
  }
  dd.biz.util.previewImage({
    urls: [img],
    current: img,
    onFail: function (err) { toast(err) }
  })
}

export const dingShowPreLoad = () => {
  if (!isDev) {
    dd.device.notification.showPreloader({
      text: '使劲加载中..',
      showIcon: true,
      onSuccess : function (result) {},
      onFail: function (err) { toast(err) }
    })
  }
}
export const dingHidePreLoad = () => {
  if (!isDev) {
    dd.device.notification.hidePreloader({
      onSuccess: function (result) {},
      onFail: function (err) { toast(err) }
    })
  }
}
export const dingPreviewImage = (urls, current) => {
  dd.biz.util.previewImage({
    urls: urls,
    current: current,
    onSuccess: function (result) {},
    onFail: function (err) { toast(err) }
  })
}
export const dingSetNavRight = (text = '筛选', fun, show = false, control = true) => {
  if (!isDev) {
    dd.biz.navigation.setRight({
      show: show,
      control: control,
      text: text,
      onSuccess: function (result) { fun && fun() },
      onFail: function (err) { toast(err) }
    })
  }
}
export const dingSetNavLeft =
(text = '', control = false, fun, show = true, showIcon = false) => {
  if (!isDev) {
    dd.biz.navigation.setLeft({
      show: show,
      control: control,
      showIcon: showIcon,
      text: text,
      onSuccess: function (result) { fun && fun() },
      onFail: function (err) { toast(err) }
    })
  }
}

export const dingSetNavLeftAndroid = (fun) => {
  document.addEventListener('backbutton', function (e) {
    fun && fun()
    e.preventDefault()
  })
}

export const dingSetTitle = (title = '') => {
  if (!isDev) {
    dd.biz.navigation.setTitle({
      title: title,
      onSuccess: function (result) {},
      onFail: function (err) { toast(err) }
    })
  }
}
