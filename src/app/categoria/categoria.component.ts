// src/app/categoria/categoria.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../services/categoria.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  loading = true;
  filtro: string = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        this.categoriasFiltradas = categorias;
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar las categorías');
        this.loading = false;
      }
    });
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => {
          this.categorias = this.categorias.filter(c => c.id !== id);
          this.categoriasFiltradas = this.categoriasFiltradas.filter(c => c.id !== id);
          alert('Categoría eliminada con éxito');
        },
        error: () => alert('Error al eliminar la categoría')
      });
    }
  }

  filtrarCategorias(): void {
    if (this.filtro.trim() !== '') {
      const filtroLower = this.filtro.toLowerCase();
      this.categoriasFiltradas = this.categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(filtroLower) ||
        categoria.descripcion.toLowerCase().includes(filtroLower)
      );
    } else {
      this.categoriasFiltradas = this.categorias;
    }
  }
}
