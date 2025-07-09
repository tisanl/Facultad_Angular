import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestasComponent } from './encuestas.component';

describe('EncuestasComponent', () => {
  let component: EncuestasComponent;
  let fixture: ComponentFixture<EncuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
