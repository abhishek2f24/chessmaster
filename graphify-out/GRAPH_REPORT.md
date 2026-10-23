# Graph Report - chessmood  (2026-05-02)

## Corpus Check
- 71 files · ~24,436 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 147 nodes · 91 edges · 6 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 4 edges
2. `calculatePuzzleElo()` - 3 edges
3. `getPuzzleRatingRange()` - 3 edges
4. `getNextPuzzle()` - 3 edges
5. `parseLine()` - 3 edges
6. `main()` - 3 edges
7. `getDashboardData()` - 2 edges
8. `DashboardPage()` - 2 edges
9. `GET()` - 2 edges
10. `POST()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `calculatePuzzleElo()`  [INFERRED]
  app\api\puzzles\attempt\route.ts → lib\elo.ts
- `POST()` --calls--> `getXpForSolve()`  [INFERRED]
  app\api\puzzles\attempt\route.ts → lib\elo.ts
- `POST()` --calls--> `getNextReviewDate()`  [INFERRED]
  app\api\puzzles\attempt\route.ts → lib\puzzle-engine.ts
- `GET()` --calls--> `getNextPuzzle()`  [INFERRED]
  app\api\puzzles\next\route.ts → lib\puzzle-engine.ts
- `POST()` --calls--> `createCheckoutSession()`  [INFERRED]
  app\api\stripe\checkout\route.ts → lib\stripe.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (9): POST(), calculatePuzzleElo(), expectedScore(), getPuzzleRatingRange(), getXpForSolve(), getNextPuzzle(), getNextReviewDate(), getThemePuzzles() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (4): POST(), createBillingPortalSession(), createCheckoutSession(), POST()

### Community 3 - "Community 3"
Cohesion: 0.53
Nodes (4): flush(), main(), mapThemes(), parseLine()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): DashboardPage(), getDashboardData()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): getPlan(), POST()

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): buildSteps(), uciToSan()

## Knowledge Gaps
- **Thin community `Community 7`** (3 nodes): `page.tsx`, `DashboardPage()`, `getDashboardData()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (3 nodes): `route.ts`, `getPlan()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (3 nodes): `buildSteps()`, `uciToSan()`, `SolutionStepper.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 3 inferred relationships involving `POST()` (e.g. with `calculatePuzzleElo()` and `getXpForSolve()`) actually correct?**
  _`POST()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getPuzzleRatingRange()` (e.g. with `getNextPuzzle()` and `getThemePuzzles()`) actually correct?**
  _`getPuzzleRatingRange()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getNextPuzzle()` (e.g. with `GET()` and `getPuzzleRatingRange()`) actually correct?**
  _`getNextPuzzle()` has 2 INFERRED edges - model-reasoned connections that need verification._