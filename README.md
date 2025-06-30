# learn-react SM

## Description

## Features / Learning Objectives

<!-- Features -->

-

<!-- Learning objectives -->

- dynamic url extension generation "/posts/:id" and useParams from React Query
- invalidate a query (overwrite vote count)
- RPC with supabase
- iterative design approach
  - Create new tables as need, only create the minimum viable structure necessary to complete your current task

### How I made it my own

- Tweaks to styling
- Different OAuth provider
- Bug fixes / QOL improvements
  - Removing invalid characters from post titles and filenames before moving them into storage
  - Clear forms after submit
  - Character limit with character count on post titles
  - Show vote sum not vote count (dislikes count as negative towards vote count)
  - Remeber to fetch vote count and comment count when viewing a post inside a community
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

- profiles
- multiple login options
- MD capabilities for captions/comments
- private messaging
- one row of posts that grow/shrink to fit the image size
- clean, searchable, dropdown menu for "select community"

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
