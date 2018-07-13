# API Reference
All dates should be in MySQL standard format: YYYY-MM-DD and datetimes YYYY-MM-DD HH:MM:SS

## Calendar Events
### Create an Event
Add a new event to the database
>POST /calendar_events

Parameters (JSON Object in Array):

| Name           | Type    | Nullable | Description
| -------------- | ------- | -------- | -----------|
| user_id        | Number  |          | User's primary key |
| start_datetime | String  |          | Desired start datetime of event |
| end_datetime   | String  | X        | Desired ending datetime of event |
| title          | String  |          | Title of event |
| notes          | String  | X        | < 2000 character user-provided note for this event |
| rep_stop_date  | String  | X        | If this repeats, the date it should stop being applied |
| rep_day_month  | Number  | X        | If this repeats, which day (number) of the month |
| rep_day_week   | String  | X        | If this repeats, which day of the week (Sunday, Monday, Tuesday, etc.) |
| event_type     | String  |          | Must be of type "event", "income", or "expense" |
| amount         | Number  | X        | If this is of type income/expense, the amount for it |
| job_id         | Number  | X        | If this is income associated with a job, that job's primary key |

**Return Values**
* Status Code 201: Event was created
* Status Code 400: Missing body of request or required parameters
* Status Code 500: SQL Error or Internal Server Error

**Example**
```
var toSend = [{
              user_id : 1,
              start_datetime : "2018-07-30 13:00:00",
              end_datetime: null,
              title : "John's Awesome Party",
              notes : "It's going to be really cool",
              rep_stop_date : null,
              rep_day_month : null,
              rep_day_week : null,
              event_type : "event",
              amount : null,
              job_id : null
              }];
             
$http.post("/calendar_events", toSend).then(function(response){
    //Do something with status code and such here
});
```
