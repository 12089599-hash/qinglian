# Sect, Opportunity, and Attribute Feedback Design

## Goal

Extend the current idle xianxia game with deeper mid-game loops and clearer player feedback: sect growth, opportunity choices, magic treasures, spirit beasts, and a readable character attribute breakdown.

## Scope

- Sect progression gains named levels from sect reputation, plus a roster of disciples with aptitude, root, comprehension, element, job, and experience.
- Mission completion can surface a player-choice opportunity. Choices have costs, risks, and rewards, then write clear feedback to the log.
- Magic treasures and spirit beasts become long-term upgrade tracks using existing materials. Their bonuses feed into cultivation speed, combat power, breakthrough chance, and exploration risk.
- The UI exposes derived attributes instead of only showing one combat number. Equipment rows show level, quality, affix, and exact effects.

## Data Model

- Preserve existing saves by adding optional fields during revival: `sectRoster`, `activeOpportunity`, `resolvedOpportunities`, `treasures`, and `spiritBeasts`.
- Keep current `sectDisciples` and count-based assignments for compatibility, but each recruitment also creates a named roster entry.
- Keep current power and rate functions as the source of gameplay truth, and add `getCharacterProfile()` plus `getEquipmentDetails()` as display/read-model helpers.

## Testing

- Core tests cover sect level/capacity, disciple roster experience, opportunity choice resolution, treasure/beast bonuses, and character/equipment detail read models.
- Browser smoke tests continue to verify that the static page boots without syntax/runtime errors.
