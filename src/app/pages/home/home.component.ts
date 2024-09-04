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
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  okruId: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];

  ngOnInit(): void {
    const ids = {
      movies: [13576, 89185, 71885, 424694, 7512, 65218, 316029, 18736, 1114926, 704239, 597, 238, 240, 227149, 49928, 80609, 1160164, 416494, 138038, 245473, 34766, 29742, 256962, 419478, 36568, 360365, 810, 1073170, 1023922, 519182, 2118, 87343, 10330, 790142, 762441, 634649, 52699, 124117, 60405, 9342, 46004, 765169, 50479]
    };

    const okruIds: { [key: number]: string } = {
      89185: '2048075238015', // Radio Rebel
      13576: '1569979763298', // This is it
      71885: '7599396817585', // Motocrossed
      424694: '6865400826529', // Bohemian Rhapsody
      7512: '3577089034790', // Idiocracy
      65218: '7705353718483', // Lemonade Mouth
      316029: '1315495611120', // The Greatest Showman
      18736: '7811220310709', // The Lizzie McGuire
      1114926: '7961924012707', // The Good Half
      704239: '8080703818261', // The Union
      597: '7621931764245', // Titanic
      238: '4436268813050', // The Godfather
      240: '3144780089987', // The Godfather Part II
      227149: '908718180987', // On Thin Ice
      49928: '2333510930936', // Au Pair
      80609: '1871307999871', // Au Pair 2
      1160164: '7224507960036', // Eras Tour
      416494: '1357453920864', // Status Update
      138038: '1236429638182', // Girl VS Monster
      245473: '6810035423840', // Cloud Nine,
      34766: '7794608310947', // Zenon
      29742: '7762260593315', // Zenon: The Zequel
      256962: '7106003536581', // Little Boy 
      419478: '3469612550820', // Midnight Sun
      36568: '2790154046135', // Paulie
      360365: '2916224404134', // Tini The Movie
      810: '7616824347157', // Shrek The Third
      1073170: '8032135023125', // Zoey 102
      1023922: '7958066366997', // MaXXXine
      519182: '7954696309269', // Despicable Me 4
      2118: '7910803180053', // LA Confidential
      87343: '4392075659796', // Mom's On Strike
      10330: '7723923343893', // Freaky Friday
      790142: '7598526302830', // The Royal Treatment
      762441: '7788409981671', // A Quiet Place: Day One
      634649: '7813511580181', // Spider-Man: No Way Home
      52699: '3405145901606', // Hatching Pete
      124117: '6717411691256', // Pixel Perfect
      60405: '6810038897248', // Sharpay's Faboulous Adventure
      9342: '6826401139333', // The Mask of Zorro
      46004: '1722746669606', // The Luck of The Irish
      765169: '2876287486551', // Bia, Un Mundo AL Reves
      50479: '3834685229623'// Avalon High
    };

    const movieRequests = ids.movies.map(id => this.movieService.getMoviesById(id));

    forkJoin([...movieRequests, ...this.sources])
      .pipe(
        map(([thisIsItId, radioRebelId, motocrossedId, bohemianId, idiocracyID, lemonadeMouthId, showmanId, lizzieId, tghId, unionId, titanicId, tgfId, tgfp2Id, iceAngelId, auPairId, auPairTwoId, erasTourId, statusUpdateId, girlVsId, cloudNineId, zenonId, zequelId, littleBoyId, midninghtId, paulieId, tiniMovieId, shrekThreeId, zoey102Id, maxxxineId, despicableMeFourId, laconfidentialId, momstrikeId, freakyId, trtId, quietId, spiderManId, hatchingPeteId, pixelPerfectId, sharpayId, zorroId, theLuckOfId, biaId, avalonHighId, movies, nowPlaying, popular]) => {
          const movieData = {
            radioRebelId: { ...radioRebelId, okruId: okruIds[radioRebelId.id] },
            thisIsItId: { ...thisIsItId, okruId: okruIds[thisIsItId.id] },
            motocrossedId: { ...motocrossedId, okruId: okruIds[motocrossedId.id] },
            idiocracyID: { ...idiocracyID, okruId: okruIds[idiocracyID.id] },
            bohemianId: { ...bohemianId, okruId: okruIds[bohemianId.id] },
            lemonadeMouthId: { ...lemonadeMouthId, okruId: okruIds[lemonadeMouthId.id] },
            showmanId: { ...showmanId, okruId: okruIds[showmanId.id] },
            lizzieId: { ...lizzieId, okruId: okruIds[lizzieId.id] },
            tghId: { ...tghId, okruId: okruIds[tghId.id] },
            unionId: { ...unionId, okruId: okruIds[unionId.id] },
            titanicId: { ...titanicId, okruId: okruIds[titanicId.id] },
            tgfId: { ...tgfId, okruId: okruIds[tgfId.id] },
            tgfp2Id: { ...tgfp2Id, okruId: okruIds[tgfp2Id.id] },
            iceAngelId: { ...iceAngelId, okruId: okruIds[iceAngelId.id], original_title: 'On Thin Ice' },
            auPairId: { ...auPairId, okruId: okruIds[auPairId.id] },
            auPairTwoId: { ...auPairTwoId, okruId: okruIds[auPairTwoId.id] },
            erasTourId: { ...erasTourId, okruId: okruIds[erasTourId.id] },
            statusUpdateId: { ...statusUpdateId, okruId: okruIds[statusUpdateId.id]},
            girlVsId: { ...girlVsId, okruId: okruIds[girlVsId.id] },
            cloudNineId: { ...cloudNineId, okruId: okruIds[cloudNineId.id] },
          };

          const movieIds = {
            zenonId: { ...zenonId, okruId: okruIds[zenonId.id] },
            zequelId: { ...zequelId, okruId: okruIds[zequelId.id] },
            littleBoyId: { ...littleBoyId, okruId: okruIds[littleBoyId.id] },
            midninghtId: { ...midninghtId, okruId: okruIds[midninghtId.id] },
            paulieId: { ...paulieId, okruId: okruIds[paulieId.id] },
            tiniMovieId: { ...tiniMovieId, okruId: okruIds[tiniMovieId.id] },
            shrekThreeId: { ...shrekThreeId, okruId: okruIds[shrekThreeId.id] },
            zoey102Id: { ...zoey102Id, okruId: okruIds[zoey102Id.id] },
            maxxxineId: { ...maxxxineId, okruId: okruIds[maxxxineId.id] },
            despicableMeFourId: { ...despicableMeFourId, okruId: okruIds[despicableMeFourId.id] },
            laconfidentialId: { ...laconfidentialId, okruId: okruIds[laconfidentialId.id] },
            momstrikeId: { ...momstrikeId, okruId: okruIds[momstrikeId.id] },
            freakyId: { ...freakyId, okruId: okruIds[freakyId.id] },
            trtId: { ...trtId, okruId: okruIds[trtId.id] },
            quietId: { ...quietId, okruId: okruIds[quietId.id] },
            spiderManId: { ...spiderManId, okruId: okruIds[spiderManId.id] },
            hatchingPeteId: { ...hatchingPeteId, okruId: okruIds[hatchingPeteId.id] },
            pixelPerfectId: { ...pixelPerfectId, okruId: okruIds[pixelPerfectId.id] },
            sharpayId: { ...sharpayId, okruId: okruIds[sharpayId.id] },
            zorroId: { ...zorroId, okruId: okruIds[zorroId.id] },
            theLuckOfId: { ...theLuckOfId, okruId: okruIds[theLuckOfId.id] },
            biaId: { ...biaId, okruId: okruIds[biaId.id] },
            avalonHighId: { ...avalonHighId, okruId: okruIds[avalonHighId.id]},
          };

          movies.results = [];
          popular.results = [];
          nowPlaying.results = [];

          const movieArray = [
            movieData.radioRebelId, 
            movieData.thisIsItId,
            movieIds.avalonHighId, 
            movieData.motocrossedId, 
            movieData.erasTourId,
            movieData.bohemianId, 
            movieData.idiocracyID, 
            movieData.lemonadeMouthId,
            movieData.lizzieId,
            movieIds.trtId,
            movieData.auPairId,
            movieData.cloudNineId,
            movieIds.pixelPerfectId,
            movieData.statusUpdateId,
            movieIds.sharpayId,
            movieData.showmanId,
            movieIds.midninghtId,
            movieIds.littleBoyId,
            movieIds.zequelId,
            movieIds.spiderManId,
          ];

          const nowPlayingMovies = [
            movieIds.hatchingPeteId,
            movieIds.tiniMovieId,
            movieIds.paulieId,
            movieIds.shrekThreeId,
            movieIds.pixelPerfectId,
            movieIds.despicableMeFourId,
            movieData.showmanId,
            movieData.statusUpdateId,
            movieIds.sharpayId,
            movieIds.midninghtId,
            movieIds.littleBoyId,
            movieIds.laconfidentialId,
            movieData.girlVsId,
            movieIds.zoey102Id,
            movieIds.theLuckOfId,
            movieData.unionId,
            movieIds.maxxxineId,
            movieIds.quietId,
            movieIds.zorroId,
            movieIds.biaId
          ];

          const popularMovies = [
            movieData.tghId, 
            movieData.unionId,
            movieIds.momstrikeId,
            movieIds.freakyId,
            movieData.titanicId, 
            movieData.auPairId,
            movieData.auPairTwoId, 
            movieData.tgfId, 
            movieData.tgfp2Id, 
            movieData.iceAngelId,  
            movieIds.zenonId, 
            movieIds.zequelId, 
            movieIds.spiderManId,
            movieData.girlVsId,
            movieIds.paulieId,
            movieData.thisIsItId,
            movieIds.tiniMovieId,
            movieData.motocrossedId,
            movieIds.shrekThreeId,
            movieData.cloudNineId,
          ];

          movies.results.unshift(...movieArray);

          popular.results.unshift(...popularMovies);
          nowPlaying.results.unshift(...nowPlayingMovies);

          this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[0].id);
          this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[0].id);

          return { movies, nowPlaying, popular };
        }),
      )
      .subscribe((res: any) => {
        this.movies = res.movies.results as IVideoContent[];
        this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
        this.popularMovies = res.popular.results as IVideoContent[];
      });
  }

  signOut() {
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }
}