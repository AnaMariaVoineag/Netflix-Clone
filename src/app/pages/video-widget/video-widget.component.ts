import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-video-widget',
  standalone: true,
  imports: [HeaderComponent, HomeComponent],
  templateUrl: './video-widget.component.html',
  styleUrls: ['./video-widget.component.scss']
})
export class VideoWidgetComponent implements AfterViewInit {
  userName: string = '';
  userImg: string = '';

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || '{}');
    this.userName = loggedInUser.name || '';
    this.userImg = loggedInUser.picture || '';

    this.insertVideoWidget();
  }

  insertVideoWidget(): void {
    const iframe = this.renderer.createElement('iframe');
    iframe.src = 'https://ok.ru/videoembed/8848802712147'; 
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
