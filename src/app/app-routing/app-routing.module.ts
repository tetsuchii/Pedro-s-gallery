import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchImagesComponent } from '../search-images/search-images.component';
import { UserImagesComponent } from '../user-images/user-images.component';
import { TagImagesComponent } from '../tag-images/tag-images.component';
import { FavImagesComponent } from '../fav-images/fav-images.component';


const routes: Routes = [
  { path: 'search', component: SearchImagesComponent },
  { path: 'user', component: UserImagesComponent },
  { path: 'tag', component: TagImagesComponent},
  { path: 'user/favs', component: FavImagesComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
