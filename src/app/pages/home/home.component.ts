import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { MovieService } from '../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video-content.interface';
import { forkJoin, map, Observable } from 'rxjs';
import { MovieWidgetComponent } from '../movie-widget/movie-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent, MovieCarouselComponent, MovieWidgetComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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

  // Define the videosId
  videosId: number = 8848802712147;

  ngOnInit(): void {
    const ids = {
      tvShows: [33117, 45054, 89941, 60998, 61851, 115304],
      movies: [826510, 89185, 158852, 71885, 424694, 65218]
    };

    const tvShowRequests = ids.tvShows.map(id => this.movieService.getTvShowById(id));
    const movieRequests = ids.movies.map(id => this.movieService.getMoviesById(id));

    forkJoin([...tvShowRequests, ...movieRequests, ...this.sources])
      .pipe(
        map(([jakeYBlakeId, rescueHeroesId, dwightId, ewwId, batgId, intertwinedID, haroldID, radioRebelId, tomorrowlandId, motocrossedId, bohemianId, lemonadeMouthId, movies, tvShows, nowPlaying, upcoming, popular, topRated]) => {
          const tvShowData = {
            jakeYBlakeTVShow: { ...jakeYBlakeId, original_title: jakeYBlakeId.name },
            rescueHeroesTVShow: { ...rescueHeroesId, original_title: rescueHeroesId.name },
            dwightIdTvShow: { ...dwightId, original_title: dwightId.name },
            ewwTvShow: { ...ewwId, original_title: ewwId.name },
            batgTVhow: {...batgId, original_title: batgId.name},
            intertwinedTVShow: {...intertwinedID, original_title: intertwinedID.name}
          };

          movies.results = [];
          tvShows.results = [];

          const tvShowArray = [tvShowData.jakeYBlakeTVShow, tvShowData.ewwTvShow, tvShowData.dwightIdTvShow, tvShowData.rescueHeroesTVShow, tvShowData.batgTVhow, tvShowData.intertwinedTVShow];
          tvShows.results.unshift(...tvShowArray);

          const movieArray = [radioRebelId, haroldID, tomorrowlandId, motocrossedId, bohemianId, lemonadeMouthId];
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
