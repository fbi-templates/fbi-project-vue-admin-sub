// import vueAdmin from '@peak-stone/vue-admin'
import { initApp, startApp } from '@peak-stone/vue-admin'
import configs from './configs/'

const app = {
  id: `${APP_NAME}`,
  name: `${APP_NAME}-main`,
  meta: {
    icon: 'component'
  }
}

const {
  apolloProvider,
  addApolloClients,
  store,
  router,
  Layout,
  i18nUpdate
} = initApp({
  ...configs,
  app,
  routerConfig: {
    mode: 'history',
    base: ROUTE_BASE
  }
})

startApp()
  .then(({ Vue }) => {
    Vue.prototype.$appName = `${APP_NAME}`
  })
  .catch(err => {
    console.error(err)
  })
