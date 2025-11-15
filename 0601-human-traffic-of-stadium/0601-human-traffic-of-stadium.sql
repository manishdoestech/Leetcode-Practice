WITH FilteredStadium AS (
    SELECT *
    FROM Stadium
    WHERE people >= 100
),
ConsecutiveCheck AS (
    SELECT 
        *,
        LAG(id, 1) OVER (ORDER BY id) AS prev_id_1,
        LAG(id, 2) OVER (ORDER BY id) AS prev_id_2,
        LEAD(id, 1) OVER (ORDER BY id) AS next_id_1,
        LEAD(id, 2) OVER (ORDER BY id) AS next_id_2
    FROM FilteredStadium
)
SELECT 
    id, 
    visit_date, 
    people
FROM ConsecutiveCheck
WHERE
    (next_id_1 = id + 1 AND next_id_2 = id + 2) 
    OR (prev_id_1 = id - 1 AND next_id_1 = id + 1) 
    OR (prev_id_1 = id - 1 AND prev_id_2 = id - 2)
ORDER BY visit_date;