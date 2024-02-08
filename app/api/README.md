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

Returns an array of todo objects.

Each todo object contains:

- **\_id:** (mongoose.Types.ObjectId) The ID of the todo.
- **todo:** (string) The todo description.
- **completed:** (boolean) Indicates if the todo is completed.

---

### POST /api/todos

Create a new todo for a specific user.

**Request Body**

- **userId:** (mongoose.Types.ObjectId) The ID of the user.
- **todo:** (string) The todo description.

**Response**

Returns the newly created todo object.

The todo object contains:

- **\_id:** (mongoose.Types.ObjectId) The ID of the todo.
- **todo:** (string) The todo description.
- **completed:** (boolean) Indicates if the todo is completed.

---

### DELETE /api/todos

Delete a todo for a specific user.

Request Body

- **userId:** (mongoose.Types.ObjectId) The ID of the user.
- **id:** (mongoose.Types.ObjectId) The ID of the todo to delete.

Response

Returns the updated list of todos after deletion.

Each todo object contains:

- **\_id:** (mongoose.Types.ObjectId) The ID of the todo.
- **todo:** (string) The todo description.
- **completed:** (boolean) Indicates if the todo is completed.

---

---

## Todo PUT API Documentation

This API endpoint is used to update a specific todo item for a user.

### Base URL

```
PUT /api/todo/:id
```

### Request Parameters

- `id`: (string) The ID of the todo item to be updated.

### Request Body

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

### Response

- If the update is successful, the API will return the updated todo item.
- The todo item contains the following fields:
  - `_id`: (mongoose.Types.ObjectId) The ID of the todo item.
  - `todo`: (string) The updated todo description.
  - `completed`: (boolean) Indicates whether the todo item is completed or not.

### Example Response

```json
{
  "message": "Todo updated",
  "updatedTodo": {
    "todo": "Update todo description",
    "completed": true,
    "_id": "65c4f2a325d3d302f12594be"
  }
}
```

### Error Handling

- If the update fails due to any reason, the API will return an error response with an appropriate error message.

### Sample Usage

```
PUT /api/todo/65c4606425d3d302f1259446
```

---

Note: Replace `mongoose.Types.ObjectId` with the actual data type as necessary in your documentation. Additionally, consider adding more detailed descriptions and examples as needed for a comprehensive documentation.
