CREATE TABLE employee (
	firstname varchar(200) DEFAULT 'varchar'::character varying NOT NULL,
	lastname varchar(200) DEFAULT 'varchar'::character varying NOT NULL,
	email varchar(400) DEFAULT 'varchar'::character varying NOT NULL,
	"password" varchar(2000) DEFAULT 'varchar'::character varying NOT NULL,
	gender varchar(200) DEFAULT 'varchar'::character varying NOT NULL,
	job_role varchar(800) DEFAULT 'varchar'::character varying NOT NULL,
	department varchar(800) DEFAULT 'varchar'::character varying NOT NULL,
	address varchar(5000) DEFAULT 'varchar'::character varying NOT NULL,
	employeeid serial NOT NULL,
	PRIMARY KEY (employeeid)
);