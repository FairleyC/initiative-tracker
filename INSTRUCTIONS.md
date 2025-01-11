# Initiative Tracker
> Last Updated: 01/11/2025

## Overview
**Type:** Web
**Description:** A web application to track npc and player initiative while playing Dungeons and Dragons 5th Edition.

## Requirements
- **Platform:** Web
- **Users:** Dungeons and Dragons Dungeon Masters 5th Edition
- **Key Features:** 
  1. Turn Order
    - Ability to add a new turn order
    - Ability to delete a turn order
    - Ability to name a turn order
    - Ability to shift the character left or right in the turn order
  2. Character
    - Ability to add a new character to a turn order tracker
    - Ability to add a name to a character
    - Ability to add a numerical initiative value to a character
    - Ability to remove a character from the turn order
  7. Application uses local storage to retain turns orders and characters between visits

## Tech Stack
- Frontend: React with Vite JavaScript
- State Management: Local Storage
- Styling: Tailwind CSS
- Backend: None
- Database: None
- Testing: None

## File Structure
```
  project/
  ├── codebase/
  │   ├── packages/
  │   │   ├── frontend/
  │   │   └── backend/
  └── docs/
```

## Development
### Setup
1. Do not use CRA, use Vite to generate project.
2. Create a root package.json file in the project root.
3. Create a frontend package.json file in the frontend directory.
4. Create a backend package.json file in the backend directory.
5. We're only focused on the frontend for now.

## Team
- **Lead:** Colton Fairley

---