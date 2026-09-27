CREATE TABLE "teacher_likes" (
	"teacher_id" text,
	"voter_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_likes_pkey" PRIMARY KEY("teacher_id","voter_id")
);
