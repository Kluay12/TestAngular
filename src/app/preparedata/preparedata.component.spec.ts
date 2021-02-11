import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparedataComponent } from './preparedata.component';

describe('PreparedataComponent', () => {
  let component: PreparedataComponent;
  let fixture: ComponentFixture<PreparedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparedataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
