const langs = {
  en: {
    route: {
      main: 'Alpha',
      list: 'List',
      form: 'Form'
    }
  },
  zh: {
    route: {
      main: 'Alpha系统',
      list: '列表',
      form: '表单'
    }
  }
}

Object.keys(langs).map(lang =>
  Object.keys(langs[lang]).map(mod =>
    Object.keys(langs[lang][mod]).map(item => {
      langs[lang][mod][`${APP_NAME}-${item}`] = langs[lang][mod][item]
      delete langs[lang][mod][item]
    })
  )
)

export default langs
