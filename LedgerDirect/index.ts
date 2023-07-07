import { Module } from '@nuxt/types';
import path from 'node:path';
import url from 'node:url';
import { NuxtRouteConfig } from '@nuxt/types/config/router';

const overwriteRoute = (routes, name, component, children = false) => {
  routes.forEach((route) => {
    if (route.name === name) {
      route.component = component;
      return;
    }
    if (children && route.children) {
      overwriteRoute(route.children, name, component);
    }
  });
};

const nuxtModule : Module = function ledgerDirectModule() {

  const moduleDir = path.dirname(url.fileURLToPath(import.meta.url));

  this.extendRoutes((routes: NuxtRouteConfig[]) => {

    overwriteRoute(routes, 'payment', path.resolve(moduleDir, 'pages/Checkout/Payment.vue'), true)

    routes.push(
      {
        name: 'ledger-direct-payment',
        path: '/ledger-direct/payment/:orderNumber',
        component: path.resolve(moduleDir, 'pages/LedgerDirect/Payment.vue'),
        // @ts-expect-error NuxtRouteConfig and RouteConfig conflict
        props: true,
      },
    );

  });

  this.addLayout({
    src: path.resolve(moduleDir, 'layouts/plain.vue'),
    name: 'plain',
  });

};
export default nuxtModule;
