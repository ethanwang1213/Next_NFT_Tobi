CREATE DATABASE native_app_db;

\c native_app_db;

DROP TABLE IF EXISTS sample;
CREATE TABLE tobiratory_account (
	uuid varchar(100) NOT NULL PRIMARY KEY,
	user_id varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  icon_url varchar(255) NOT NULL,
	created_date_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

