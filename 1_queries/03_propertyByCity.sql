select properties.id as id, title, cost_per_night, avg(rating) as average_rating, city
from properties 
join property_reviews ON property_id = properties.id
where city LIKE '%ancouv%'
group by properties.id
HAVING avg(property_reviews.rating) >= 4
order by cost_per_night
limit 10
