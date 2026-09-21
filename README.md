# Arena

Arena is a full-stack esports platform. Players create teams, join tournaments and follow a knockout bracket. Admins create the games and tournaments, generate the bracket and enter the results.

This is my second full-stack project. I built it to practice a bigger backend (roles, business rules, bracket logic) together with a complete admin panel.

**Live demo:** [add link here]

**Demo accounts**

| Role   | Email          | Password       |
| ------ | -------------- | -------------- |
| Player | test1@arena.com | 111111   |
| Player | test2@arena.com | 222222   |
| Player | test3@arena.com | 333333   |
                 .             .
                 .             .
| Player | test9@arena.com | 999999   |

| Admin  |hossam@gmail.com | 111111   |

## Screenshots

| Landing page | Player dashboard |
| --- | --- |
| ![Landing page](https://github.com/user-attachments/assets/0f5ba8fc-4773-4748-8b20-4ae82be3e4f2) | ![Player dashboard](https://github.com/user-attachments/assets/89a2af70-2f27-47bd-a876-86530a073a28) |

| Team page | Tournament page |
| --- | --- |
| ![Team page](https://github.com/user-attachments/assets/d0558d0f-9676-4bf1-bc75-ae5f609f8b69) | ![Tournament page](https://github.com/user-attachments/assets/ad591f3d-f8ce-4a26-90f4-ef58eeb38266) |

| Bracket | Admin panel |
| --- | --- |
| ![Bracket](https://github.com/user-attachments/assets/5c3f8ff8-fda7-4b08-bc89-c77ae72e1340) | ![Admin panel](https://github.com/user-attachments/assets/30eec5dc-12fa-4e17-9335-7834fea82ddb) |


## Features

**Players**
- Register and log in, edit the profile (bio, avatar, favorite games) and change the password.
- Create a team, or send a join request to an existing one. A player can be in one team per game.
- Team captains accept or reject join requests, remove members and transfer the captaincy.
- Browse tournaments and register a team by choosing the lineup. The number of players must match the tournament format (1v1 to 5v5).
- Follow the bracket, the results and the leaderboard.
- Notifications for join requests, registrations, scheduled matches, results and advancing to the next round.
- Public player profiles and announcements.

**Admins**
- Manage games: formats, activate and deactivate.
- Manage teams: view team details and delete a team.
- Manage tournaments: create, edit and delete.
- Move a tournament through its stages: draft, open registration, in progress, completed or cancelled.
- Generate the bracket, schedule matches and enter results from the bracket page.
- Write announcements as drafts and publish them later.

## Try it

A quick way to see the whole flow:

1. Log in as the admin and create a tournament. It starts as a draft.
2. Open the tournament in the admin panel and click Open Registration.
3. Log in as players, create teams and register them with a lineup.
4. As the admin, generate the bracket. At least 2 teams are needed.
5. Open the bracket, schedule the matches and enter the results. The winners move on until the final.

## How the bracket works

The bracket is single elimination. When the admin generates it, the registered teams are shuffled and placed in the first round. If the number of teams is not a power of two, some teams get a bye and go straight to the next round.

Every match stores the match its winner moves to (`nextMatch`) and the slot they take (`teamA` or `teamB`). When an admin enters a result, the winner is placed in the next match and both teams get a notification. When the final is played, the tournament is marked as completed.

The leaderboard is calculated from completed matches with a MongoDB aggregation. A win gives 3 points.

## Tech stack

- **Frontend:** Next.js (App Router), React, Material UI
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT and bcrypt
- **Design:** designed in Google Stitch

## Project structure

```
Backend/
  config/         database connection
  constants/      game formats
  controllers/    request handlers
  middleware/     protect and adminOnly
  models/         Mongoose models
  routes/         API routes
  services/       notifications
  utils/          bracket helpers, validators
  server.js

Frontend/
  src/
    app/          pages (player pages, /admin, login, register)
    components/   shared UI, grouped by feature
    context/      auth and notifications state
    lib/          API helper and small utilities
    theme/        Material UI theme
```

## API overview

All routes start with `/api`.

| Route | Purpose |
| --- | --- |
| `/auth` | register, login, current user, profile, password, public player profile |
| `/games` | list, create and update games, available formats |
| `/teams` | teams, members, captaincy |
| `/join-requests` | send, list, accept and reject join requests |
| `/tournaments` | list, create, update and delete tournaments |
| `/registrations` | register a team in a tournament |
| `/matches` | bracket, schedule, results |
| `/notifications` | list and mark as read |
| `/announcements` | list, create, update and delete announcements |
| `/leaderboard` | team ranking and team stats |

Routes that change data need a token, and the admin routes also check that the user is an admin.

## Getting started

You need Node.js 18 or newer and a MongoDB database (local or MongoDB Atlas).

**1. Clone the project**

```
git clone https://github.com/your-username/arena.git
cd arena
```

**2. Backend**

```
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:3000
```

Start it:

```
npm run dev
```

**3. Frontend**

```
cd Frontend
npm install
```

Create a `.env.local` file in `Frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start it:

```
npm run dev
```

The app runs on `http://localhost:3000` and the API on `http://localhost:5000`.

**4. Create an admin**

There is no admin sign up. Register a normal account, then open the `users` collection in MongoDB and change the `role` of that user from `player` to `admin`.

## What I would add next

- Image upload. Right now logos and banners are added by URL.
- Live notifications. They are refreshed every minute.
- Password reset by email.
- Automated tests. The bracket helpers would be the first ones.

## Author

Hossam Abuhamda

[LinkedIn](https://www.linkedin.com/in/hossam-abuhamda-45238a330/)
