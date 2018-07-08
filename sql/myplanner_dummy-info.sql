#Inserting dummy/test information
INSERT INTO users (first_name, last_name, email_address, password_hash)
	VALUES ('John', 'Smith', 'test@email.com', 'hashy-hash!');

INSERT INTO calendar_events (user_id, start_datetime, end_datetime, title, notes, rep_stop_date, rep_day_month, rep_day_week, active, event_type, amount, job_id)
	VALUES (
		(SELECT user_id FROM users WHERE first_name='John' AND last_name='Smith'),
		'2018-07-25 13:00:00',
		'2018-07-25 14:00:00',
		"Test Event",
		"This a note test for taking notes and stuff. This is only a test. Blah blah blah.",
		NULL,
		NULL,
		NULL,
		TRUE,
		'event',
		NULL,
		NULL
	);
		