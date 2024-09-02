
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OkruService {

  getOkRuVideoUrl(videoId: string): string {
    return `https://ok.ru/videoembed/${videoId}`;
  }
}
