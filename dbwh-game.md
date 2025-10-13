# Dragon Bones & Wizard Hats: Game Vision Guide

## Overview
Dragon Bones & Wizard Hats will be a browser-based fantasy strategy game where players choose a magical faction and build their own kingdom. The goal: gather resources, raise armies, and dominate rival lands—whether they belong to elves, dwarves, necromancers, or dragons themselves.

This will be a fully playable web game that runs smoothly on desktop and mobile browsers, powered by modern JavaScript (Phaser or PixiJS for rendering), CSS styling, and lightweight backend support through Cloudflare.

## The World
A hand-crafted world inspired by the DBWH universe, divided into magical biomes:
- **The Fae Forests** – glittering trees, moonlit pools, and mischievous sprites.  
- **The Dwarven Peaks** – mountains rich in ore and stubborn pride.  
- **The Necrotic Wastes** – barren plains where bones whisper.  
- **The Arcane Spirelands** – home of mages, scholars, and temporal storms.  
- **The Dragon Expanse** – burned valleys and crystal caves of the ancient dragons.

Each biome will host resources, creatures, and strategic advantages unique to its nature.

## Playstyle
A mix of **real-time strategy** and **resource management**, playable in-browser with intuitive touch and mouse controls.  
Players will:
- Build structures to generate resources (wood, stone, mana, gold).  
- Train units—workers, fighters, spellcasters, beasts.  
- Expand territory and uncover secrets hidden in the fog.  
- Battle enemy AIs or other players (in future updates).  

## Factions
Each player chooses a civilization:
- **Wizards & Sorceresses:** masters of mana, summon elemental spirits, cast destructive spells.  
- **Elves:** fast archers and rangers, camouflage in forests.  
- **Dwarves:** tanky builders and miners with strong fortifications.  
- **Necromancers:** harvest bones to raise skeletons; slow but relentless.  
- **Fairies:** tricky, evasive, focus on illusion and sabotage.  
- **Dragons:** rare, powerful, resource-hungry titans that can shift the balance of war.

## Core Resources
1. **Wood** – basic building material.  
2. **Stone** – structural upgrades and fortifications.  
3. **Gold** – unit training and trading.  
4. **Mana** – spells, magical construction, special abilities.  
5. **Bones** – necromantic currency; harvested from fallen foes.  

## Structures
- **Town Core** – central hub; loss means defeat.  
- **Lumber Hut / Quarry / Mana Well** – gather essential resources.  
- **Barracks / Sanctum / Tomb** – train units.  
- **Research Hall** – unlock faction tech and special powers.  
- **Tower of Sight** – expands fog-of-war vision.  

## Units
- **Worker / Peasant:** gathers, builds, repairs.  
- **Fighter / Archer / Golem:** core combat units.  
- **Mage / Necromancer / Fairy Enchanter:** specialized casters.  
- **Dragon / Summoned Beast:** ultimate unit (late-game).  

## Gameplay Loop
Gather → Build → Expand → Train → Conquer → Defend → Research → Win.  
Victory comes by destroying enemy cores or fulfilling faction-specific objectives (e.g., Necromancers resurrect the Dragon King).

## Style & Feel
- **Visuals:** 2D hand-painted aesthetic; painterly light with spell effects and soft glow.  
- **Audio:** immersive fantasy ambience (crackling mana, distant roars, wind over ruins).  
- **UI:** mobile-first radial menus; clear HUD with resource icons.  
- **Tone:** whimsical yet epic; humor meets high fantasy.  

## Long-Term Vision
The long game is a **living world**:
- Seasonal events (e.g., “The Night of Bones” invasion).  
- Multiplayer arenas.  
- Persistent accounts with progress saves.  
- Random map generator with seeded worlds.  
- Player-built guilds and alliances.  

## Hosting & Platform
- **Frontend:** Cloudflare Pages.  
- **Logic / Multiplayer:** Cloudflare Workers + Durable Objects.  
- **Storage:** KV or D1 for saves, leaderboards, and player states.  
- **Art / Sound:** All assets stored in Cloudflare R2.

## The Promise
Dragon Bones & Wizard Hats will blend cozy fantasy with tactical challenge. Every faction will tell its own story—every battlefield, a living tapestry of magic, monsters, and strategy.  

“May your mana flow strong, and your dragons never sleep.”

---

*Document: dbwhgameguide.md — for repository reference and long-term planning.*
