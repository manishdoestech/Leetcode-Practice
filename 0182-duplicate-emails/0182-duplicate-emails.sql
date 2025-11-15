# Write your MySQL query statement below
select DISTINCT(a.email) from Person a,Person b where a.id<>b.id and a.email=b.email; 