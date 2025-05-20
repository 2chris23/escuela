-- CreateEnum
CREATE TYPE "EstadoAsistencia" AS ENUM ('PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO');

-- CreateTable
CREATE TABLE "asistencia" (
    "id" TEXT NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "claseId" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "estado" "EstadoAsistencia" NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "asistencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
