# iBrood Health Score Calculation Logic

## Overview
The health score system combines data from both Queen Cell and Brood Pattern analyses to provide an accurate hive health assessment.

---

## Backend (app.py) - Brood Detection Score

### Formula Components:
1. **Balance Score** (max 50 points)
   - Measures how evenly distributed egg/larva/pupa are
   - Ideal ratio: 33.3% each
   - Penalty = |egg_ratio - 0.33| + |larva_ratio - 0.33| + |pupa_ratio - 0.33|
   - Score = 50 - (penalty × 75)

2. **Coverage Score** (max 30 points)
   - Based on brood coverage percentage
   - Coverage = min(100, (total_brood / 150) × 100)
   - Score = coverage × 0.3

3. **Count Score** (max 10 points)
   - Based on total brood count
   - Score = min(10, total_brood / 15)

4. **Missing Stage Penalty** (-10 points)
   - Deducted if any stage (egg/larva/pupa) is completely missing

5. **Distribution Bonus** (+10 points)
   - Added if: egg > 15%, larva > 20%, pupa > 20%

### Final Score:
```
health_score = balance_score + coverage_score + count_score - missing_penalty + distribution_bonus
health_score = max(0, min(100, health_score))
```

### Status Assignment:
- **85-100**: EXCELLENT
- **70-84**: GOOD
- **50-69**: FAIR
- **0-49**: POOR

### Brood Coverage:
```
brood_coverage = min(100, (total_brood / 150) × 100)
```

---

## Frontend (storage.ts) - Combined Health Score

### Scenario 1: Both Queen + Brood Data Available
**Weighted Average: 70% Brood + 30% Queen**

#### Queen Score Calculation:
```typescript
if (total_queen_cells === 0) {
  queenScore = 85  // No queen cells = healthy
} else {
  failureRate = failed_cells / total_cells
  maturityRate = mature_cells / total_cells
  
  if (failureRate > 0.5) queenScore = 40      // High failure
  else if (failureRate > 0.3) queenScore = 60 // Moderate failure
  else if (mature > 3) queenScore = 70        // Swarm risk
  else if (0.3 < maturityRate < 0.7) queenScore = 90  // Good balance
  else queenScore = 80                        // Normal
}
```

#### Combined Score:
```typescript
healthScore = Math.round(broodScore × 0.7 + queenScore × 0.3)
```

### Scenario 2: Only Brood Data
```typescript
healthScore = broodScore (from backend)
healthStatus = broodStatus (from backend)
broodCoverage = broodCoverage (from backend)
```

### Scenario 3: Only Queen Data
```typescript
if (total_queen_cells === 0) {
  healthScore = 85
  healthStatus = 'GOOD'
} else {
  // Calculate based on failure and maturity rates
  // Same logic as queen score above
}
```

---

## Example Calculations

### Example 1: Balanced Brood
- Eggs: 50, Larva: 50, Pupa: 50 (Total: 150)
- Ratios: 33.3% each
- Balance Score: 50 (perfect balance)
- Coverage Score: 30 (100% coverage)
- Count Score: 10 (150/15 = 10)
- Missing Penalty: 0
- Distribution Bonus: 10
- **Final Score: 100 (EXCELLENT)**

### Example 2: Imbalanced Brood
- Eggs: 10, Larva: 60, Pupa: 20 (Total: 90)
- Ratios: 11%, 67%, 22%
- Balance Score: ~25 (high penalty)
- Coverage Score: 18 (60% coverage)
- Count Score: 6 (90/15 = 6)
- Missing Penalty: 0
- Distribution Bonus: 0
- **Final Score: 49 (POOR)**

### Example 3: Combined (Queen + Brood)
- Brood Score: 85
- Queen Cells: 2 mature, 1 capped (Total: 3)
- Queen Score: 70 (swarm risk)
- **Combined: 85 × 0.7 + 70 × 0.3 = 80.5 ≈ 81 (GOOD)**

---

## Key Points

✅ **Brood coverage IS included** in the calculation (max 30 points)
✅ **No more hardcoded 60% or 70%** - all scores are computed from actual data
✅ **Combined scoring** when both analyses exist (70% brood, 30% queen)
✅ **Dynamic thresholds** based on actual detection counts and ratios

---

## Deployment Checklist

- [x] Backend (app.py) - Fixed brood score calculation
- [x] Backend (app.py) - Added brood coverage calculation
- [x] Frontend (storage.ts) - Fixed combined health score logic
- [ ] **Deploy app.py to Hugging Face** ⚠️ REQUIRED FOR CHANGES TO WORK
