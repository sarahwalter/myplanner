DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS todo;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	email_address VARCHAR(100) NOT NULL UNIQUE,
	password_hash VARCHAR(256) NOT NULL
	#user_status intentionall omitted here - this will be implemented in a production environment
)ENGINE=INNODB;

CREATE TABLE todo (
	todo_id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	todo_date DATETIME NOT NULL,
	title VARCHAR(100) NOT NULL,
	notes VARCHAR(2000),
	complete BOOLEAN NOT NULL,
	datetime_complete DATETIME,
	FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)ENGINE=INNODB;

CREATE TABLE jobs (
	job_id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	title VARCHAR(100) NOT NULL,
	wage DECIMAL(12,2) NOT NULL,
	frequency ENUM('Hourly', 'Weekly', 'Monthly', 'Annually', 'Bi-Monthly', 'Bi-Weekly') NOT NULL,
	filing_status ENUM('Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household', 'Qualifying Widower') NOT NULL,
	allowances TINYINT NOT NULL,
	retirement_percent TINYINT NOT NULL,
	pretax_static INT NOT NULL,
	posttax_static INT NOT NULL,
	fed_tax_rate TINYINT NOT NULL,
	loc_tax_rate TINYINT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)ENGINE=INNODB;

CREATE TABLE calendar_events (
	event_id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	start_datetime DATETIME NOT NULL,
	end_datetime DATETIME NOT NULL,
	title VARCHAR(100) NOT NULL,
	notes VARCHAR(2000),
	isFullDay bit NOT NULL,
	rep_stop_date DATE,
	rep_day_month TINYINT,
	rep_day_week ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	active BOOLEAN NOT NULL,
	event_type ENUM('event', 'expense', 'income'),
	amount DECIMAL(12,2),
	job_id INT,
	FOREIGN KEY (user_id) REFERENCES users (user_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (job_id) REFERENCES jobs (job_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)ENGINE=INNODB;