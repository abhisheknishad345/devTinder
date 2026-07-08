# Dev Tinder - MERN Stack
- Building a developer networking platform using React, Node.js, Express, and MongoDB.
 
# Initialize git
- .gitignore
- Create a remote repo on github
- Push all code to remote origin
- Play with routes and route extensions ex: /hello
- Order of the routes matter(be serious)
# Day 1
- Write logic for handle GET, POST, DELETE, PATCH API Calls and test them on Postman
- Explore routing and use of ?,+,(),* in the routes
- Use of regex in routes /a/, /.*fly$/
- Read the query params in the routes
- Read the dynamic routes


# Git commit and push Command
- git add .
- git commit -m "Message"
- git push -u origin main

# Day 2
- Multiple routes handler - Play with the code
- next()
- next function and errors along with the res.send()
- app.use("/route", rH, [rH2, rH3, rH4])

# Day 3
- What is middleware? Why do we need it?
- How express JS basically handle the request behind the scene
- Difference b/w app.use and app.all
- Write a dummy auth middleware for Admin
- Write a dummy auth middleware for all user routes, except /user/login
- Write code to handle the error

# Day 4
- Explore schematype options from the documentaion
- and required, lowercase, uppercase, min, max, trim
- Add default
- Create a custom validate function for gender
- Improve the DB schema - PUT all appropriate validation on each field in Schema
- and Timestamp to Schema
- Add API level validation on Patch request and Signup post api
- Data sanitization - Add API validation for each fields

# Never Trust 'req.body'

# Day 5
- Validate data in signup API
- Install bcrypt package
- Create PasswordHash using bcrypt.hash and save the user is encrypted password
- Create login api
- Compare password and throw error if email or password is Invalid
# Day 6
- istall cookie parser
- just send a dummy cookie to user
- Create GET /profile api and check  if you get cookie back
- Install jsonwebtoken
- In Login api, after email and password validation, create a JWT token and send it to user in cookie
- read the cookie inside your profile API and find the logged in user
- userAuth middleware
- Add the userAuth middleware in profile API and a new sendConnectionRequest
- set the expiry time of JWT token and cookies ALWAYS, atlast for 7 days
- Create Schema methods to get JWT
- Create user Schema methods to comparePassword(passwordInputByUser)

Status - ignore, interested, accepted and rejected 
 # Day 7
- create connection request schema
- send connection request api
- proper validation of data
- Think about all corner cases
- read about $or and $and query in mongoose
- Read more about index in MongoDB
- why do se need index in DB
- What is the advantage and disadvantage of creating Index
- read an article of Compound index from internet

- Write code with proper validation for POST
- Thought process - POST vs GET
