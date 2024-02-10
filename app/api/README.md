# Todo API Documentation

This API provides endpoints to manage user todos.

## Base URL

```
/api/todos
```

## Endpoints

### GET /api/todos

Retrieve todos for a specific user.

**Request Parameters**

- userId: (mongoose.Types.ObjectId) The ID of the user.

Response

Returns a message and status of 200

---

### POST /api/todos

Create a new todo for a specific user.

**Request Body**

- **userId:** (mongoose.Types.ObjectId) The ID of the user.
- **todo:** (string) The todo description.

**Successful Response**

Returns a message and status of 201

---

### DELETE /api/todos

Delete a todo for a specific user.

**Request Body**

- **userId:** (mongoose.Types.ObjectId) The ID of the user.
- **id:** (mongoose.Types.ObjectId) The ID of the todo to delete.

**Successful Response**

Returns message and status of 200

---

---

## Todo PUT API Documentation

This API endpoint is used to update a specific todo item for a user.

## Base URL

```
PUT /api/todo/:id
```

**Request Parameters**

- `id`: (string) The ID of the todo item to be updated.

Sample Usage

```
PUT /api/todo/65c4f2a325d3d302f12594be
```

**Request Body**

The request body should be a JSON object with the following fields:

- `userId`: (mongoose.Types.ObjectId) The ID of the user who owns the todo item.
- `todo`: (string) The updated todo description.
- `completed`: (boolean) Indicates whether the todo item is completed or not.

### Example Request

```json
{
  "userId": "65c4606425d3d302f1259446",
  "todo": "Updated todo description",
  "completed": true
}
```

**Successful Response**

Returns a message and status of 202

### Error Handling

- If the update fails due to any reason, the API will return an error response with an appropriate error message.
