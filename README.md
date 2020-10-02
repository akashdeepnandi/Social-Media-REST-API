# SOCIAL MEDIA REST API

This is an API which can used for social media platform with covering the following core functionalities.

- User authentication with **JWT**
- User profile creation
- User post creation
- Adding the crud functionalites all these resources
- With keeping in mind the security and privacy of the user data

It is made using **Node.js** and **Express.js** with **MongoDB** cluster provided by MongoDB Atlas as database. For API testing **Insomnia** was used.

## API Documentation:

API endpoints: For example the node server is running on localhost:5000 then endpoints will be -

### User and Auth

```http://localhost:5000/users/register``` - This endpoint is used for registering and user and it expects a JSON sent to it in the following format.

```json
{
	"firstName": "jane",
	"lastName": "nandi",
	"email": "jane@gmail.com",
	"password": "janed"
}
```
