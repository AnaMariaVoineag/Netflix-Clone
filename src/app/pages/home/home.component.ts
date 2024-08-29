import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { MovieService } from '../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video-content.interface';
import { DescriptionPipe } from '../../shared/pipes/description.pipe';
import { forkJoin, map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent, MovieCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  movieService = inject(MovieService);
  name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name;
  userProfileImg = JSON.parse(sessionStorage.getItem("loggedInUser")!).picture;
  email = JSON.parse(sessionStorage.getItem("loggedInUser")!).email;
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];
  
  ngOnInit(): void {
    const ids = {
      tvShows: [33117, 45054, 89941, 60998],
      movies: [826510, 89185, 158852]
    };
  
    const tvShowRequests = ids.tvShows.map(id => this.movieService.getTvShowById(id));
    const movieRequests = ids.movies.map(id => this.movieService.getMoviesById(id));
  
    forkJoin([...tvShowRequests, ...movieRequests, ...this.sources])
      .pipe(
        map(([jakeYBlakeId, rescueHeroesId, dwightId, ewwId, haroldID, radioRebelId, tomorrowlandId, movies, tvShows, nowPlaying, upcoming, popular, topRated]) => {
          const tvShowData = {
            jakeYBlakeTVShow: { ...jakeYBlakeId, original_title: jakeYBlakeId.name },
            rescueHeroesTVShow: { ...rescueHeroesId, original_title: rescueHeroesId.name },
            dwightIdTvShow: { ...dwightId, original_title: dwightId.name },
            ewwTvShow: { ...ewwId, original_title: ewwId.name }
          };
  
          movies.results = [];
          tvShows.results = [];
  
          const tvShowArray = [tvShowData.jakeYBlakeTVShow, tvShowData.ewwTvShow, tvShowData.dwightIdTvShow, tvShowData.rescueHeroesTVShow];
          tvShows.results.unshift(...tvShowArray);
  
          const movieArray = [radioRebelId, haroldID, tomorrowlandId];
          movies.results.unshift(...movieArray);
  
          upcoming.results.unshift(haroldID);
  
          this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[0].id);
          this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[0].id);
  
          return { movies, tvShows, nowPlaying, upcoming, popular, topRated };
        })
      )
      .subscribe((res: any) => {
        this.movies = res.movies.results as IVideoContent[];
        this.tvShows = res.tvShows.results as IVideoContent[];
        this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
        this.upcomingMovies = res.upcoming.results as IVideoContent[];
        this.popularMovies = res.popular.results as IVideoContent[];
        this.topRatedMovies = res.topRated.results as IVideoContent[];
      });
  }
  
  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }

}
