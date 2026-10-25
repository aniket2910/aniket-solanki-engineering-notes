-- LeetCode "SQL 50" study plan: every problem's tables with LeetCode's example rows.
-- Notes: INTERVIEW_PREP/POSTGRES/LEETCODE_SQL_50/
--
-- Each problem lives in its OWN schema named after the LeetCode number (lc1757, lc584 ...),
-- because LeetCode reuses table names (Employee, Products, Users, Activity...) with different
-- columns. Inside a query file: SET search_path TO lc1757;  then use the plain table names.
--
-- Column names are written the LeetCode way (recordDate, managerId). Postgres folds unquoted
-- names to lowercase, so recordDate and recorddate are the same column and both spellings work.
-- A few extra "edge" rows (marked) are added where LeetCode's hidden tests usually bite.

-- ───────────────────────────── 1. Select ─────────────────────────────

CREATE SCHEMA lc1757; SET search_path TO lc1757;  -- Recyclable and Low Fat Products
CREATE TABLE Products (product_id int PRIMARY KEY, low_fats char(1), recyclable char(1));
INSERT INTO Products VALUES (0,'Y','N'),(1,'Y','Y'),(2,'N','Y'),(3,'Y','Y'),(4,'N','N');

CREATE SCHEMA lc584; SET search_path TO lc584;  -- Find Customer Referee
CREATE TABLE Customer (id int PRIMARY KEY, name text, referee_id int);
INSERT INTO Customer VALUES (1,'Will',NULL),(2,'Jane',NULL),(3,'Alex',2),(4,'Bill',NULL),(5,'Zack',1),(6,'Mark',2);

CREATE SCHEMA lc595; SET search_path TO lc595;  -- Big Countries
CREATE TABLE World (name text PRIMARY KEY, continent text, area int, population int, gdp bigint);
INSERT INTO World VALUES
  ('Afghanistan','Asia',652230,25500100,20343000000),
  ('Albania','Europe',28748,2831741,12960000000),
  ('Algeria','Africa',2381741,37100000,188681000000),
  ('Andorra','Europe',468,78115,3712000000),
  ('Angola','Africa',1246700,20609294,100990000000);

CREATE SCHEMA lc1148; SET search_path TO lc1148;  -- Article Views I
CREATE TABLE Views (article_id int, author_id int, viewer_id int, view_date date);
INSERT INTO Views VALUES
  (1,3,5,'2019-08-01'),(1,3,6,'2019-08-02'),(2,7,7,'2019-08-01'),(2,7,6,'2019-08-02'),
  (4,7,1,'2019-07-22'),(3,4,4,'2019-07-21'),(3,4,4,'2019-07-21');

CREATE SCHEMA lc1683; SET search_path TO lc1683;  -- Invalid Tweets
CREATE TABLE Tweets (tweet_id int PRIMARY KEY, content varchar);
INSERT INTO Tweets VALUES (1,'Let us Code'),(2,'More than fifteen chars are here!');

-- ─────────────────────────── 2. Basic Joins ───────────────────────────

CREATE SCHEMA lc1378; SET search_path TO lc1378;  -- Replace Employee ID With The Unique Identifier
CREATE TABLE Employees (id int PRIMARY KEY, name text);
CREATE TABLE EmployeeUNI (id int, unique_id int, PRIMARY KEY (id, unique_id));
INSERT INTO Employees VALUES (1,'Alice'),(7,'Bob'),(11,'Meir'),(90,'Winston'),(3,'Jonathan');
INSERT INTO EmployeeUNI VALUES (3,1),(11,2),(90,3);

CREATE SCHEMA lc1068; SET search_path TO lc1068;  -- Product Sales Analysis I
CREATE TABLE Product (product_id int PRIMARY KEY, product_name text);
CREATE TABLE Sales (sale_id int, product_id int, year int, quantity int, price int, PRIMARY KEY (sale_id, year));
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');
INSERT INTO Sales VALUES (1,100,2008,10,5000),(2,100,2009,12,5000),(7,200,2011,15,9000);

CREATE SCHEMA lc1581; SET search_path TO lc1581;  -- Customer Who Visited but Did Not Make Any Transactions
CREATE TABLE Visits (visit_id int PRIMARY KEY, customer_id int);
CREATE TABLE Transactions (transaction_id int PRIMARY KEY, visit_id int, amount int);
INSERT INTO Visits VALUES (1,23),(2,9),(4,30),(5,54),(6,96),(7,54),(8,54);
INSERT INTO Transactions VALUES (2,5,310),(3,5,300),(9,5,200),(12,1,910),(13,2,970);

CREATE SCHEMA lc197; SET search_path TO lc197;  -- Rising Temperature
CREATE TABLE Weather (id int PRIMARY KEY, recordDate date, temperature int);
INSERT INTO Weather VALUES (1,'2015-01-01',10),(2,'2015-01-02',25),(3,'2015-01-03',20),(4,'2015-01-04',30);
-- edge: a gap in the dates. Day 6 is warmer than day 4, but they are not consecutive days.
INSERT INTO Weather VALUES (5,'2015-01-06',35);

CREATE SCHEMA lc1661; SET search_path TO lc1661;  -- Average Time of Process per Machine
CREATE TABLE Activity (machine_id int, process_id int, activity_type text, timestamp float,
                       PRIMARY KEY (machine_id, process_id, activity_type));
INSERT INTO Activity VALUES
  (0,0,'start',0.712),(0,0,'end',1.520),(0,1,'start',3.140),(0,1,'end',4.120),
  (1,0,'start',0.550),(1,0,'end',1.550),(1,1,'start',0.430),(1,1,'end',1.420),
  (2,0,'start',4.100),(2,0,'end',4.512),(2,1,'start',2.500),(2,1,'end',5.000);

CREATE SCHEMA lc577; SET search_path TO lc577;  -- Employee Bonus
CREATE TABLE Employee (empId int PRIMARY KEY, name text, supervisor int, salary int);
CREATE TABLE Bonus (empId int PRIMARY KEY, bonus int);
INSERT INTO Employee VALUES (3,'Brad',NULL,4000),(1,'John',3,1000),(2,'Dan',3,2000),(4,'Thomas',3,4000);
INSERT INTO Bonus VALUES (2,500),(4,2000);

CREATE SCHEMA lc1280; SET search_path TO lc1280;  -- Students and Examinations
CREATE TABLE Students (student_id int PRIMARY KEY, student_name text);
CREATE TABLE Subjects (subject_name text PRIMARY KEY);
CREATE TABLE Examinations (student_id int, subject_name text);
INSERT INTO Students VALUES (1,'Alice'),(2,'Bob'),(13,'John'),(6,'Alex');
INSERT INTO Subjects VALUES ('Math'),('Physics'),('Programming');
INSERT INTO Examinations VALUES
  (1,'Math'),(1,'Physics'),(1,'Programming'),(2,'Programming'),(1,'Physics'),(1,'Math'),
  (13,'Math'),(13,'Programming'),(13,'Physics'),(2,'Math'),(1,'Math');

CREATE SCHEMA lc570; SET search_path TO lc570;  -- Managers with at Least 5 Direct Reports
CREATE TABLE Employee (id int PRIMARY KEY, name text, department text, managerId int);
INSERT INTO Employee VALUES
  (101,'John','A',NULL),(102,'Dan','A',101),(103,'James','A',101),
  (104,'Amy','A',101),(105,'Anne','A',101),(106,'Ron','B',101);

CREATE SCHEMA lc1934; SET search_path TO lc1934;  -- Confirmation Rate
CREATE TABLE Signups (user_id int PRIMARY KEY, time_stamp timestamp);
CREATE TABLE Confirmations (user_id int, time_stamp timestamp, action text, PRIMARY KEY (user_id, time_stamp));
INSERT INTO Signups VALUES
  (3,'2020-03-21 10:16:13'),(7,'2020-01-04 13:57:59'),(2,'2020-07-29 23:09:44'),(6,'2020-12-09 10:39:37');
INSERT INTO Confirmations VALUES
  (3,'2021-01-06 03:30:46','timeout'),(3,'2021-07-14 14:00:00','timeout'),
  (7,'2021-06-12 11:57:29','confirmed'),(7,'2021-06-13 12:58:28','confirmed'),
  (7,'2021-06-14 13:59:27','confirmed'),(2,'2021-01-22 00:00:00','confirmed'),
  (2,'2021-02-28 23:59:59','timeout');

-- ─────────────────────── 3. Basic Aggregate Functions ───────────────────────

CREATE SCHEMA lc620; SET search_path TO lc620;  -- Not Boring Movies
CREATE TABLE Cinema (id int PRIMARY KEY, movie text, description text, rating numeric(2,1));
INSERT INTO Cinema VALUES
  (1,'War','great 3D',8.9),(2,'Science','fiction',8.5),(3,'irish','boring',6.2),
  (4,'Ice song','Fantacy',8.6),(5,'House card','Interesting',9.1);

CREATE SCHEMA lc1251; SET search_path TO lc1251;  -- Average Selling Price
CREATE TABLE Prices (product_id int, start_date date, end_date date, price int,
                     PRIMARY KEY (product_id, start_date, end_date));
CREATE TABLE UnitsSold (product_id int, purchase_date date, units int);
INSERT INTO Prices VALUES
  (1,'2019-02-17','2019-02-28',5),(1,'2019-03-01','2019-03-22',20),
  (2,'2019-02-01','2019-02-20',15),(2,'2019-02-21','2019-03-31',30);
INSERT INTO UnitsSold VALUES (1,'2019-02-25',100),(1,'2019-03-01',15),(2,'2019-02-10',200),(2,'2019-03-22',30);
-- edge: a product with a price but no sales must still appear, with average_price 0.
INSERT INTO Prices VALUES (3,'2019-02-21','2019-03-31',10);

CREATE SCHEMA lc1075; SET search_path TO lc1075;  -- Project Employees I
CREATE TABLE Project (project_id int, employee_id int, PRIMARY KEY (project_id, employee_id));
CREATE TABLE Employee (employee_id int PRIMARY KEY, name text, experience_years int);
INSERT INTO Project VALUES (1,1),(1,2),(1,3),(2,1),(2,4);
INSERT INTO Employee VALUES (1,'Khaled',3),(2,'Ali',2),(3,'John',1),(4,'Doe',2);

CREATE SCHEMA lc1633; SET search_path TO lc1633;  -- Percentage of Users Attended a Contest
CREATE TABLE Users (user_id int PRIMARY KEY, user_name text);
CREATE TABLE Register (contest_id int, user_id int, PRIMARY KEY (contest_id, user_id));
INSERT INTO Users VALUES (6,'Alice'),(2,'Bob'),(7,'Alex');
INSERT INTO Register VALUES
  (215,6),(209,2),(208,2),(210,6),(208,6),(209,7),(209,6),(215,7),(208,7),(210,2),(207,2),(210,7);

CREATE SCHEMA lc1211; SET search_path TO lc1211;  -- Queries Quality and Percentage
CREATE TABLE Queries (query_name text, result text, position int, rating int);
INSERT INTO Queries VALUES
  ('Dog','Golden Retriever',1,5),('Dog','German Shepherd',2,5),('Dog','Mule',200,1),
  ('Cat','Shirazi',5,2),('Cat','Siamese',3,3),('Cat','Sphynx',7,4);

CREATE SCHEMA lc1193; SET search_path TO lc1193;  -- Monthly Transactions I
CREATE TABLE Transactions (id int PRIMARY KEY, country text, state text, amount int, trans_date date);
INSERT INTO Transactions VALUES
  (121,'US','approved',1000,'2018-12-18'),(122,'US','declined',2000,'2018-12-19'),
  (123,'US','approved',2000,'2019-01-01'),(124,'DE','approved',2000,'2019-01-07');

CREATE SCHEMA lc1174; SET search_path TO lc1174;  -- Immediate Food Delivery II
CREATE TABLE Delivery (delivery_id int PRIMARY KEY, customer_id int, order_date date, customer_pref_delivery_date date);
INSERT INTO Delivery VALUES
  (1,1,'2019-08-01','2019-08-02'),(2,2,'2019-08-02','2019-08-02'),(3,1,'2019-08-11','2019-08-12'),
  (4,3,'2019-08-24','2019-08-24'),(5,3,'2019-08-21','2019-08-22'),(6,2,'2019-08-11','2019-08-13'),
  (7,4,'2019-08-09','2019-08-09');

CREATE SCHEMA lc550; SET search_path TO lc550;  -- Game Play Analysis IV
CREATE TABLE Activity (player_id int, device_id int, event_date date, games_played int,
                       PRIMARY KEY (player_id, event_date));
INSERT INTO Activity VALUES
  (1,2,'2016-03-01',5),(1,2,'2016-03-02',6),(2,3,'2017-06-25',1),(3,1,'2016-03-02',0),(3,4,'2018-07-03',5);

-- ─────────────────────── 4. Sorting and Grouping ───────────────────────

CREATE SCHEMA lc2356; SET search_path TO lc2356;  -- Number of Unique Subjects Taught by Each Teacher
CREATE TABLE Teacher (teacher_id int, subject_id int, dept_id int, PRIMARY KEY (subject_id, dept_id));
INSERT INTO Teacher VALUES (1,2,3),(1,2,4),(1,3,3),(2,1,1),(2,2,1),(2,3,1),(2,4,1);

CREATE SCHEMA lc1141; SET search_path TO lc1141;  -- User Activity for the Past 30 Days I
CREATE TABLE Activity (user_id int, session_id int, activity_date date, activity_type text);
INSERT INTO Activity VALUES
  (1,1,'2019-07-20','open_session'),(1,1,'2019-07-20','scroll_down'),(1,1,'2019-07-20','end_session'),
  (2,4,'2019-07-20','open_session'),(2,4,'2019-07-21','send_message'),(2,4,'2019-07-21','end_session'),
  (3,2,'2019-07-21','open_session'),(3,2,'2019-07-21','send_message'),(3,2,'2019-07-21','end_session'),
  (4,3,'2019-06-25','open_session'),(4,3,'2019-06-25','end_session');

CREATE SCHEMA lc1070; SET search_path TO lc1070;  -- Product Sales Analysis III
CREATE TABLE Product (product_id int PRIMARY KEY, product_name text);
CREATE TABLE Sales (sale_id int, product_id int, year int, quantity int, price int, PRIMARY KEY (sale_id, year));
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');
INSERT INTO Sales VALUES (1,100,2008,10,5000),(2,100,2009,12,5000),(7,200,2011,15,9000);
-- edge: two sales of product 200 in its first year. BOTH rows must come back.
INSERT INTO Sales VALUES (8,200,2011,3,8500);

CREATE SCHEMA lc596; SET search_path TO lc596;  -- Classes With at Least 5 Students
CREATE TABLE Courses (student text, class text, PRIMARY KEY (student, class));
INSERT INTO Courses VALUES
  ('A','Math'),('B','English'),('C','Math'),('D','Biology'),('E','Math'),
  ('F','Computer'),('G','Math'),('H','Math'),('I','Math');

CREATE SCHEMA lc1729; SET search_path TO lc1729;  -- Find Followers Count
CREATE TABLE Followers (user_id int, follower_id int, PRIMARY KEY (user_id, follower_id));
INSERT INTO Followers VALUES (0,1),(1,0),(2,0),(2,1);

CREATE SCHEMA lc619; SET search_path TO lc619;  -- Biggest Single Number
CREATE TABLE MyNumbers (num int);
INSERT INTO MyNumbers VALUES (8),(8),(3),(3),(1),(4),(5),(6);

CREATE SCHEMA lc1045; SET search_path TO lc1045;  -- Customers Who Bought All Products
CREATE TABLE Product (product_key int PRIMARY KEY);
CREATE TABLE Customer (customer_id int, product_key int);
INSERT INTO Product VALUES (5),(6);
INSERT INTO Customer VALUES (1,5),(2,6),(3,5),(3,6),(1,6);
-- edge: customer 2 buys product 6 twice. Two rows, but still only ONE distinct product.
INSERT INTO Customer VALUES (2,6);

-- ─────────────────────── 5. Advanced Select and Joins ───────────────────────

CREATE SCHEMA lc1731; SET search_path TO lc1731;  -- The Number of Employees Which Report to Each Employee
CREATE TABLE Employees (employee_id int PRIMARY KEY, name text, reports_to int, age int);
INSERT INTO Employees VALUES (9,'Hercy',NULL,43),(6,'Alice',9,41),(4,'Bob',9,36),(2,'Winston',NULL,37);

CREATE SCHEMA lc1789; SET search_path TO lc1789;  -- Primary Department for Each Employee
CREATE TABLE Employee (employee_id int, department_id int, primary_flag char(1), PRIMARY KEY (employee_id, department_id));
INSERT INTO Employee VALUES (1,1,'N'),(2,1,'Y'),(2,2,'N'),(3,3,'N'),(4,2,'N'),(4,3,'Y'),(4,4,'N');

CREATE SCHEMA lc610; SET search_path TO lc610;  -- Triangle Judgement
CREATE TABLE Triangle (x int, y int, z int, PRIMARY KEY (x, y, z));
INSERT INTO Triangle VALUES (13,15,30),(10,20,15);

CREATE SCHEMA lc180; SET search_path TO lc180;  -- Consecutive Numbers
CREATE TABLE Logs (id int PRIMARY KEY, num int);
INSERT INTO Logs VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);

CREATE SCHEMA lc1164; SET search_path TO lc1164;  -- Product Price at a Given Date
CREATE TABLE Products (product_id int, new_price int, change_date date, PRIMARY KEY (product_id, change_date));
INSERT INTO Products VALUES
  (1,20,'2019-08-14'),(2,50,'2019-08-14'),(1,30,'2019-08-15'),
  (1,35,'2019-08-16'),(2,65,'2019-08-17'),(3,20,'2019-08-18');

CREATE SCHEMA lc1204; SET search_path TO lc1204;  -- Last Person to Fit in the Bus
CREATE TABLE Queue (person_id int PRIMARY KEY, person_name text, weight int, turn int);
INSERT INTO Queue VALUES
  (5,'Alice',250,1),(4,'Bob',175,5),(3,'Alex',350,2),(6,'John Cena',400,3),(1,'Winston',500,6),(2,'Marie',200,4);

CREATE SCHEMA lc1907; SET search_path TO lc1907;  -- Count Salary Categories
CREATE TABLE Accounts (account_id int PRIMARY KEY, income int);
INSERT INTO Accounts VALUES (3,108939),(2,12747),(8,87709),(6,91796);

-- ─────────────────────────── 6. Subqueries ───────────────────────────

CREATE SCHEMA lc1978; SET search_path TO lc1978;  -- Employees Whose Manager Left the Company
CREATE TABLE Employees (employee_id int PRIMARY KEY, name text, manager_id int, salary int);
INSERT INTO Employees VALUES
  (3,'Mila',9,60301),(12,'Antonella',NULL,31000),(13,'Emery',NULL,67084),
  (1,'Kalel',11,21241),(9,'Mikaela',NULL,50937),(11,'Joziah',6,28485);

CREATE SCHEMA lc626; SET search_path TO lc626;  -- Exchange Seats
CREATE TABLE Seat (id int PRIMARY KEY, student text);
INSERT INTO Seat VALUES (1,'Abbot'),(2,'Doris'),(3,'Emerson'),(4,'Green'),(5,'Jeames');

CREATE SCHEMA lc1341; SET search_path TO lc1341;  -- Movie Rating
CREATE TABLE Movies (movie_id int PRIMARY KEY, title text);
CREATE TABLE Users (user_id int PRIMARY KEY, name text);
CREATE TABLE MovieRating (movie_id int, user_id int, rating int, created_at date, PRIMARY KEY (movie_id, user_id));
INSERT INTO Movies VALUES (1,'Avengers'),(2,'Frozen 2'),(3,'Joker');
INSERT INTO Users VALUES (1,'Daniel'),(2,'Monica'),(3,'Maria'),(4,'James');
INSERT INTO MovieRating VALUES
  (1,1,3,'2020-01-12'),(1,2,4,'2020-02-11'),(1,3,2,'2020-02-12'),(1,4,1,'2020-01-01'),
  (2,1,5,'2020-02-17'),(2,2,2,'2020-02-01'),(2,3,2,'2020-03-01'),
  (3,1,3,'2020-02-22'),(3,2,4,'2020-02-25');

CREATE SCHEMA lc1321; SET search_path TO lc1321;  -- Restaurant Growth
CREATE TABLE Customer (customer_id int, name text, visited_on date, amount int, PRIMARY KEY (customer_id, visited_on));
INSERT INTO Customer VALUES
  (1,'Jhon','2019-01-01',100),(2,'Daniel','2019-01-02',110),(3,'Jade','2019-01-03',120),
  (4,'Khaled','2019-01-04',130),(5,'Winston','2019-01-05',110),(6,'Elvis','2019-01-06',140),
  (7,'Anna','2019-01-07',150),(8,'Maria','2019-01-08',80),(9,'Jaze','2019-01-09',110),
  (1,'Jhon','2019-01-10',130),(3,'Jade','2019-01-10',150);

CREATE SCHEMA lc602; SET search_path TO lc602;  -- Friend Requests II: Who Has the Most Friends
CREATE TABLE RequestAccepted (requester_id int, accepter_id int, accept_date date, PRIMARY KEY (requester_id, accepter_id));
INSERT INTO RequestAccepted VALUES (1,2,'2016-06-03'),(1,3,'2016-06-08'),(2,3,'2016-06-08'),(3,4,'2016-06-09');

CREATE SCHEMA lc585; SET search_path TO lc585;  -- Investments in 2016
CREATE TABLE Insurance (pid int PRIMARY KEY, tiv_2015 float, tiv_2016 float, lat float, lon float);
INSERT INTO Insurance VALUES (1,10,5,10,10),(2,20,20,20,20),(3,10,30,20,20),(4,10,40,40,40);

CREATE SCHEMA lc185; SET search_path TO lc185;  -- Department Top Three Salaries
CREATE TABLE Department (id int PRIMARY KEY, name text);
CREATE TABLE Employee (id int PRIMARY KEY, name text, salary int, departmentId int);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');
INSERT INTO Employee VALUES
  (1,'Joe',85000,1),(2,'Henry',80000,2),(3,'Sam',60000,2),(4,'Max',90000,1),
  (5,'Janet',69000,1),(6,'Randy',85000,1),(7,'Will',70000,1);

-- ───────────────── 7. Advanced String Functions / Regex / Clause ─────────────────

CREATE SCHEMA lc1667; SET search_path TO lc1667;  -- Fix Names in a Table
CREATE TABLE Users (user_id int PRIMARY KEY, name text);
INSERT INTO Users VALUES (1,'aLice'),(2,'bOB');

CREATE SCHEMA lc1527; SET search_path TO lc1527;  -- Patients With a Condition
CREATE TABLE Patients (patient_id int PRIMARY KEY, patient_name text, conditions text);
INSERT INTO Patients VALUES
  (1,'Daniel','YFEV COUGH'),(2,'Alice',''),(3,'Bob','DIAB100 MYOP'),(4,'George','ACNE DIAB100'),(5,'Alain','DIAB201');
-- edge: DIAB1 inside another word is NOT a match. A plain LIKE '%DIAB1%' wrongly returns this row.
INSERT INTO Patients VALUES (6,'Trap','SADIAB100');

CREATE SCHEMA lc196; SET search_path TO lc196;  -- Delete Duplicate Emails
CREATE TABLE Person (id int PRIMARY KEY, email text);
INSERT INTO Person VALUES (1,'john@example.com'),(2,'bob@example.com'),(3,'john@example.com');

CREATE SCHEMA lc176; SET search_path TO lc176;  -- Second Highest Salary
CREATE TABLE Employee (id int PRIMARY KEY, salary int);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300);

CREATE SCHEMA lc1484; SET search_path TO lc1484;  -- Group Sold Products By The Date
CREATE TABLE Activities (sell_date date, product text);
INSERT INTO Activities VALUES
  ('2020-05-30','Headphone'),('2020-06-01','Pencil'),('2020-06-02','Mask'),('2020-05-30','Basketball'),
  ('2020-06-01','Bible'),('2020-06-02','Mask'),('2020-05-30','T-Shirt');

CREATE SCHEMA lc1327; SET search_path TO lc1327;  -- List the Products Ordered in a Period
CREATE TABLE Products (product_id int PRIMARY KEY, product_name text, product_category text);
CREATE TABLE Orders (product_id int, order_date date, unit int);
INSERT INTO Products VALUES
  (1,'Leetcode Solutions','Book'),(2,'Jewels of Stringology','Book'),(3,'HP','Laptop'),
  (4,'Lenovo','Laptop'),(5,'Leetcode Kit','T-shirt');
INSERT INTO Orders VALUES
  (1,'2020-02-05',60),(1,'2020-02-10',70),(2,'2020-01-18',30),(2,'2020-02-11',80),
  (3,'2020-02-17',2),(3,'2020-02-24',3),(4,'2020-03-01',20),(4,'2020-03-04',30),(4,'2020-03-04',60),
  (5,'2020-02-25',50),(5,'2020-02-27',50),(5,'2020-03-01',50);

CREATE SCHEMA lc1517; SET search_path TO lc1517;  -- Find Users With Valid E-Mails
CREATE TABLE Users (user_id int PRIMARY KEY, name text, mail text);
INSERT INTO Users VALUES
  (1,'Winston','winston@leetcode.com'),(2,'Jonathan','jonathanisgreat'),(3,'Annabelle','bella-@leetcode.com'),
  (4,'Sally','sally.come@leetcode.com'),(5,'Marwan','quarz#2020@leetcode.com'),(6,'David','david69@gmail.com'),
  (7,'Shapiro','.shapo@leetcode.com');
-- edge: the domain must be EXACTLY leetcode.com. An unescaped dot would also accept "leetcodeXcom".
INSERT INTO Users VALUES (8,'Dot','dot@leetcodeXcom');

-- Back to the default schema so the shop tables resolve normally for every other query file.
RESET search_path;
