import { CommonModule, NgIf} from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { IVideoContent } from '../../models/video-content.interface';
import { DescriptionPipe } from '../../pipes/description.pipe';
import { ImagePipe } from '../../pipes/image.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-carousel',
  imports: [CommonModule, DescriptionPipe, ImagePipe, RouterModule],
  templateUrl: './movie-carousel.component.html',
  styleUrl: './movie-carousel.component.scss',
  standalone: true,

  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MovieCarouselComponent implements OnInit, AfterViewInit{
  @Input() videoContents: IVideoContent[] = [];
  @Input() title!: string;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef
  selectedContent: string | null = null;
  constructor() {}

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnInit(): void {
   
  }

  private initSwiper() {
    return new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 'auto',
      spaceBetween: 10,
      centeredSlides: false,
      loop: false,
    });
  }

  setHoverMovie(movie: IVideoContent){
    this.selectedContent = movie.title ?? movie.name;
  }

  clearHoverMovie() {
    this.selectedContent = null;
  }
}