# DevTinder API

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /updateProfile
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

- POST /request/review/:status/:requestId




## userRouter
- GET /user/requests
- GET /user/connections
- GET /feed - Gets you the profile of other users on Plateform

- Status: ignore, interested, accepted, rejected

# Real time chat using Websocket(Socket.io)
