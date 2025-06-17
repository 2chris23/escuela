/*
  Warnings:

  - Added the required column `updatedAt` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Profesor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alumno" DROP CONSTRAINT "Alumno_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Profesor" DROP CONSTRAINT "Profesor_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "aulaId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tutorId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Profesor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Aula" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "profesorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "profesorId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumnoActividad" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "calificacion" DOUBLE PRECISION,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumnoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Aula_profesorId_idx" ON "Aula"("profesorId");

-- CreateIndex
CREATE INDEX "Actividad_profesorId_idx" ON "Actividad"("profesorId");

-- CreateIndex
CREATE INDEX "Actividad_aulaId_idx" ON "Actividad"("aulaId");

-- CreateIndex
CREATE INDEX "AlumnoActividad_alumnoId_idx" ON "AlumnoActividad"("alumnoId");

-- CreateIndex
CREATE INDEX "AlumnoActividad_actividadId_idx" ON "AlumnoActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumnoActividad_alumnoId_actividadId_key" ON "AlumnoActividad"("alumnoId", "actividadId");

-- CreateIndex
CREATE INDEX "Alumno_usuarioId_idx" ON "Alumno"("usuarioId");

-- CreateIndex
CREATE INDEX "Alumno_aulaId_idx" ON "Alumno"("aulaId");

-- CreateIndex
CREATE INDEX "Alumno_tutorId_idx" ON "Alumno"("tutorId");

-- CreateIndex
CREATE INDEX "Profesor_usuarioId_idx" ON "Profesor"("usuarioId");

-- CreateIndex
CREATE INDEX "Tutor_usuarioId_idx" ON "Tutor"("usuarioId");

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor" ADD CONSTRAINT "Profesor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoActividad" ADD CONSTRAINT "AlumnoActividad_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoActividad" ADD CONSTRAINT "AlumnoActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
