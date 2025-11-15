# Write your MySQL query statement below
select a.name as Employee from Employee a,Employee b where b.id=a.managerid and a.salary>b.salary;