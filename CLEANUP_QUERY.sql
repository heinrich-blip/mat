-- SQL Query to identify parts_requests that should NOT be in procurement
-- These are inventory items that had sufficient stock when added (before workflow changes)

-- STEP 1: Find ALL inventory items still showing in "All Requests" with sufficient current stock
SELECT 
  pr.id,
  pr.part_name,
  pr.part_number,
  pr.quantity AS requested_qty,
  pr.status,
  pr.allocated_to_job_card,
  pr.procurement_started,
  pr.created_at,
  pr.notes,
  inv.name AS inventory_name,
  inv.quantity AS current_inventory_qty,
  (inv.quantity >= pr.quantity) AS has_sufficient_stock,
  jc.job_number
FROM parts_requests pr
LEFT JOIN inventory inv ON pr.inventory_id = inv.id
LEFT JOIN job_cards jc ON pr.job_card_id = jc.id
WHERE 
  -- Is from inventory
  pr.is_from_inventory = true
  AND pr.inventory_id IS NOT NULL
  -- Has a job card (was added to a specific job)
  AND pr.job_card_id IS NOT NULL
  -- Has NOT been procured yet
  AND (pr.procurement_started = false OR pr.procurement_started IS NULL)
  -- NOT already allocated
  AND (pr.allocated_to_job_card = false OR pr.allocated_to_job_card IS NULL)
  -- Does NOT have out-of-stock marker in notes
  AND (pr.notes IS NULL OR pr.notes NOT LIKE '%[OUT OF STOCK%')
  -- NOT rejected or already fulfilled
  AND pr.status NOT IN ('rejected', 'fulfilled')
ORDER BY pr.created_at DESC;

-- STEP 2: Verification Query - Check what was updated
-- Run this AFTER the cleanup to verify the records were updated correctly
SELECT 
  status,
  allocated_to_job_card,
  procurement_started,
  COUNT(*) as count,
  STRING_AGG(part_name || ' (' || quantity || ')', ', ' ORDER BY part_name LIMIT 5) as sample_items
FROM parts_requests
WHERE 
  is_from_inventory = true
  AND inventory_id IS NOT NULL
  AND job_card_id IS NOT NULL
GROUP BY status, allocated_to_job_card, procurement_started
ORDER BY status, allocated_to_job_card;

-- STEP 3: Check specific item by part name
-- Replace 'Battery Water (/Ltr)' with the part you want to verify
/*
SELECT 
  id, part_name, status, allocated_to_job_card, procurement_started, 
  quantity, notes, created_at
FROM parts_requests
WHERE part_name LIKE '%Battery Water%'
ORDER BY created_at DESC;
*/

-- STEP 4: Quick count of items STILL showing in "All Requests"
-- These should match your UI count
SELECT COUNT(*) as still_in_all_requests
FROM parts_requests pr
WHERE 
  (pr.procurement_started = false OR pr.procurement_started IS NULL)
  AND pr.status NOT IN ('fulfilled', 'rejected')
  AND (pr.allocated_to_job_card = false OR pr.allocated_to_job_card IS NULL);

-- COMPREHENSIVE CLEANUP (Run this if automated cleanup needed):
/*
UPDATE parts_requests
SET 
  status = 'fulfilled',
  allocated_to_job_card = true,
  allocated_at = NOW(),
  updated_at = NOW(),
  notes = COALESCE(notes || E'\n\n', '') || '[RETROACTIVE ALLOCATION] Item had sufficient stock per updated workflow.'
WHERE 
  is_from_inventory = true
  AND inventory_id IS NOT NULL
  AND job_card_id IS NOT NULL
  AND (procurement_started = false OR procurement_started IS NULL)
  AND (allocated_to_job_card = false OR allocated_to_job_card IS NULL)
  AND (notes IS NULL OR notes NOT LIKE '%[OUT OF STOCK%')
  AND status NOT IN ('rejected', 'fulfilled')
  AND id IN (
    SELECT pr.id FROM parts_requests pr
    LEFT JOIN inventory inv ON pr.inventory_id = inv.id
    WHERE inv.quantity >= pr.quantity
  );
*/
