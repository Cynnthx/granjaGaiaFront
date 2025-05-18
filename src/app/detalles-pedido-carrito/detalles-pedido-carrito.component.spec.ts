import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPedidoCarritoComponent } from './detalles-pedido-carrito.component';

describe('DetallesPedidoCarritoComponent', () => {
  let component: DetallesPedidoCarritoComponent;
  let fixture: ComponentFixture<DetallesPedidoCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesPedidoCarritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPedidoCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
