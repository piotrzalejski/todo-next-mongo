# TODO APP

A Todo app built with Nextjs, MongoDB, NextAuth, Taillwind.
Using credential authorization (email and password).

## Technologies

- `Next.js`
- `TypeScript`
- `Tailwind`
- `React`
- `MongoDB`

## Idea

<small>This idea spawned from being a bit overambitious with another idea. 😅</small>

## Proccess

I started by jotting down how I wanted the Todo app to function.

I then focused on creating the API route handlers and testing CRUD operations via Postman. Then I focused on the Todos Schema and Users Schema, followed by a login page, and the main todo page component.

I would say this is where the fun started. The most challenging part was not how to get the data into the db, but how to display it, and having the list of todos update as one was being added, or one was being deleted.

One thing I learned was how to set up route handling with nextjs. This was something that I will be able to take with me into the futture.

## How can it be improved?

Possible thoughts:

- maybe have the edit todo be in-line
- I'm sure the main page.tsx could be refactored and cleaned up

## Current bugs?

Maybe not exactly bugs, but something that I do need to fix:

- add error toast when trying to register with an already registered email
  - currently only logs an error in console ✅
- add error toast when attempting to login with invalid email or password
  - currently only logs an error in console ✅
