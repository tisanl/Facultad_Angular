import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMsjErrorComponent } from './modal-msj-error.component';

describe('ModalMsjErrorComponent', () => {
  let component: ModalMsjErrorComponent;
  let fixture: ComponentFixture<ModalMsjErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMsjErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMsjErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
