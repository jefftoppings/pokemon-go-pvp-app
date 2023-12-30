import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'rank-checker',
        loadComponent: () =>
          import('../rank-checker/rank-checker.page').then(
            (m) => m.RankCheckerPage
          ),
      },
      // {
      //   path: 'cmp-checker',
      //   loadComponent: () =>
      //     import('../cmp-checker/cmp-checker.page').then(
      //       (m) => m.CMPCheckerPage
      //     ),
      // },
      {
        path: '',
        redirectTo: '/tabs/rank-checker',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/rank-checker',
    pathMatch: 'full',
  },
];
