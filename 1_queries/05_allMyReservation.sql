select reservations.id, properties.title, properties.id, start_date, cost_per_night, avg(rating) as average_rating
from reservations 
join properties on reservations.property_id=properties.id
join property_reviews on property_reviews.property_id = properties.id
where reservations.guest_id = 1
group by properties.id, reservations.id
order by start_date
limit 10;