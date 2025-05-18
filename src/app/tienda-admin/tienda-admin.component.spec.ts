import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaAdminComponent } from './tienda-admin.component';

describe('TiendaAdminComponent', () => {
  let component: TiendaAdminComponent;
  let fixture: ComponentFixture<TiendaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
