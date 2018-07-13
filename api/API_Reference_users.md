# API Reference
All dates should be in MySQL standard format: YYYY-MM-DD and datetimes YYYY-MM-DD HH:MM:SS

## Users
### Create an User
Adds a new user to the database. Email address must be unique.
>POST /users

Parameters (JSON Object in Array):

| Name           | Type    | Nullable | Description
| -------------- | ------- | -------- | -----------|
| first_name     | String  |          | First name of user |
| last_name      | String  |          | Last name of user |
| email_address  | String  |          | User's email address associated with account |
| password       | String  |          | Desired password to log in (will be hashed on in backend) |

**Return Values**
* Status Code 201: User was created
* Status Code 400: Missing body of request or required parameters
* Status Code 500: SQL Error or Internal Server Error

**Example**
```
var toSend = [{
              first_name : "John",
              last_name : "Smith",
              email_address : "test@test.com",
              password : "hashy-hash!"
              }];
             
$http.post("/users", toSend).then(function(response){
    //Do something with status code and such here
});
```

### Get User Information
Get user name and email addresss
>GET /users/:user_id

Parameters (URL): **None**

**Return Values**
* Status Code 200: first_name, last_name, email_address in response
* Status Code 400: Missing the user_id URL parameter
* Status Code 500: SQL Error or Internal Server Error

**Example**
```
var user_id = 1;

$http.get('/users/' + user_id, null).then(function(response){
   //Do something with response
});
```

### Update a User
Update an existing user with new input
>PATCH /users/:user_id

Parameters (JSON Object in Array):

| Name           | Type    | Nullable | Description
| -------------- | ------- | -------- | -----------|
| user_id        | Number  |          | Primary key of user to change |
| first_name     | String  |          | First name of user |
| last_name      | String  |          | Last name of user |
| email_address  | String  |          | User's email address associated with account |
| password       | String  |          | Desired password to log in (will be hashed on in backend) |

**Return Values**
* Status Code 204: User was created
* Status Code 400: Missing body of request or required parameters
* Status Code 500: SQL Error or Internal Server Error

**Example**
```
var toSend = [{
              user_id : 1,
              first_name : "John",
              last_name : "Smith",
              email_address : "test@test.com",
              password : "hashy-hash!"
              }];
             
$http.patch("/users", toSend).then(function(response){
    //Do something with status code and such here
});
```

### Delete an Event
Remove a user from the database
>DELETE /users/:user_id

Parameters: **None**

**Return Values***
* Status Code 204: Event was deleted
* Status Code 400: Missing user_id in URL
* Status Code 500: SQL Error or Internal Server Error

**Example**
```
var user_id = 1;

$http.delete('/users/' + user_id, null).then(function(response){
   //Do something with response
});
```
