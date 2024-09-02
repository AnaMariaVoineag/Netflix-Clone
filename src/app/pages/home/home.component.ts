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
      movies: [13576, 89185, 71885, 424694, 7512, 65218, 316029, 18736]
    };

    const okruIds: { [key: number]: string } = {
      89185: '2048075238015', //Radio Rebel
      13576: '1569979763298', //This is it
      71885: '7599396817585', //Motocrossed
      424694: '6865400826529', //Bohemian Rapsody
      7512: '3577089034790', //Idiocracy
      65218: '7705353718483', //Lemonade Mouth
      316029: '1315495611120', //The Greatest Showman
      18736: '7811220310709'
    };

    const tvShowRequests = ids.tvShows.map(id => this.movieService.getTvShowById(id));
    const movieRequests = ids.movies.map(id => this.movieService.getMoviesById(id));

    forkJoin([...tvShowRequests, ...movieRequests, ...this.sources])
      .pipe(
        map(([jakeYBlakeId, rescueHeroesId, dwightId, ewwId, batgId, intertwinedID, thisIsItId, radioRebelId, idiocracyID, motocrossedId, bohemianId, lemonadeMouthId, showmanId, lizzieId, movies, tvShows, nowPlaying, upcoming, popular, topRated]) => {
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
            thisIsItId: { ...thisIsItId, okruId: okruIds[thisIsItId.id]},
            idiocracyID: { ...idiocracyID, okruId: okruIds[idiocracyID.id]},
            motocrossedId: { ...motocrossedId, okruId: okruIds[motocrossedId.id] },
            bohemianId: { ...bohemianId, okruId: okruIds[bohemianId.id] },
            lemonadeMouthId: { ...lemonadeMouthId, okruId: okruIds[lemonadeMouthId.id] },
            showmanId: { ...showmanId, okruId: okruIds[showmanId.id]},
            lizzieId: {...lizzieId, okruId: okruIds[lizzieId.id]}
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
            movieData.thisIsItId, 
            movieData.idiocracyID, 
            movieData.motocrossedId, 
            movieData.bohemianId, 
            movieData.lemonadeMouthId,
            movieData.lizzieId
          ];
          movies.results.unshift(...movieArray);

          topRated.results.unshift(movieData.showmanId);

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
