-- Inventory Creation
drop table if exists inventory_tags;
drop table if exists inventory_images;
drop table if exists inventory;
create table inventory (
	id integer auto_increment,
    name varchar(255),
    color varchar(255),
    brand varchar(255),
    intensity integer,
    initial_amount integer,
    remaining_amount integer,
    single_amount integer,
    primary key (id)
);
create table inventory_tags (
	tag_id integer,
	inventory_id integer,
    tag varchar(255),
    primary key (tag_id),
    constraint inv_tag_unique UNIQUE (inventory_id, tag),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) on delete cascade on update cascade
);
create table inventory_images (
	image_id integer auto_increment,
	inventory_id integer,
    image text,
    primary key (image_id),
    foreign key (inventory_id) references inventory(id) on delete cascade on update cascade
);

-- Instruction Creation
drop table if exists instruction_images;
drop table if exists instructions;
create table instructions (
	id integer auto_increment,
    title varchar(255),
    text text,
    primary key(id)
);

create table instruction_images (
	image_id integer auto_increment,
	instruction_id integer,
    image text,
    primary key (image_id),
    foreign key (instruction_id) references instructions(id) on delete cascade on update cascade
);

-- User Creation
create table USER (
	id integer auto_increment,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(255),
    password varchar(100),
    primary key(id),
    unique(email)
);