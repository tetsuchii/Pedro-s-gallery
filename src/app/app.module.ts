import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchImagesComponent } from './search-images/search-images.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserImagesComponent } from './user-images/user-images.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import {TagImagesComponent } from './tag-images/tag-images.component';
import { FavImagesComponent } from './fav-images/fav-images.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchImagesComponent,
    UserImagesComponent,
    TagImagesComponent,
    FavImagesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
