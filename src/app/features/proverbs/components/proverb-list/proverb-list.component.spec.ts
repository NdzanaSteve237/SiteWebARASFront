import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProverbListComponent } from './proverb-list.component';

describe('ProverbListComponent', () => {
  let component: ProverbListComponent;
  let fixture: ComponentFixture<ProverbListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProverbListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProverbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
