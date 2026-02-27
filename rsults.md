### CHECK ONE

SELECT 
  status,
  allocated_to_job_card,
  procurement_started,
  COUNT(*) as count,
  (
    SELECT STRING_AGG(part_name || ' (' || quantity || ')', ', ' ORDER BY part_name)
    FROM (
      SELECT part_name, quantity
      FROM parts_requests pr2
      WHERE pr2.status = pr.status
        AND pr2.allocated_to_job_card = pr.allocated_to_job_card
        AND pr2.procurement_started = pr.procurement_started
        AND pr2.is_from_inventory = true
        AND pr2.inventory_id IS NOT NULL
        AND pr2.job_card_id IS NOT NULL
      LIMIT 5
    ) limited
  ) as sample_items
FROM parts_requests pr
WHERE 
  is_from_inventory = true
  AND inventory_id IS NOT NULL
  AND job_card_id IS NOT NULL
GROUP BY status, allocated_to_job_card, procurement_started
ORDER BY status, allocated_to_job_card;

## RESULTS



[
  {
    "status": "approved",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "count": 4,
    "sample_items": "10mm Speed Fittings (1), Engine Oil (15W40) (26), Spotlight Bulbs (Shacman-H13 24v 70/75w) (1), Wipers (Scania) (2)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": true,
    "count": 1,
    "sample_items": "Zimbabwe Cross Border Permit (1)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": false,
    "count": 34,
    "sample_items": "749/742 Bearings (Trailer) (4), CARGO BELTS (5), Indicator Bulbs (Scania-24v-21w) (1), Red Air Suzi house (1), TRWS002 Rear wheel studs and nuts (Shacman) (1)"
  },
  {
    "status": "pending",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "count": 10,
    "sample_items": "CARGO BELTS (5), Clutch Air Pack (Each)-29H Sino Howo 400 (1), Front Wheel Studs and Nuts (Howo) (10), Number Plates Lights (1), Sino 29H Window Winder Switch (1)"
  }
]


## CHECK TWO


SELECT 
  status,
  allocated_to_job_card,
  procurement_started,
  COUNT(*) as count,
  array_to_string(
    (array_agg(part_name || ' (' || quantity || ')' ORDER BY part_name))[1:5], 
    ', '
  ) as sample_items
FROM parts_requests
WHERE 
  is_from_inventory = true
  AND inventory_id IS NOT NULL
  AND job_card_id IS NOT NULL
GROUP BY status, allocated_to_job_card, procurement_started
ORDER BY status, allocated_to_job_card;


## RESULTS


[
  {
    "status": "approved",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "count": 4,
    "sample_items": "10mm Speed Fittings (1), Engine Oil (15W40) (26), Spotlight Bulbs (Shacman-H13 24v 70/75w) (1), Wipers (Scania) (2)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": false,
    "count": 34,
    "sample_items": "24V 21/5W SINGLE CONTACT (1), 749/742 Bearings (Trailer) (4), Air Filters (Shacman X3000 420HP) (1), Battery Water (/Ltr) (2), Battery Water (/Ltr) (1)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": true,
    "count": 1,
    "sample_items": "Zimbabwe Cross Border Permit (1)"
  },
  {
    "status": "pending",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "count": 10,
    "sample_items": "Air Bag (HENRED)/Each-8F (4), CARGO BELTS (5), Clutch Air Pack (Each)-29H Sino Howo 400 (1), Front Wheel Studs and Nuts (Howo) (10), Number Plates Lights (1)"
  }
]


### CHECK THREE

WITH grouped_data AS (
  SELECT 
    status,
    allocated_to_job_card,
    procurement_started,
    COUNT(*) as count,
    array_agg(part_name || ' (' || quantity || ')' ORDER BY part_name) as items_array
  FROM parts_requests
  WHERE 
    is_from_inventory = true
    AND inventory_id IS NOT NULL
    AND job_card_id IS NOT NULL
  GROUP BY status, allocated_to_job_card, procurement_started
)
SELECT 
  status,
  allocated_to_job_card,
  procurement_started,
  count,
  array_to_string(items_array[1:5], ', ') as sample_items
FROM grouped_data
ORDER BY status, allocated_to_job_card;


### RESULTS

[
  {
    "status": "approved",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "count": 4,
    "sample_items": "10mm Speed Fittings (1), Engine Oil (15W40) (26), Spotlight Bulbs (Shacman-H13 24v 70/75w) (1), Wipers (Scania) (2)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": false,
    "count": 34,
    "sample_items": "24V 21/5W SINGLE CONTACT (1), 749/742 Bearings (Trailer) (4), Air Filters (Shacman X3000 420HP) (1), Battery Water (/Ltr) (2), Battery Water (/Ltr) (1)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": true,
    "count": 1,
    "sample_items": "Zimbabwe Cross Border Permit (1)"
  },
  {
    "status": "pending",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "count": 10,
    "sample_items": "Air Bag (HENRED)/Each-8F (4), CARGO BELTS (5), Clutch Air Pack (Each)-29H Sino Howo 400 (1), Front Wheel Studs and Nuts (Howo) (10), Number Plates Lights (1)"
  }
]


#### CHECK FOUE


SELECT 
  status,
  allocated_to_job_card,
  procurement_started,
  COUNT(*) as total_count,
  (
    SELECT STRING_AGG(item, ', ')
    FROM (
      SELECT part_name || ' (' || quantity || ')' as item
      FROM parts_requests
      WHERE 
        is_from_inventory = true
        AND inventory_id IS NOT NULL
        AND job_card_id IS NOT NULL
        AND status = main.status
        AND (
          (main.allocated_to_job_card IS NULL AND allocated_to_job_card IS NULL) 
          OR allocated_to_job_card = main.allocated_to_job_card
        )
        AND (
          (main.procurement_started IS NULL AND procurement_started IS NULL)
          OR procurement_started = main.procurement_started
        )
      ORDER BY part_name
      LIMIT 5
    ) samples
  ) as sample_items
FROM parts_requests main
WHERE 
  is_from_inventory = true
  AND inventory_id IS NOT NULL
  AND job_card_id IS NOT NULL
GROUP BY status, allocated_to_job_card, procurement_started
ORDER BY status, allocated_to_job_card;



### RESULTS



[
  {
    "status": "approved",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "total_count": 4,
    "sample_items": "10mm Speed Fittings (1), Engine Oil (15W40) (26), Spotlight Bulbs (Shacman-H13 24v 70/75w) (1), Wipers (Scania) (2)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": true,
    "total_count": 1,
    "sample_items": "Zimbabwe Cross Border Permit (1)"
  },
  {
    "status": "fulfilled",
    "allocated_to_job_card": true,
    "procurement_started": false,
    "total_count": 34,
    "sample_items": "24V 21/5W SINGLE CONTACT (1), 749/742 Bearings (Trailer) (4), Air Filters (Shacman X3000 420HP) (1), Battery Water (/Ltr) (2), Battery Water (/Ltr) (1)"
  },
  {
    "status": "pending",
    "allocated_to_job_card": false,
    "procurement_started": true,
    "total_count": 10,
    "sample_items": "Air Bag (HENRED)/Each-8F (4), CARGO BELTS (5), Clutch Air Pack (Each)-29H Sino Howo 400 (1), Front Wheel Studs and Nuts (Howo) (10), Number Plates Lights (1)"
  }
]