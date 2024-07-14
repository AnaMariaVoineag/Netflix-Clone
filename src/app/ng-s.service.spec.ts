import { TestBed } from '@angular/core/testing';

import { NgSService } from './ng-s.service';

describe('NgSService', () => {
  let service: NgSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
