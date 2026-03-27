-- CreateTable
CREATE TABLE "MicroLesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "simpleLine" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MicroLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MicroLesson_slug_key" ON "MicroLesson"("slug");
