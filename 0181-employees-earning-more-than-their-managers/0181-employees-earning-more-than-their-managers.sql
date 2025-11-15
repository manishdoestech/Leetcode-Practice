# Write your MySQL query statement below
select a.name as Employee from Employee a,Employee b where b.id=a.managerid and a.salary>b.salary;
-- select e.name as Employee from Employee as e join Employee as n where e.managerid=n.id and e.salary>n.salary;