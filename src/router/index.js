import moment from 'moment';
import { createRouter, createWebHistory } from 'vue-router';
import login from '../pages/login.vue';

const routes = [
  {
    path: '',
    redirect:'/dashboard'
    
  },
  {
    path: '/login',
    name: 'login',
    component: login,
   
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "login" */ '../pages/dashboard'),
    beforeEnter: (to, from, next) => { 
      if(localStorage.getItem('access_token')){
        let {token, expiration} = JSON.parse(localStorage.getItem('access_token'));
        //TODO: Check for token expiration
        let expirationTime = moment(expiration);
        let currentTime = moment();
        let diff = expirationTime.diff(currentTime, 'hours');
        if(diff < 0){
          localStorage.removeItem('access_token');
          next({
            name: "login"
          })
        }else{
          if(token){
            next();
          }

        }
      }else{
        next({
          name: "login"
        })
      }
    },
    children : [
      {
        path: '',
        name: '',
        component: () => import('../pages/dashboard/overview'),
       
      },
      {
        path: 'elections',
        name: 'elections',
        component: () => import('../pages/dashboard/elections'),
        children: [
          {
            path: '',
            name: '',
            component: () => import('../pages/detailedPage/electionDisplay')
          },
          {
            path: ':id',
            name: 'view-election',
            component: () => import('../pages/dashboard/viewElection'),
            children: [
              {
                path: '',
                component: () => import('../pages/detailedPage/viewElectionDisplay')
              },
              {
                path: 'results',
                component: () => import('../pages/detailedPage/viewResults')
              }
            ]
          },
        ]
      },
      {
        path: 'positions',
        name: 'positions',
        component: () => import('../pages/dashboard/positions'),
      },
      {
        path: 'candidates',
        name: 'candidates',
        component: () => import('../pages/dashboard/candidates'),
        children: [
          {
            path: '',
            name: '',
            component: () => import('../pages/detailedPage/candidateDisplay')
          },
          {
            path: ':id',
            name: 'view-candidate',
            component: () => import('../pages/detailedPage/viewCandidate')
          },
        ]
      },
      {
        path: 'voters',
        name: 'voters',
        component: () => import('../pages/dashboard/voters'),
        children: [
          {
            path: '',
            name: '',
            component: () => import('../pages/detailedPage/voterDisplay')
          }
        ]
      },
      {
        path: 'results',
        name: 'results',
        component: () => import('../pages/dashboard/results')
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('../pages/dashboard/setting')
      }
    ]
  },
  {
    path: '/voter-login',
    name: 'voterLogin',
    component: () => import('../voters/pages/login')
  },
  {
    path: '/voter-dash',
    name: 'voter-dash',
    component: () => import('../voters/pages/dashboard'),
    children : [
      {
        path: '',
        name: '',
        component: () => import('../voters/pages/dashboard/overview'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

//navigation guard
// router.beforeEach((to,from,next) => {
//   if(to.matched.some(record => record.meta.requiresAuth)){
//     if(!credentials){
//       next({
//         name: "login"
//       })
//     }else{
//       next();
//     }
//   }else{
//     next();
//   }
// });

export default router
