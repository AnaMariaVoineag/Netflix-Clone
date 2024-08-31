import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieWidgetComponent } from './movie-widget.component';

describe('MovieWidgetComponent', () => {
  let component: MovieWidgetComponent;
  let fixture: ComponentFixture<MovieWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
