import { Component, inject, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../shared/services/auth.service';
import { OkruService } from '../../shared/services/okru.service'; // Import OkruService

@Component({
  selector: 'app-movie-widget',
  standalone: true,
  imports: [HeaderComponent, HomeComponent],
  templateUrl: './movie-widget.component.html',
  styleUrls: ['./movie-widget.component.scss']
})
export class MovieWidgetComponent implements OnInit {
  auth = inject(AuthService);
  renderer = inject(Renderer2);
  okruService = inject(OkruService);

  userName!: string;
  userImg!: string;
  videosId: number = 6810037455456; 

  ngOnInit(): void {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser")!);
    this.userName = loggedInUser.name!;
    this.userImg = loggedInUser.picture!;

    this.insertVideoWidget();
  }

  insertVideoWidget(): void {
    const iframe = this.renderer.createElement('iframe');
    const videoUrl = this.okruService.getOkRuVideoUrl(this.videosId.toString()); 
    iframe.src = videoUrl;
    iframe.width = '560';
    iframe.height = '315';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.style.maxWidth = '100%';
    iframe.style.margin = '0 auto';
    iframe.style.display = 'block';

    const widgetContainer = this.renderer.selectRootElement('#ok_content_widget');
    this.renderer.appendChild(widgetContainer, iframe);
  }
}
