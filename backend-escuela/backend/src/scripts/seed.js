import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  console.log('Roles creados:', rolesCreados.map((rol) => rol.nombre));

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
    'crear_profesor',
    'actualizar_profesor',
    'eliminar_profesor',
    'ver_profesor',
    'ver_profesores',
    'ver_aulas',
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

  console.log('Permisos creados:', permisosCreados.map((permiso) => permiso.nombre));

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
      'ver_alumnos',
      'ver_rendimiento_alumno',
      'ver_rendimiento_aula',
      'ver_profesores',
      'ver_aulas',
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

    console.log(`Permisos asignados al rol ${rolNombre}:`, permisosRol);
  }

  // Crear usuario administrador
  const adminEmail = 'admin@escuela.com';
  const adminPassword = 'Admin123$';
  const adminRole = rolesCreados.find((rol) => rol.nombre === 'Administrador');

  // Verificar si ya existe el usuario admin
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail },
    include: { profesor: true }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = await prisma.usuario.create({
      data: {
        nombre: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        rolId: adminRole.id,
        profesor: {
          create: {} // Crear el registro de profesor asociado
        }
      },
      include: {
        profesor: true
      }
    });
    console.log(`Usuario Administrador creado con ID: ${adminUser.id}`);
    console.log(`Registro de Profesor creado con ID: ${adminUser.profesor.id}`);
  } else {
    console.log(`Usuario Administrador con email ${adminEmail} ya existe.`);
    if (!existingAdmin.profesor) {
      // Si el usuario existe pero no tiene registro de profesor, crearlo
      const profesor = await prisma.profesor.create({
        data: {
          usuarioId: existingAdmin.id
        }
      });
      console.log(`Registro de Profesor creado para el usuario existente con ID: ${profesor.id}`);
    }
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