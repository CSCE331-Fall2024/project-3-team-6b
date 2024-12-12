# project-3-team-6b Panda Express POS System Repo High Level Details

## To run the code locally: 

1. Clone the repo
2. cd into the project-3 directory
3. Run npm install (will put node modules into both server and client)
4. Run npm run dev

## Framework

We used Next.js with React.js, Langchain with JavaScript, TailwindCSS, and PostgreSQL to create this application

## client/src
This folder holds the files containing all of the front-end .tsx, .jsx, .js, .ts codes
### /app/menu

This folder holds the frontend for the non interactive multidisplay menu board.

### /app/(auth)/admin/update-inventory

This folder holds the frontend for the manager view update menu items and inventory functionality.

### /app/(auth)/admin/cashier

This folder holds the overall frontend for the interactive cashier view

### /components/cashier

This folder holds the frontend components for the cashier page: Checkout, OrderList

### /components/menu

This folder holds the nutrition info for the non interactive multidisplay menu board

### /context

This folder holds the language translation functionality

## server/src
This file contains the source code for the back-end and database interaction 

## /config

This folder hold the database configuration and functions and login information to connect to our SQL database on AWS.

## /controllers

This folder holds the controllers for menu items and employees.

## /routes

This folder holds the routing for employee management and items management API endpoints as well as authentication routing.

