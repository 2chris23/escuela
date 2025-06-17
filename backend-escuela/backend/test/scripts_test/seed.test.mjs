import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');

  // Crear roles
  const roles = ['Administrador', 'Profesor', 'Alumno', 'Tutor'];
  const rolesCreados = await Promise.all(
    roles.map((nombre) =>
      prisma.rol.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      })
    )
  );

  // Crear permisos
  const permisos = [
    'crear_actividad',
    'actualizar_actividad',
    'eliminar_actividad',
    'ver_actividades',
    'calificar_actividad',
    'crear_alumno',
    'actualizar_alumno',
    'eliminar_alumno',
    'ver_alumnos',
    'ver_rendimiento_alumno',
    'ver_rendimiento_aula',
    'gestionar_usuarios',
    'gestionar_aulas',
    'gestionar_profesores',
    'gestionar_tutores',
    'crear_profesor', // Permisos adicionales
    'actualizar_profesor',
    'eliminar_profesor',
    'ver_profesor',
  ];

  const permisosCreados = await Promise.all(
    permisos.map((nombre) =>
      prisma.permiso.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      })
    )
  );

  // Asignar permisos a roles
  const permisosPorRol = {
    Administrador: permisos, // Todos los permisos
    Profesor: [
      'crear_actividad',
      'actualizar_actividad',
      'calificar_actividad',
      'ver_actividades',
      'crear_profesor',
      'actualizar_profesor',
      'ver_profesor',
    ],
    Alumno: ['ver_actividades', 'ver_rendimiento_alumno', 'ver_rendimiento_aula'],
    Tutor: ['ver_actividades', 'ver_rendimiento_alumno', 'ver_rendimiento_aula'],
  };

  for (const [rolNombre, permisosRol] of Object.entries(permisosPorRol)) {
    const rol = rolesCreados.find((r) => r.nombre === rolNombre);
    const permisosIds = permisosCreados
      .filter((permiso) => permisosRol.includes(permiso.nombre))
      .map((permiso) => ({ id: permiso.id }));

    await prisma.rol.update({
      where: { id: rol.id },
      data: {
        permisos: {
          set: permisosIds,
        },
      },
    });
  }

  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

it('should seed roles correctly', async () => {
  const mockRoles = ['Administrador', 'Profesor', 'Alumno', 'Tutor'];
  const createdRoles = mockRoles.map((role) => ({ nombre: role }));

  expect(createdRoles).toHaveLength(4);
  expect(createdRoles[0].nombre).toBe('Administrador');
});