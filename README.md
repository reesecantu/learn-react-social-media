# learn-react SM

## Description

## Features / Learning Objectives

<!-- Features -->

-

<!-- Learning objectives -->

- dynamic url extension generation "/posts/:id" and useParams from React Query
- invalidate a query (overwrite vote count)

### How I made it my own

- Tweaks to styling
- Different OAuth provider
- Bug fixes / QOL improvements
  - Removing invalid characters from post titles and filenames before moving them into storage
  - Clear forms after submit
  - Character limit with character count on post titles
- server-side validation
  - like/dislikes only sway count by one
  - posts are uploaded with images
- Increase type safety by importing types from Supabse

## Tech Stack

- Vite + React + Typescript
- TailwindCSS
- Supabase
- TanStack (Formerly React Query)

## Next Steps

-

## Credits

- [Demo Video on YouTube](https://youtu.be/_sSTzz13tVY?si=1n5G_N8bpPdKARWC)

## Process

- setup file structure
- basic routing
- navbar layout for desktop and mobile
- Link Supabase
- Auth Context
- Basic Post creation form (title, content, photo)
  - Supabase RLS
- Create Post-related components
- Add Post tiles to homepage
- Individual Post view
  - Like/dislike buttons
  - Comment section
