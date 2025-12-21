-- CreateTable
CREATE TABLE "temp_users_import" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "encryptedPassword" VARCHAR(255),
    "image" TEXT,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "temp_users_import_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temp_users_import_email_key" ON "temp_users_import"("email");
