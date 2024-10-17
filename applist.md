# Devtender API's

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgot-password

# connectionRequestRouter
- POST /requested/send/interested/:userId
- POST /requested/send/ignored/:userId
# connectionRequestRouter
- POST /requested/review/accepted/:requestId
- POST /requested/review/rejected/:requestId


# userRouter
- GET /user/connection
- GET /user/requests/
- GET /user/feed - Gets you profiles of other users on platform

Status: ignore, interested, accepted, requested