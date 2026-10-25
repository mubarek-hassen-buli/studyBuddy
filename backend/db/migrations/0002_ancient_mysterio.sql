CREATE TYPE "public"."session_status" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"study_buddy_id" uuid NOT NULL,
	"title" text NOT NULL,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"actual_duration_seconds" integer DEFAULT 0 NOT NULL,
	"status" "session_status" DEFAULT 'scheduled' NOT NULL,
	"target_resource_type" text DEFAULT 'general' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_study_buddy_id_study_buddies_id_fk" FOREIGN KEY ("study_buddy_id") REFERENCES "public"."study_buddies"("id") ON DELETE cascade ON UPDATE no action;