import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

//A megjelenitett foto
export interface FlickrPhoto {
  total: any;
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
  owner: string;
}

//A megjelenitett fotok osszessege
export interface FlickrOutput {
  photos: {
    photo: FlickrPhoto[];
  };
}

//A megjelenitett foto tulajdonosanak adatai
  export interface Owner {
      nsid: string;
      username: string;
      realname: string;
      location: string;
      iconserver: number;
      iconfarm: number;
      path_alias: string;
  }

  //A megjelenitett foto cime
  export interface Title {
      _content: string;
  }

  //A megjelenitett foto leirasa
  export interface Description {
      _content: string;
  }

  //A megjelenitett foto tag-jei
  export interface Tag {
      id: string;
      author: string;
      authorname: string;
      raw: string;
      _content: string;
      machine_tag: number;
  }

  //A megjelenitett foto tag-jeinek osszessege
  export interface Tags {
      tag: Tag[];
  }

  //A lekerdezett foto adatai
  export interface Photo {
      id: string;
      secret: string;
      server: number;
      farm: number;
      dateuploaded: string;
      isfavorite: number;
      license: number;
      safety_level: number;
      rotation: number;
      owner: Owner;
      title: Title;
      description: Description;
      views: string;
      tags: Tags;
      media: string;
  }

  //A lekerdezett fotohoz tartozo rootObject
  export interface RootObject {
      photo: Photo;
      stat: string;
  }

  //A felhasznalo neve
    export interface Username {
        _content: string;
    }

    //A felhasznalo adatai
    export interface Person {
        id: string;
        nsid: string;
        ispro: number;
        is_deleted: number;
        iconserver: string;
        iconfarm: number;
        path_alias: string;
        has_stats: number;
        pro_badge: string;
        expire: number;
        username: Username;
        has_adfree: number;
        has_free_standard_shipping: number;
        has_free_educational_resources: number;
    }

    //A felhasznalo adatainak rootObjectje
    export interface RootObjectForOwner {
        person: Person;
        stat: string;
    }



@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  prevKeyword: string | undefined;
  prevOwner: string | undefined;
  currPage = 1;
  imagesArray: Observable<any[]> | undefined;
  ownername: string | undefined;
  prevTag: string | undefined;


  constructor(private http: HttpClient) { }

  //A keresest megvalosito fuggveny, ami egy keresesi szot var es az osszes erre megfeleltetheto kepet, azaz FlickrPhoto-t adja vissza tombkent
  search_keyword(keyword: string):Observable<FlickrPhoto[]>{
    if (this.prevKeyword === keyword){
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevKeyword = keyword;
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    const params = `api_key=${environment.flickr.key}&text=${keyword}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}`;

    return this.http.get<FlickrOutput>(url + params).pipe(map(( res: FlickrOutput) => {
      const urlArr: any[] = [];
      res.photos.photo.forEach((ph: FlickrPhoto) => {
        const photoObj = {
          url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
          title: ph.title,
          id: ph.id,
          owner: ph.owner,
        };
        urlArr.push(photoObj);
      });
      return urlArr;
    }));
  }

  //Megkeresi a megadott id alapjan a tulajdonos osszes kepet es visszadja azokat FlickrPhoto tombkent
  search_owner(owner: string): Observable<FlickrPhoto[]>{
    if (this.prevOwner === owner){
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevOwner=owner;
    const url = 'https://www.flickr.com/services/rest/?method=flickr.people.getPhotos&';
    const params = `api_key=${environment.flickr.key}&user_id=${owner}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}`;

    return this.http.get<FlickrOutput>(url + params).pipe(map(( res: FlickrOutput) => {
      const urlArr: any[] = [];
      res.photos.photo.forEach((ph: FlickrPhoto) => {
        const photoObj = {
          url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
          title: ph.title,
          id: ph.id,
          owner: ph.owner
        };
        urlArr.push(photoObj);
      });
      return urlArr;
    }));
  }

  //Megkeresi az adott tag-gel ellatott kepeket, a tag string-je alapjan es visszadja az osszes erre megfeleltethetp kepet FlickrPhoto tombkent
  searchTag(tag: string): Observable<FlickrPhoto[]>{
    if (this.prevTag === tag){
      this.currPage++;
    }else{
      this.currPage=1;
    }
    this.prevTag=tag;
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    const params = `api_key=${environment.flickr.key}&tags=${tag}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}`;

    return this.http.get<FlickrOutput>(url + params).pipe(map(( res: FlickrOutput) => {
      const urlArr: any[] = [];
      res.photos.photo.forEach((ph: FlickrPhoto) => {
        const photoObj = {
          url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
          title: ph.title,
          id: ph.id,
          owner: ph.owner,
        };
        urlArr.push(photoObj);
      });
      return urlArr;
    }));
  }

  //Lekeri egy kep minden adatat a kep id-ja alapjan es visszaadja a kephez tartozo rootObjectet
  getInfo(photo_id: string): Observable<RootObject>{
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&';
    const params = `api_key=${environment.flickr.key}&photo_id=${photo_id}&format=json&nojsoncallback=1`;

    return this.http.get<RootObject>(url+params);
  }

  //Lekeri egy adott felhasznalo kedvenceknek jelolt kepeit a felhasznalo id-ja alapjan es visszaadja az osszes erre megfeleltetheto kepet FLickPhoto tombkent
  getFavs(owner: string): Observable<FlickrPhoto[]>{
    if (this.prevOwner === owner){
      this.currPage++;
    }else{
      this.currPage=1;
    }
    this.prevOwner=owner;
    const url = 'https://www.flickr.com/services/rest/?method=flickr.favorites.getList&';
    const params = `api_key=${environment.flickr.key}&user_id=${owner}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}`;

    return this.http.get<FlickrOutput>(url + params).pipe(map(( res: FlickrOutput) => {
      const urlArr: any[] = [];
      res.photos.photo.forEach((ph: FlickrPhoto) => {
        const photoObj = {
          url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
          title: ph.title,
          id: ph.id,
          owner: ph.owner,
        };
        urlArr.push(photoObj);
      });
      return urlArr;
    }));
  }

  //Visszadja a felhasznalo id-ja alapjan a felhasznalo username-jet is tartalmazo rootObjectet
  getOwnerName(id: string): Observable<RootObjectForOwner>{
    const url = 'https://www.flickr.com/services/rest/?method=flickr.people.getInfo&';
    const params = `api_key=${environment.flickr.key}&user_id=${id}&format=json&nojsoncallback=1`;

    return this.http.get<RootObjectForOwner>(url+params);
  }

}
