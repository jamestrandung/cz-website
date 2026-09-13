# Live site documentation

`docs/` describes the current Cà Zone site and pricing system. These are living documents: update them in the same change as the architecture, behavior, pricing, or maintenance workflow they describe. Last review dates are freshness markers, not frozen release versions.

## Current documents

| Document | Purpose |
| --- | --- |
| [Architecture](ARCHITECTURE.md) | Data ownership, build/browser flow, generic combo model, resolver behavior, displayed prices, validation and current limitations |
| [Pricing rules](PRICING_RULES.md) | Current business rules, source precedence, memberships, size exceptions, benefits, extras, examples and unresolved operating decisions |
| [Current pricing reference](CURRENT_PRICING.md) | Generated live reference of all configured standalone prices, options, benefits and resolved combo choices; refresh after content changes |
| [Combo maintenance](combos-guide.md) | How to maintain the current slider, offers, eligibility and upgrade policies |
| [Menu maintenance](maintaining-menu.md) | How to maintain current categories, dishes, variants, options and availability |
| [Discovery guide](discovery-guide.md) | How to update the original banner independently of the combo slider |
| [Image workflow](image-workflow.md) | Current photo mapping and optimization commands |

## What belongs elsewhere

- Root [`plans/`](../plans/) stores dated implementation plans, original briefs and historical implementation reviews. Use `yyyymmdd-feature-name-or-plan-name.md`, with a lowercase hyphenated name. Existing records use their original recorded date; new plans use their creation date in Asia/Ho_Chi_Minh.
- Plans explain intended work and past decisions. Mark original briefs/reviews as such and do not treat them as current system documentation. A completed plan stays historical; current behavior is maintained here.
- `tmp/reports/photo-size-report.json` is generated local output from the most recent photo run. It is ignored by Git and may cover only selected products. Do not put run reports, screenshots or one-off test results in `docs/`.
- Root [`AGENTS.md`](../AGENTS.md) is the repository workflow for future coding sessions.

## Source of truth

Approved owner corrections take precedence over older PDFs, posters and proposals. `PRICING_RULES.md` records the current interpretation and clearly labels implementation choices and open decisions. Files in `src/data/` determine actual website behavior. If code and business intent disagree, resolve the discrepancy explicitly instead of converting an accidental implementation into a business rule.

`CURRENT_PRICING.md` is generated from those files. Never edit only its tables to change a price. It must be regenerated when catalog names, prices, variants, options, benefits, availability, combo membership, quantities, extras or pricing policies change.

## Update checklist

| Change | Documentation to maintain |
| --- | --- |
| Architecture, schemas, resolver behavior, UI behavior or validation | `ARCHITECTURE.md`; affected editing guide |
| Pricing/eligibility/benefit rule or confirmed exception | `PRICING_RULES.md`; `combos-guide.md` or `maintaining-menu.md`; regenerate `CURRENT_PRICING.md` |
| Catalog or combo data | Regenerate `CURRENT_PRICING.md`; update counts/examples in other live documents where affected |
| Discovery behavior/configuration | `discovery-guide.md`; architecture if behavior changes |
| Image pipeline or output location | `image-workflow.md`; architecture and root README where affected |
| New implementation plan | A dated file in root `plans/`; update live docs when implemented |
| CLI/workflow change | Root README, relevant guide, and `AGENTS.md` if session instructions change |

Run from the repository root after content changes:

```sh
npm run menu:check
node --import tsx scripts/export-pricing-reference.ts
```

The exporter overwrites only `docs/CURRENT_PRICING.md`, using validated data and the current local date. It requires neither original PDFs/photos nor network accounts. Include the regenerated reference with the corresponding source changes when committing.

Use `npm test`, `npm run build`, and relevant browser/image checks for implementation changes. For documentation-only changes, validate links, paths, commands, examples and agreement with current code. Updating documentation is part of completing the change, not a separate optional follow-up.
