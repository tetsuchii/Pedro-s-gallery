import { Component, OnInit } from '@angular/core';
import { FlickrService } from '../services/flickr.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-tag-images',
  templateUrl: './tag-images.component.html',
  styleUrls: ['./tag-images.component.css']
})
export class TagImagesComponent implements OnInit {
  images: any; //A megjelenitendo kepek osszessege
  owner: string | undefined; //A felhasznalo id-ja, akinek a kepenek az informacioit nezzuk epp, es akit kivalasztva lekerdezhetjuk a sajat kepeit
  photo_id: string | undefined; //Egy kep id-ja, amin muveletet akarunk vegezni, pl lekerni az adatait
  infos: any; //Egy kep informacioit tartalmazza
  popup = false; //A felugro ablak alap beallitasa, azz ne jelenjen meg
  tags: any; //Az egy kephez tartozo tag-ek osszessege
  description: any; //Az egy kephez tartozo leiras
  tag: string | undefined; //Az a tag, amin muveletet akarunk vegrehajtani, mint pl lekerdezni a kepeket, amik szinten ezt a tag-et megkaptak

  constructor(private flickrService: FlickrService) { }

  //Beallitja az adott tag-et hordozo osszes kepet
  ngOnInit(): void {
    this.owner=this.flickrService.prevOwner;
    lastValueFrom(this.flickrService.searchTag(<string>this.flickrService.prevTag))
    .then(res => {
      this.images = res;
    });
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

//Az oldal gorgethetosegeert felelols, betolti az ujabb adag kepet
  onScroll(){
    if(this.tag && this.tag.length > 0){
      lastValueFrom(this.flickrService.searchTag(this.tag))
      .then (res => {
        this.images = this.images.concat(res);
      });
    }
  }

}
