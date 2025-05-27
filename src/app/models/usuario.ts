// 1. Definimos los roles como "ADMIN" o "USER" (como opciones fijas)
export enum Rol {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Usuario {
  id?: number;           // El "?" significa que es opcional (para cuando creas uno nuevo)
  nickname: string;
  email: string;
  rol: Rol;             // ADMIN o USER
  contrasena?: string;   // Solo para formularios de register/login (no se guarda en el frontend)
}
