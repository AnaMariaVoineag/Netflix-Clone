import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http'

const options = {
  params: {
    include_adult: 'false',
    include_video: 'true',
    language: 'en-US',
    page: '1',
    sort_by: 'popularity.desc'
  },
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWI4OTllOTdkMzA3ZjVlNmI3YjIzYjliZTliYjc5OCIsIm5iZiI6MTcyMDk1ODIyMi43NzI2NTksInN1YiI6IjY2MzAwODg4YTgwNjczMDEyMmU5NzlmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y6OaaCeIlkhWm9wkFv6R4pA6D9rfuwhinM5b6ct6jF8'
  }
}
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'b9b899e97d307f5e6b7b23b9be9bb798'

  http = inject(HttpClient);

  getMovies(){
    return this.http.get<any>('https://api.themoviedb.org/3/discover/movie', options);
  }

  getTvShows(){
    return this.http.get<any>('https://api.themoviedb.org/3/discover/tv', options)
  }

  getTvShowById(id: number) {
    return this.http.get<any>(`https://api.themoviedb.org/3/tv/${id}`, options);
  }

  getMoviesById(id: number) {
    return this.http.get<any>(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`);
  }
  

  getBannerImage(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/images`, options)
  }

  getBannerVideo(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/videos`, options);
  }

  getBannerDetail(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}`, options);
  }

  getNowPlayingMovies() {
    return this.http.get<any>('https://api.themoviedb.org/3/movie/now_playing', options)
  }

  getPopularMovies() {
    return this.http.get<any>('https://api.themoviedb.org/3/movie/popular', options)
  }

  getTopRated() {
    return this.http.get<any>('https://api.themoviedb.org/3/movie/top_rated', options)
  }

  getUpcomingMovies() {
    return this.http.get('https://api.themoviedb.org/3/movie/upcoming', options)
  }
  

}
