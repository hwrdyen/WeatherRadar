-- CreateTable
CREATE TABLE "weatherradar.user" (
    "_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weatherradar.user_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weatherradar.user__id_key" ON "weatherradar.user"("_id");

-- CreateIndex
CREATE UNIQUE INDEX "weatherradar.user_email_key" ON "weatherradar.user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "weatherradar.user_username_key" ON "weatherradar.user"("username");
