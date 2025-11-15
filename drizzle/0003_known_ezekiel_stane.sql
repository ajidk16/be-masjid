CREATE TABLE "ref_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(40) NOT NULL,
	CONSTRAINT "ref_modules_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ref_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid,
	"role_id" uuid,
	"can_read" boolean DEFAULT false,
	"can_create" boolean DEFAULT false,
	"can_update" boolean DEFAULT false,
	"can_delete" boolean DEFAULT false,
	"can_manage" boolean DEFAULT false
);
--> statement-breakpoint
DROP TABLE "refModules" CASCADE;--> statement-breakpoint
DROP TABLE "refPermissions" CASCADE;--> statement-breakpoint
ALTER TABLE "ref_permissions" ADD CONSTRAINT "ref_permissions_module_id_ref_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."ref_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ref_permissions" ADD CONSTRAINT "ref_permissions_role_id_ref_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."ref_roles"("id") ON DELETE cascade ON UPDATE no action;