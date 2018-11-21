import vueAdmin from '@peak-stone/vue-admin'
import { routes, langs, clients } from './configs/'

const app = {
  id: `${APP_NAME}`,
  name: `${APP_NAME}-main`,
  meta: {
    icon: 'component'
  }
}

vueAdmin(routes, langs, app)
  .then(({ Vue, addApolloClients }) => {
    Vue.prototype.$appName = `${APP_NAME}`
    addApolloClients(clients)
  })
  .catch(err => {
    console.error(err)
  })
