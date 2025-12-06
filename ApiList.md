# DevTinder API

- authRouter
- POST /signup
- POST /login
- POST /logout

- profileRouter
- GET /profile/view
- PATCH /updateProfile
- PATCH /profile/password

- connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

-userRouter
- GET /user/connections
- GET /user/requests
- GET /feed - Gets you the profile of other users on Plateform

- Status: ignore, interested, accepted, rejected
