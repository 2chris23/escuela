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

  // Crear un usuario con rol Alumno
  const usuarioAlumno = await prisma.usuario.upsert({
    where: { email: 'alumno1@demo.com' },
    update: {},
    create: {
      nombre: 'Alumno Demo',
      email: 'alumno1@demo.com',
      password: '123456', // Recuerda hashear en producción
      rol: { connect: { nombre: 'Alumno' } },
    },
  });

  // Forzar el id 1 para el alumno y usuario si no existen
  let usuarioAlumno1 = await prisma.usuario.findUnique({ where: { id: 1 } });
  if (!usuarioAlumno1) {
    usuarioAlumno1 = await prisma.usuario.create({
      data: {
        id: 1,
        nombre: 'Alumno Demo 1',
        email: 'alumno1@demo.com',
        password: '123456',
        rol: { connect: { nombre: 'Alumno' } },
      },
    });
  }
  let aulaDemo1 = await prisma.aula.findFirst({ where: { nombre: 'Aula Demo' } });
  if (!aulaDemo1) {
    aulaDemo1 = await prisma.aula.create({
      data: {
        nombre: 'Aula Demo',
        descripcion: 'Aula de prueba para seeds',
      },
    });
  }
  let alumno1 = await prisma.alumno.findUnique({ where: { id: 1 } });
  if (!alumno1) {
    await prisma.alumno.create({
      data: {
        id: 1,
        usuario: { connect: { id: usuarioAlumno1.id } },
        aula: { connect: { id: aulaDemo1.id } },
      },
    });
  }

  // Crear un aula de prueba (usando create/findUnique por no tener unique en nombre)
  let aulaDemo = await prisma.aula.findFirst({ where: { nombre: 'Aula Demo' } });
  if (!aulaDemo) {
    aulaDemo = await prisma.aula.create({
      data: {
        nombre: 'Aula Demo',
        descripcion: 'Aula de prueba para seeds',
      },
    });
  }

  // Crear un alumno vinculado al usuario y aula
  const alumnoExistente = await prisma.alumno.findUnique({ where: { usuarioId: usuarioAlumno.id } });
  if (!alumnoExistente) {
    await prisma.alumno.create({
      data: {
        usuario: { connect: { id: usuarioAlumno.id } },
        aula: { connect: { id: aulaDemo.id } },
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
