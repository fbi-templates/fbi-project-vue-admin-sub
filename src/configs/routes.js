export default [
  {
    path: 'list',
    name: `${APP_NAME}-list`,
    component: () => import('@/views/list' /* webpackChunkName: "list" */)
  },
  {
    path: 'form',
    name: `${APP_NAME}-form`,
    component: () => import('@/views/form' /* webpackChunkName: "form" */)
  }
]
