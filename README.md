<center>

![krello-banner](/static/krello_banner.png)

# Krello | A Trello Clone

[Krello](https://krello.rlabs.dev) is a task management app built with SvelteKit, Appwrite, Flowbite and Tailwind. It's a clone of the popular task management application Trello. You can visit the app [here.](https://krello.rlabs.dev)

[![Svelte](https://img.shields.io/badge/Svelte-3.58.0-orange?logo=svelte)](https://svelte.dev/)
![Appwrite Cloud](https://img.shields.io/badge/Appwrite%20Cloud-1.1.2-blue?logo=appwrite)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
![Quill Editor](https://img.shields.io/badge/Quill%20Editor-1.3.6-E6005E?logo=quill)
[![Vite](https://img.shields.io/badge/Vite-4.3.0-blueviolet?logo=vite)](https://vitejs.dev/)
[![Husky](https://img.shields.io/badge/Husky-8.0.0-blue?logo=husky)](https://typicode.github.io/husky/#/)
[![ESLint](https://img.shields.io/badge/ESLint-8.39.0-blue?logo=eslint)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-2.8.0-ff69b4?logo=prettier)](https://prettier.io/)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub Stars](https://img.shields.io/github/stars/iamrishupatel/trello-clone?style=social)
![Open Issues](https://img.shields.io/github/issues-raw/iamrishupatel/trello-clone?style=social)
![Open Pull Requests](https://img.shields.io/github/issues-pr-raw/iamrishupatel/trello-clone?style=social)

</center>

## Features Overview

1. **Drag and Drop Tasks**: Rearrange and organize tasks easily by dragging and dropping them within the board. Keep task statuses up-to-date effortlessly.

2. **Public and Private Boards**: Accessible to all users, public boards are for sharing while private boards are reserved for team members only.

3. **Anonymous Login**: Dive into task management and project collaboration without the need for an account. Experience quick and hassle-free access.

4. **Enhanced Editing with Quill**: Utilize the powerful Quill rich text editor to create visually appealing and well-structured task descriptions. Add formatting for effective communication.

5. **Real-time Comments and Collaboration**: Engage in real-time collaboration and feedback by leaving comments on tasks, promoting seamless teamwork.

6. **Assign Labels, Priority, & Descriptions**: Categorize tasks with labels, set priorities to indicate importance or urgency, and add descriptions for comprehensive task information

## Tech used

- SvelteKit
- TypeScript
- Appwrite Cloud (Version 1.1.2)
- Tailwindcss
- Flowbite
- Quill Editor

## Setting Up Local Environment

### 1. Clone the repo

To get started, clone this repository and install the dependencies using `pnpm` or `yarn` or `npm`:

```bash
git clone https://github.com/iamrishupatel/trello-clone.git
cd trello-clone
pnpm install
```

### 2. Setup Appwrite

**A. Login and create the project**

1. Login to [Appwrite Cloud](https://cloud.appwrite.io/) or you can use docker to run a local instance of appwrite. Read about [here](https://appwrite.io/docs/self-hosting)
2. Create a project from the dashboard

**B. Initialize Auth**

3. Enable Email/Password,, anonymous auth and Team Invites as the we use teams for private boards.

**C. Setup Database**

4. Create a database
5. Create 7 collections - (user, board, label, priority, status, task, comment)

**D. Add following attributes in the tables**

6. User Collection Attributes

   | Key                      |  Type  | Default Value |
   | :----------------------- | :----: | :-----------: |
   | name **_\(required\)_**  | string |               |
   | email **_\(required\)_** | string |               |
   | bio                      | string |               |
   | username                 | string |               |
   | displayPicture           | string |               |
   | myBoards                 | string |               |

7. Board Collection Attributes

   | Key                      |   Type   | Default Value |
   | :----------------------- | :------: | :-----------: |
   | isPrivate                | boolean  |       -       |
   | name                     |  string  |       -       |
   | owner **_\(required\)_** |  string  |       -       |
   | coverURL                 |  string  |       -       |
   | members                  | string[] |       -       |
   | teamId                   |  string  |       -       |
   | description              |  string  |       -       |

8. Label Collection Attributes

   | Key   |  Type  | Default Value |
   | :---- | :----: | :-----------: |
   | text  | string |       -       |
   | color | string |       -       |

9. Priority Collection Attributes (NOT REQUIRED)

   | Key   |  Type  | Default Value |
   | :---- | :----: | :-----------: |
   | text  | string |       -       |
   | color | string |       -       |

   > As of now this collection is not being use and all priorities are hardcoded in the app. But may be used in future.

10. Status Collection Attributes

    | Key                     |  Type  |
    | :---------------------- | :----: |
    | text **_\(required\)_** | string |

    > status are hardcoded in the appwrite db

    Statuses are `Backlog`, `Todo`, `Inprogress`,`InReview`, `Done` and must be added in DB.
    At this time statuses can't be created from client app.

11. Task Collection Attributes

    | Key                             |   Type   | Default Value |
    | :------------------------------ | :------: | :-----------: |
    | title **_\(required\)_**        |  string  |       -       |
    | boardId **_\(required\)_**      |  string  |       -       |
    | description                     |  string  |       -       |
    | coverUrl                        |  string  |       -       |
    | status **_\(required\)_**       |  string  |       -       |
    | prevStatusId **_\(required\)_** |  string  |       -       |
    | labels                          | string[] |       -       |
    | priority                        |  string  |       -       |

12. Comment Collection Attributes

    | Key                       |  Type   | Default Value |
    | :------------------------ | :-----: | :-----------: |
    | body **_\(required\)_**   | string  |       -       |
    | author **_\(required\)_** | string  |       -       |
    | taskId **_\(required\)_** | string  |       -       |
    | isEdited                  | boolean |       -       |

**E. Setup Storage Buckets**

13. Create three storage buckets to store images related to profile_pictures, boards, and tasks, respectively.

### 3. Developing

After appwrite setup is done dependencies are installed with `pnpm install` (or `npm install` or `yarn`).

1. Create an `.env.local` file and copy the contents of `.env.example` and add all the required values.

2. Start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Contributing

We're thrilled that you're interested in contributing to Krello! Your contributions help make this project better for everyone. Here's how you can get involved:

### Bug Reports and Feature Requests

If you come across a bug or have an idea for a new feature, please open an issue on our GitHub repository. Make sure to provide as much detail as possible so that we can understand and address the issue or feature request effectively.

### Pull Requests

If you want to contribute directly to the codebase, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feat/feature-name` or `git checkout -b fix/fix-name` .
3. Make your changes and ensure that the code meets our project's coding standards.
4. Commit your changes with clear and concise commit messages, following the [conventional commits](https://www.conventionalcommits.org/) guidelines. This helps maintain a consistent commit history and makes it easier to understand the changes.
5. Push your branch to your forked repository.
6. Open a pull request on our GitHub repository, explaining the changes you've made.

**Before submitting a pull request, please ensure:**

- Your code is well-documented, including comments where necessary.
- You've tested your changes thoroughly to prevent regressions.
- Your code follows the project's coding conventions and style guidelines.

We appreciate your contributions and will review your pull request as soon as possible. Please be patient as we work through the review process. If any changes are needed, we'll provide feedback.

### Spread the Word

If you're not able to contribute directly through code, you can still contribute by spreading the word about Krello! Share the project with others who might be interested, and consider giving us a star on [GitHub](https://github.com/iamrishupatel/trello-clone) to show your support.

## Acknowledgments

The designs used in this Project are based on ideas from [devchallenges.io](https://devchallenges.io). Although we've made adjustments to fit our needs, they're mostly inspired by what we found there.

## Licence

[MIT](https://github.com/iamrishupatel/trello-clone/blob/main/LICENSE)

> This project was generated using the [Sveltekit Starter Template](https://github.com/rlabs-digital/sveltekit-starter-base-template).
