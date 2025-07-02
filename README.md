# learn-react SM

## Description

A modern social media web application built with React, Vite, and Supabase. This project demonstrates full-stack development concepts, including authentication, real-time data, and iterative design. The app allows users to create posts with images, interact through likes/dislikes and comments, and join communities.

## Features / Learning Objectives

<!-- Features -->

- User authentication with OAuth providers
- Post creation with image uploads and browsing
- Like/dislike system with server-side validation
- Commenting and threaded replies
- Community creation and browsing
- Responsive design for desktop and mobile
- Real-time updates using Supabase subscriptions

<!-- Learning objectives -->

- Dynamic URL extension generation (e.g., `/posts/:id`) and use of `useParams` from React Router
- Query invalidation to update vote counts in real time
- Remote Procedure Calls (RPC) with Supabase
- Iterative design: create new tables and features as needed, focusing on minimum viable structure

### How I made it my own

- Custom styling tweaks for a unique look and feel
- Integration of a different OAuth provider for authentication
- Bug fixes and quality-of-life improvements:
  - Removing invalid characters from post titles and filenames before storage
  - Clearing forms after submission
  - Character limit and live character count on post titles
  - Displaying vote sum (dislikes subtract from total)
  - Fetching vote and comment counts when viewing posts in a community
- Server-side validation:
  - Like/dislike actions only affect count by one per user
  - Posts require image uploads
- Increased type safety by importing types from Supabase

## Tech Stack

- Vite + React + TypeScript
- TailwindCSS for styling
- Supabase for backend, authentication, and storage
- TanStack Query (React Query) for data fetching and caching

## Next Steps

- edit/delete posts
- lazy loading on post lists and comments
- Search feature for posts and communities
- User profiles with editable information
- Support for multiple login options
- Markdown support for post descriptions and comments
- Private messaging between users
- Searchable, dropdown menu for selecting communities

## Credits

- [Demo Video on YouTube](https://youtu.be/_sSTzz13tVY?si=1n5G_N8bpPdKARWC)

## Process

- Set up file structure and initial project scaffolding
- Implement basic routing with React Router
- Design responsive navbar for desktop and mobile
- Integrate Supabase for backend and authentication
- Create Auth Context for managing user state
- Build basic post creation form (title, content, photo) with Supabase RLS
- Develop post-related components and display post tiles on homepage
- Implement individual post view with like/dislike and comment functionality
- Add threaded comments and replies
- Create community pages and allow users to view all communities and posts within each community