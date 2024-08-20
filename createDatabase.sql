create database if not exists navgo_db;

use navgo_db;

create table if not exists buildings(
    building_id int auto_increment primary key,
    building_name varchar(50),
    description varchar(100),
    soft_delete bool default false
);

create table if not exists location_types(
    type_id int auto_increment primary key,
    type_name varchar(50),
    description varchar(100),
    soft_delete bool default false
);

create table if not exists locations(
    location_id int auto_increment primary key,
    campus varchar(100),
    building_id int,
    floor_number int,
    location_type_id int,
    location_name varchar(50),
    description varchar(200),
    open_time timestamp default current_timestamp,
    closing_time timestamp default current_timestamp,
    soft_delete bool default false,
    foreign key (building_id) references buildings(building_id),
    foreign key (location_type_id) references location_types(type_id)
);

create table if not exists users(
    user_id int auto_increment primary key,
    first_name varchar(50),
    last_name varchar(150),
    nick_name varchar(50),
    email varchar(200) unique,
    password_hash varchar(255),
    user_type varchar(50),
    photo_id varchar(255),
    soft_delete bool default false
);

create table if not exists courses(
    course_id int auto_increment primary key,
    course_name varchar(100),
    module_qnt int,
    coordinator_id int,
    soft_delete bool default false,
    foreign key (coordinator_id) references users(user_id)
);

create table if not exists modules(
    module_id int auto_increment primary key,
    course_id int,
    module_number int, 
    module_name varchar(5),
    soft_delete bool default false,
    foreign key (course_id) references courses(course_id)
);

create table if not exists subjects(
    subject_id int auto_increment primary key,
    subject_name varchar(100),
    module_id int,
    soft_delete bool default false,
    foreign key (module_id) references modules(module_id)
);

create table if not exists classes(
    class_id int auto_increment primary key,
    subject_id int,
    start_hour time,
    end_hour time,
    week_day int,
    teacher_id int,
    soft_delete bool default false,
    foreign key (teacher_id) references users(user_id),
    foreign key (subject_id) references subjects(subject_id)
);

create table if not exists periods(
    period_id int auto_increment primary key,
    start_hour time,
    end_hour time,
    day_time varchar(20),
    soft_delete bool default false
);

create table if not exists course_periods(
    course_id int,
    period_id int,
    soft_delete bool default false,
    primary key (course_id, period_id),
    foreign key (course_id) references courses(course_id),
    foreign key (period_id) references periods(period_id)
);

create table if not exists students(
    student_id int auto_increment primary key,
    user_id int,
    course_id int,
    soft_delete bool default false,
    foreign key (user_id) references users(user_id),
    foreign key (course_id) references courses(course_id)
);

create table if not exists class_info(
    relation_id int auto_increment primary key,
    course_id int,
    class_id int,
    location_id int,
    soft_delete bool default false,
    foreign key (course_id) references courses(course_id),
    foreign key (class_id) references classes(class_id),
    foreign key (location_id) references locations(location_id)
);

create table if not exists student_info(
    student_id int,
    relation_id int,
    soft_delete bool default false,
    primary key (student_id, relation_id),
    foreign key (student_id) references students(student_id),
    foreign key (relation_id) references class_info(relation_id)
);

create table if not exists verification_codes(
    id int auto_increment primary key,
    code varchar(10) not null,
    user_id int not null,
    foreign key (user_id) references users(user_id)
);

create table if not exists student_modules(
    student_id int,
    module_id int,
    soft_delete bool default false,
    primary key (student_id, module_id),
    foreign key (student_id) references students(student_id),
    foreign key (module_id) references modules(module_id)
);

#Duas tabelas novas adicionadas, e tabelas antigas alteradas. Apenas a lógica de modules foi afetada
#pois na base antiga module era citado em 2 lugares diferentes, e mesmo assim não era atrelaçado ao usuário
#e a inserção de módulo em matéria só não fazia sentido, o back não irá mudar muito pois o campo "modules" ainda existe
#em subjects, mas agora é uma chave estrangeira. 