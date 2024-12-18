CREATE TABLE users (
	id int PRIMARY KEY AUTO_INCREMENT,
	uuid varchar(1000),
	puuid varchar(255),
	email varchar(255) NOT NULL,
	name varchar(255) NOT NULL,
  nickname varchar(255)
);
CREATE TABLE chating_rooms (
  id int PRIMARY KEY AUTO_INCREMENT,
  title varchar(255) NOT NULL
);
CREATE TABLE room_members (
	room_id int,
	user_id int,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES chating_rooms (id) ON DELETE CASCADE
);

CREATE TABLE messages (
	id int PRIMARY KEY AUTO_INCREMENT,
	room_id int,
	sender_id int,
	content varchar(255) NOT NULL,
	created_at timestamp default NOW(),
  FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES chating_rooms (id) ON DELETE CASCADE
);

CREATE TABLE posts (
	id int PRIMARY KEY AUTO_INCREMENT,
	user_id int,
	title varchar(255) NOT NULL,
	content varchar(255),
	views int default 0,
	created_at timestamp default NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE comments (
	id int PRIMARY KEY AUTO_INCREMENT,
	user_id int,
	post_id int,
	content varchar(255) NOT NULL,
	created_at timestamp default NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);
