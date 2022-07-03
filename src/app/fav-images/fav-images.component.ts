import { Component, OnInit } from '@angular/core';
import { FlickrService } from '../services/flickr.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-fav-images',
  templateUrl: './fav-images.component.html',
  styleUrls: ['./fav-images.component.css']
})
export class FavImagesComponent implements OnInit {
  images: any; //A megjelenitendo kepek osszessege
  owner: string | undefined; //A felhasznalo id-ja, akinek a kedvenc kepeit mutatja epp
  photo_id: string | undefined; //Egy kep id-ja, amin muveletet akarunk vegezni, pl lekerni az adatait
  infos: any; //Egy kep informacioit tartalmazza
  popup = false; //A felugro ablak alap beallitasa, azz ne jelenjen meg
  tags: any; //Az egy kephez tartozo tag-ek osszessege
  description: any; //Az egy kephez tartozo leiras
  ownername: any; //A felhasznalo username-je, akinek a kedvenc kepeit epp megjelenitjuk
  tag: string | undefined; //Az a tag, amin muveletet akarunk vegrehajtani, mint pl lekerdezni a kepeket, amik szinten ezt a tag-et megkaptak

  constructor(private flickrService: FlickrService) { }

  //Beallitja a megjelenitendo kepeket, azaz az adott felhasznalo kedvenc kepeit
  //Beallitja az adott felhasznalo username-jet
  ngOnInit(): void {
    this.owner=this.flickrService.prevOwner;
    lastValueFrom(this.flickrService.getFavs(<string>this.flickrService.prevOwner))
    .then(res => {
      this.images = res;
    });
    lastValueFrom(this.flickrService.getOwnerName(this.owner!)
    ).then( res => {
      this.ownername = res.person.username;
      console.log(res);
    }
    );
  }

  //Kikeresi az adott felhasznalo kepeit
  searchO(event: any) {
    this.owner = event;
    if ( this.owner && this.owner.length > 0) {
      lastValueFrom(this.flickrService.search_owner(this.owner)
      )
      .then( res => {
        this.images = res;
      });

    }
  }

  //Lekerdez minden elerheto informaciot az adott keprol
  getInfo(id: string){
    this.photo_id = id;
    if( this.photo_id && this.photo_id.length > 0){
      lastValueFrom(this.flickrService.getInfo(this.photo_id)
      )
      .then(res => {
          this.infos = res.photo;
          this.tags = res.photo.tags.tag;
          this.description=res.photo.description;
      });
    }
  }

  //Megkeresi az osszes kepet, amin az adott tag el lett helyezve
  searchTag(tagName: string){
    this.tag=tagName;
    if(this.tag && this.tag.length>0){
      lastValueFrom(this.flickrService.searchTag(this.tag)
      ).then(res => {
        this.images = res;
      })
    }
}

//Betolti az adott felhasznalo kedvenc kepeit
getFavs(owner: string){
  this.owner=owner!;
  if(this.owner && this.owner.length > 0){
    lastValueFrom(this.flickrService.getFavs(owner)
    ).then( res => {
      this.images = this.images.concat(res);
    })
  }
}

//Az oldal gorgethetosegeert felelols, betolti az ujabb adag kepet
  onScroll(){
    if(this.owner && this.owner.length > 0){
      lastValueFrom(this.flickrService.getFavs(this.owner))
      .then (res => {
        this.images = this.images.concat(res);
      });
    }
  }
}
