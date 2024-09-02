import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { MovieService } from '../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video-content.interface';
import { forkJoin, map, Observable } from 'rxjs';
import { OkruService } from '../../shared/services/okru.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent, MovieCarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  auth = inject(AuthService);
  movieService = inject(MovieService);
  okruService = inject(OkruService);
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
  okruId: IVideoContent[] = [];

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
      tvShows: [33117, 45054, 89941, 60998, 61851, 115304],
      movies: [826510, 89185, 158852, 71885, 424694, 65218]
    };

    const okruIds: { [key: number]: string } = {
      89185: '6810037455456',
      826510: '5032385579655',
      158852: '6810037455456',
      71885: '6810037455456',
      424694: '6810037455456',
      115304: '6810037455456',
      65218: '6810037455456',
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
            batgTVshow: { ...batgId, original_title: batgId.name },
            intertwinedTVShow: { ...intertwinedID, original_title: intertwinedID.name }
          };

          const movieData = {
            radioRebelId: { ...radioRebelId, okruId: okruIds[radioRebelId.id] },
            haroldID: { ...haroldID, okruId: okruIds[haroldID.id] },
            tomorrowlandId: { ...tomorrowlandId, okruId: okruIds[tomorrowlandId.id] },
            motocrossedId: { ...motocrossedId, okruId: okruIds[motocrossedId.id] },
            bohemianId: { ...bohemianId, okruId: okruIds[bohemianId.id] },
            lemonadeMouthId: { ...lemonadeMouthId, okruId: okruIds[lemonadeMouthId.id] }
          };

          movies.results = [];
          tvShows.results = [];

          const tvShowArray = [
            tvShowData.jakeYBlakeTVShow, 
            tvShowData.ewwTvShow, 
            tvShowData.dwightIdTvShow, 
            tvShowData.rescueHeroesTVShow, 
            tvShowData.batgTVshow, 
            tvShowData.intertwinedTVShow
          ];
          tvShows.results.unshift(...tvShowArray);

          const movieArray = [
            movieData.radioRebelId, 
            movieData.haroldID, 
            movieData.tomorrowlandId, 
            movieData.motocrossedId, 
            movieData.bohemianId, 
            movieData.lemonadeMouthId
          ];
          movies.results.unshift(...movieArray);

          upcoming.results.unshift(movieData.haroldID);
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
  
  signOut() {
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }
}
