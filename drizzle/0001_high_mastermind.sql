CREATE TABLE "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(40) NOT NULL,
	CONSTRAINT "modules_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "roles_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "roles_permissions" CASCADE;--> statement-breakpoint
ALTER TABLE "permissions" RENAME COLUMN "code" TO "module_id";--> statement-breakpoint
ALTER TABLE "permissions" RENAME COLUMN "label" TO "member_id";--> statement-breakpoint
ALTER TABLE "permissions" RENAME COLUMN "description" TO "can_read";--> statement-breakpoint
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_code_unique";--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "can_create" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "can_update" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "can_delete" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "can_manage" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;