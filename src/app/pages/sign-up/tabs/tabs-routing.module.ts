import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [ 
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'request',
        loadChildren: () => import('../../request/request.module').then(m => m.RequestPageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../../categories/categories.module').then(m => m.CategoriesPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../../account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../../chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/categories',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/categories',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
