import { Routes } from '@angular/router';
import { NotesPageComponent } from './notes/pages/notes-page.component';

export const routes: Routes = [
  { path: '', component: NotesPageComponent, title: 'Ocean Notes - All Notes' },
  // Future:
  // { path: 'archived', component: ArchivedPageComponent, title: 'Ocean Notes - Archived' },
  // { path: 'settings', component: SettingsPageComponent, title: 'Ocean Notes - Settings' },
  { path: '**', redirectTo: '' }
];
