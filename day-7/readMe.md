Creating Databse 
CREATE DATABASE testday;

Creating table
//Employee Table
CREATE TABLE emp(
    employee_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(25) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	salary NUMERIC(10,2),
	available BOOLEAN NOT NULL
)

//dept table
CREATE TABLE dept (
    deptno INT PRIMARY KEY,
    dname VARCHAR(100) NOT NULL,
    loc VARCHAR(100)
);

// CREATE TABLE proects(
  project_id SERIAL PRIMARY KEY NOT NULL,
  project_name VARCHAR(100) NOT NULL,
  start_date DATE,
  end_date DATE,
  dept_no INT REFERNCES dept(deptno)
)

INSERTING DATA 
//Employee Table
INSERT INTO emp (username, email, salary,available)
VALUES
  ('Jack', 'jack@gmail.com', 100000,TRUE),
 ('rahul', 'rahul@gmail.com', 500000.55,FALSE),
 ('vinay', 'vinay@gmail.com', 300000,TRUE)


Dept table
INSERT INTO dept(deptno, dname, loc)
VALUES
  (1023,'Marketing','Banglore'),
  (5084,'HR','Mumbai'),
  (2078,'IT','Ahmedabad')

Alter table 
ALTER TABLE emp ADD COLUMN deptno INT REFERENCES dept(deptno);
Updating table 
UPDATE emp SET deptno = 1023 WHERE employee_id = 1;
UPDATE emp SET deptno = 5084 WHERE employee_id = 2;
UPDATE emp SET deptno = 2078 WHERE employee_id = 3; 


Joins

SELECT e.username,e.email,e.salary,e.available,d.dname,d.loc from 
emp e inner join dept d on e.deptno =d.deptno 


indexes

CREATE INDEX idx_emp_name ON emp(username)
EXPLAIN ANALYZE SELECT * FROM emp WHERE username='anita'
EXPLAIN ANALYZE SELECT * FROM dept WHERE dname='HR'



triggers
CREATE OR REPLACE FUNCTION auditlog()
RETURNS TRIGGER AS $$
    BEGIN
       
        INSERT INTO dept(deptno, dname, loc) 
        VALUES (NEW.employee_id, 'Auto-Generated', 'Timestamp: ' || CAST(CURRENT_TIMESTAMP AS TEXT));
        
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS example_trigger ON emp;

CREATE TRIGGER example_trigger 
AFTER INSERT ON emp
FOR EACH ROW 
EXECUTE FUNCTION auditlog();

INSERT INTO emp (username, email, salary, available) 
VALUES ('Raju', 'raju@gmail.com', 20000, false);

select * from dept where dname = 'Auto-Generated'



 views
CREATE VIEW user_details AS 
SELECT e.username, p.project_name 
FROM emp e 
JOIN projects p ON e.deptno = p.dept_no;

select * from user_details

 transactions
BEGIN; 

UPDATE emp SET salary = salary - 500 WHERE username = 'Amit';

UPDATE emp SET salary = salary + 500 WHERE username = 'Pooja';


SELECT username, salary FROM emp WHERE username IN ('Pooja', 'Amit');

COMMIT

ROLLBACK

 Stored Procedures

CREATE OR REPLACE FUNCTION SelectAllCustom()
RETURNS TABLE(
    out_id INT,
    out_username VARCHAR(100),
    out_salary NUMERIC 
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT e.employee_id, e.username, e.salary 
    FROM emp e 
    WHERE e.salary > 5000;
END;
$$;


SELECT * FROM SelectAllCustom();