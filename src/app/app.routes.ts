import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
//import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'calendar',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/calendar/components/calendar-view/calendar-view.component')
              .then(m => m.CalendarViewComponent)
          }
        ]
      },
      {
        path: 'documentation',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/documentation/components/doc-list/doc-list.component')
              .then(m => m.DocListComponent)
          },
          {
            path: 'detail/:id',
            loadComponent: () => import('./features/documentation/components/doc-detail/doc-detail.component')
              .then(m => m.DocDetailComponent)
          },
          {
            path: 'upload',
            loadComponent: () => import('./features/documentation/components/doc-upload/doc-upload.component')
              .then(m => m.DocUploadComponent)
          }
        ]
      },
      {
        path: 'forum',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/forum/components/forum-list/forum-list.component')
              .then(m => m.ForumListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/forum/components/forum-detail/forum-detail.component')
              .then(m => m.ForumDetailComponent)
          },
          {
            path: 'post',
            loadComponent: () => import('./features/forum/components/forum-post/forum-post.component')
              .then(m => m.ForumPostComponent)
          }
        ]
      },
      {
        path: 'market',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/market/components/market-list/market-list.component')
              .then(m => m.MarketListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/market/components/product-detail/product-detail.component')
              .then(m => m.ProductDetailComponent)
          }
        ]
      },
      {
        path: 'proverbs',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/proverbs/components/proverb-list/proverb-list.component')
              .then(m => m.ProverbListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/proverbs/components/proverb-detail/proverb-detail.component')
              .then(m => m.ProverbDetailComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];