import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { OkruService } from '../../shared/services/okru.service'; 
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  selector: 'app-movie-widget',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './movie-widget.component.html',
  styleUrls: ['./movie-widget.component.scss']
})
export class MovieWidgetComponent implements OnInit, AfterViewInit {
  auth = inject(AuthService);
  renderer = inject(Renderer2);
  okruService = inject(OkruService);
  route = inject(ActivatedRoute);

  userName!: string;
  userImg!: string;
  movieId!: number;
  okruId!: string;

  ngOnInit(): void {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser")!);
    this.userName = loggedInUser.name!;
    this.userImg = loggedInUser.picture!;

    this.route.paramMap.subscribe(params => {
      this.movieId = +params.get('id')!;
      this.okruId = params.get('okruId')!;
    });
  }

  ngAfterViewInit(): void {
    this.insertVideoWidget();
  }

  insertVideoWidget(): void {
    const iframe = this.renderer.createElement('iframe');
    const videoUrl = this.okruService.getOkRuVideoUrl(this.okruId); 

    iframe.src = videoUrl;
    iframe.width = '560';
    iframe.height = '315';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.style.maxWidth = '100%';
    iframe.style.margin = '0 auto';
    iframe.style.display = 'block';

    const widgetContainer = this.renderer.selectRootElement('#ok_content_widget', true);
    this.renderer.appendChild(widgetContainer, iframe);
  }
}
