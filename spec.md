# Cutlery Rate Calculator

## Current State
New project with empty backend.

## Requested Changes (Diff)

### Add
- Cutlery Rate Calculator frontend app
- Input fields: Base Thickness, Threshold, Rate Below (₹/kg), Rate Above (₹/kg), Target Thickness
- Dynamic list of cutlery items (name + weight per dozen in grams)
- Add/remove item functionality
- Results table showing calculated ₹/Dozen for each item
- Default items: Tea Spoon (270g), Dessert Spoon (430g), Table Spoon (520g), Knife (440g), Dessert Fork (330g)

### Modify
- None

### Remove
- None

## Implementation Plan
1. Pure frontend React app (no backend calls needed)
2. State managed with useState for all inputs and items list
3. Calculation logic: ratePerKg = target < threshold ? rateBelow : rateAbove; factor = target / base; rate = (weight * factor / 1000) * ratePerKg
4. Live recalculation on any input change
5. Add/remove items dynamically
