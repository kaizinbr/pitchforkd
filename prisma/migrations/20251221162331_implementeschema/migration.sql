-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "encryptedPassword" VARCHAR(255),
    "image" TEXT,
    "created_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT DEFAULT gen_random_uuid(),
    "name" TEXT,
    "avatarUrl" TEXT DEFAULT 'b62ffbe8-65b6-4c0f-85c3-8ddb41c1c1b2-0.9841619793258353.jpg',
    "lowername" TEXT,
    "bio" TEXT,
    "pronouns" TEXT,
    "site" TEXT,
    "color" TEXT DEFAULT '#cb160f',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "favorites" JSONB NOT NULL DEFAULT '[{"albuns": [], "artists": []}]',
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" INTEGER NOT NULL,
    "followerId" UUID,
    "followedId" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID,
    "ratingId" UUID,
    "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "user_profile" UUID,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ratingId" UUID,
    "type" TEXT,
    "seen" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT (now() AT TIME ZONE 'utc'::text),
    "senderId" UUID,
    "userId" UUID,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "albumId" VARCHAR,
    "ratings" JSONB,
    "review" VARCHAR,
    "userId" UUID DEFAULT gen_random_uuid(),
    "total" DECIMAL NOT NULL DEFAULT 0,
    "shorten" TEXT,
    "content" JSONB NOT NULL DEFAULT '{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "", "type": "text"}]}]}',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenOTP" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(6),
    "expires" TIMESTAMP(6) NOT NULL,
    "identifier" TEXT NOT NULL,

    CONSTRAINT "TokenOTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_shorten_key" ON "Rating"("shorten");

-- CreateIndex
CREATE UNIQUE INDEX "TokenOTP_token_key" ON "TokenOTP"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TokenOTP_identifier_key" ON "TokenOTP"("identifier");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "likes_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "likes_user_profile_fkey" FOREIGN KEY ("user_profile") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "notifications_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
