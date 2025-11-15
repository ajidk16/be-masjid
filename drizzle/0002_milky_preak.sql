CREATE TABLE "refModules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(40) NOT NULL,
	CONSTRAINT "refModules_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "refPermissions" (
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
DROP TABLE "modules" CASCADE;--> statement-breakpoint
DROP TABLE "permissions" CASCADE;--> statement-breakpoint
ALTER TABLE "refPermissions" ADD CONSTRAINT "refPermissions_module_id_refModules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."refModules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refPermissions" ADD CONSTRAINT "refPermissions_role_id_ref_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."ref_roles"("id") ON DELETE cascade ON UPDATE no action;