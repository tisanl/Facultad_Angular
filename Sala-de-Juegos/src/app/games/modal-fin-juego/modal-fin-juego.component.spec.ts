import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFinJuegoComponent } from './modal-fin-juego.component';

describe('ModalFinJuegoComponent', () => {
  let component: ModalFinJuegoComponent;
  let fixture: ComponentFixture<ModalFinJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFinJuegoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFinJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
