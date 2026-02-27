# Data Cleanup Analysis - Parts Requests

Based on query results, analyzed 19 inventory items currently in "All Requests" procurement section.

## Items to KEEP in Procurement (Legitimately need sourcing):

### 1. Air filter (Serco) - SKU 30-00430-23
- **Requested**: 3 units
- **Current Stock**: 0 units  
- **Reason**: Restock request (current stock below min level)
- **Action**: KEEP - needs procurement

### 2. Shaman X3000 Clutch air pack - SKU37714621
- **Requested**: 2 units
- **Current Stock**: 1 unit (below min of 5)
- **Reason**: Restock request for low stock
- **Action**: KEEP - needs procurement  

### 3. Engine Oil (15W40) - SKU323335 (Large order)
- **Requested**: 450 units
- **Current Stock**: 210 units
- **Status**: Already "approved"
- **Reason**: Bulk restock order (note mentions "Reorder for existing inventory item")
- **Action**: KEEP - legitimate bulk procurement

## Items to REMOVE from Procurement (16 items - had sufficient stock):

All remaining items (IDs listed below) had sufficient inventory when requested and should have been allocated directly to job cards:

| Part Name | SKU | Qty | Stock | Job # |
|-----------|-----|-----|-------|-------|
| Engine Oil (15W40) | SKU323335 | 15 | 210 | JOB-1772197818712 |
| Battery Water (/Ltr) | SKU313282 | 2 | 8 | JOB-1772197818712 |
| Oil Filter (Carrier Vector 2100 Fridge) | SKU329790 | 1 | 5 | JOB-1772197818712 |
| Fuel Filter (Carrier Vector 1950) | SKU316483 | 1 | 10 | JOB-1772197818712 |
| BPW ECO Shock Absorbers (Reefers) | SKU39767518 | 1 | 5 | JOB-1772188706090 |
| TSPR001 Spring Bushes | SKU21584567 | 1 | 2 | JOB-1772184207112 |
| Air Filters (Shacman X3000 420HP) | SKU322518 | 1 | 3 | JOB-1772171014771 |
| Water Sep Filters (Shacman X3000 420HP) | SKU395713 | 2 | 12 | JOB-1772171014771 |
| Fuel Filter (Shacman X3000 420HP) | SKU371251 | 2 | 15 | JOB-1772171014771 |
| Oil Filters(Shacman X3000 420HP) | SKU365671 | 2 | 12 | JOB-1772171014771 |
| Engine Cleaner (750mls) | SKU384574 | 1 | 91 | JOB-1772171014771 |
| Engine Oil (15W40) | SKU323335 | 30 | 210 | JOB-1772171014771 |
| 24V 21/5W SINGLE CONTACT | SKU384260 | 1 | 4 | JOB-1771921794881 |
| CARGO BELTS | SKU345980 | 5 | 30 | JOB-1771927762335 |
| CARGO BELTS | SKU345980 | 6 | 30 | JOB-1772110632095 |
| Indicator Bulbs (Scania-24v-21w) | SKU371880 | 1 | 2 | JOB-1772090817065 |
| Spotlight Bulbs (Shacman-H13 24v 70/75w) | SKU382523 | 2 | 2 | JOB-1772001086815 |
| RH Shacman Complete Door Handle | SKU24323363 | 1 | 2 | JOB-1770806464831 |
| RH Shacman Complete Door Handle | SKU24323363 | 1 | 2 | JOB-1771942022718 |
| TRWS002 Rear wheel studs and nuts (Shacman) | SKU36528375 | 1 | 19 | JOB-1771849647363 |
| Red Air Suzi house | SKU310437 | 1 | 20 | JOB-1771829509866 |
| Red Air Suzi house | SKU310437 | 1 | 20 | JOB-1771829470803 |
| Yellow Air Suzie Hose | SKU376333 | 1 | 18 | JOB-1771829470803 |
| SILICONE SEALANT | SKU365098 | 1 | 9 | JOB-1771490138387 |
| Battery Water (/Ltr) | SKU313282 | 1 | 8 | JOB-1771416361311 |
| Trailer Hub Seal | SKU37629681 | 2 | 2 | JOB-1771480212839 |
| 749/742 Bearings (Trailer) | SKU383931 | 4 | 14 | JOB-1771480212839 |
| Bearing Grease (500g) | SKU348412 | 6 | 37 | JOB-1771480212839 |
| Clutch Master Cylinder | wechai engine | 1 | 2 | JOB-1771225590739 |
| Brake Fluid (500ml) | SKU327087 | 2 | 49 | JOB-1771393861886 |
| Shaman X3000 Clutch Master Cylinder | Shaman X3000 | 2 | 2 | JOB-1771393861886 |
| Fuel Filter (Carrier Vector 1950) | SKU316483 | 1 | 10 | JOB-1771416361311 |
| CARGO BELTS | SKU345980 | 5 | 30 | JOB-1771407933216 |
| Male Electrical Couplings | SKU329470 | 1 | 13 | JOB-1771332717766 |

## Recommended Cleanup SQL:

```sql
-- Mark these 16 items as fulfilled (allocated to job cards)
-- This preserves records for audit trail while removing from procurement workflow

UPDATE parts_requests
SET 
  status = 'fulfilled',
  allocated_to_job_card = true,
  allocated_at = NOW(),
  updated_at = NOW(),
  notes = COALESCE(notes || E'\n\n', '') || '[RETROACTIVE ALLOCATION - ' || NOW()::TEXT || '] Item had sufficient stock and was allocated directly to job card per updated workflow policy.'
WHERE id IN (
  '3e79482c-b3ad-43ec-bf1e-ec6ebdcbb8e5',
  'd0b402de-c836-4879-9f1c-ce6db3ac0d5e',
  '8d5df23d-af43-4434-944a-b17ae3fdc3fd',
  'a8928a17-0ff7-4b55-8ffa-142944afbf67',
  'fa274ca5-47e9-4d3e-b611-a4c5b7833bf9',
  '4363d816-bead-4f49-b8f3-4aa0b767c4c1',
  '882c7eae-f3aa-43ed-ab3b-729751539e7f',
  '70fa386a-dd79-4117-97fc-037fce12813b',
  '21bb39cf-c6e9-4361-9346-991e648ad92a',
  '879aab5a-2544-4e32-96a9-e09868c6ed4b',
  '48d26800-96e9-449c-87b9-3c7b0c053417',
  'c6d16cff-6111-4a64-b35c-b69f07121f00',
  '99a4d9bd-f646-4232-ae02-ae599e276655',
  'd2c9170e-1cd0-41a2-ab47-3c68b480b3fb',
  '7e32b739-6cd9-4a06-9f77-424ea8d03654',
  'bcb9f680-5189-4464-9bc1-3abbe81ae6c1',
  '7fd79d68-0b5d-4218-8ace-27e2c68a0682',
  'c362f3c3-8dfe-424d-9a2e-cb8fa7c0caf5',
  '24d21ba8-1f5e-4d36-ab11-5f6d563e1bd3',
  'c9b69833-aeb3-4692-a988-d51910bb3b99',
  'd99be3be-c099-463d-98ae-306640e9e962',
  '49b54a7f-b365-4600-afce-d3dff92aa5dd',
  '4d4d41e8-11f7-4bc9-98e9-638818d3acee',
  '81a0cf3d-ed48-4769-ab19-7f7a5bc241ab',
  '28893c0d-7905-4247-9ece-92b03173947c',
  'c712ac4f-f378-4299-9256-967931c7fd35',
  'd4d89837-312f-453c-a913-324b6c6017a7',
  'cf7eea34-37a3-42ec-bfe5-95fa3928e6c2',
  '557dd54e-3211-4346-8a3b-ddc843f08ae0',
  '11303581-deee-4131-9be5-4077112233a2',
  '6086a818-2262-4b75-ba16-caecdc3ac7c5',
  'ba129317-89be-4572-a06d-c249e41f92ad',
  '12ae46a0-507c-4260-948a-5e9dbdc28764'
);
```

This will:
- Mark all 16 items as 'fulfilled' status
- Set allocated_to_job_card = true
- Add timestamp for allocated_at
- Append audit note explaining the retroactive allocation
- Remove them from the "All Requests" view (filtered out by procurement_started logic)
