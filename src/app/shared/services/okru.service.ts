import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OkruService {

  http = inject(HttpClient);

  getOkRuVideoUrl(videosId: string): string {
    return `https://ok.ru/videoembed/${videosId}`;
  }
}
