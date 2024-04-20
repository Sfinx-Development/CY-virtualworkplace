import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Todo } from "../../types";
import { FetchCreateTeamTodo, FetchGetTodo, FetchDeleteTodo, FetchEditTodo } from "../api/todo";

export interface TodoState {
  todos: Todo[] | undefined;
  activeTodo: Todo | undefined;
  error: string | null;
}

const saveTodoToLocalStorage = (activeTodo: Todo) => {
  localStorage.setItem("activeTodo", JSON.stringify(activeTodo));
};
const loadTodoFromLocalStorage = (): Todo | undefined => {
  const storedTodo = localStorage.getItem("activeTodo");
  return storedTodo ? JSON.parse(storedTodo) : undefined;
};

export const initialState: TodoState = {
  todos: [],
  activeTodo: undefined,
  error: null,
};

export const EditTodoAsync = createAsyncThunk<
  Todo,
  Todo,
  { rejectValue: string }
>("meeting/edittodo", async (todo, thunkAPI) => {
  try {
    const editedTodo = await FetchEditTodo(todo);
    if (editedTodo) {
      return editedTodo;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av todo."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Ett fel inträffade vid hämtning av lag.");
  }
});


export const createTeamTodoAsync = createAsyncThunk<
  Todo,
  Todo,
  { rejectValue: string }
>("todo/createTeamTodo", async (todo, thunkAPI) => {
  try {
    const createdTodo = await FetchCreateTeamTodo(todo);
    if (createdTodo) {
      return createdTodo;
    } else {
      return thunkAPI.rejectWithValue("failed to add todo");
    }
  } catch (error) {
    console.error("Error creating todo:", error);
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const getTodoAsync = createAsyncThunk<
  Todo[],
  string,
  { rejectValue: string }
>("todo/getTodo", async (teamId, thunkAPI) => {
  try {
    const todos = await FetchGetTodo(teamId);
    return todos;
  } catch (error) {
    console.error("Error getting todo:", error);
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const DeleteTodoAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("message/deleteTodo", async (todoId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteTodo(todoId);
    if (isDeleted) {
      return todoId;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid raderande av todon."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid raderande av todo."
    );
  }
});



const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
   setActiveTodo: (state, action) => {
  const todoId = action.payload;
  const activeTodo = state.todos?.find((todo) => todo.id === todoId);
  if (activeTodo) {
    state.activeTodo = activeTodo; 
    saveTodoToLocalStorage(activeTodo);
  }
},
 
    getActiveTodo: (state) => {
      const activeTodoId = loadTodoFromLocalStorage();
      if (activeTodoId) {
        state.activeTodo = activeTodoId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createTeamTodoAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.todos = state.todos ?? []; 
        state.todos.push(action.payload);
        state.error = null;
      }
    })
    .addCase(getTodoAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.todos = action.payload;
        state.error = null;
      }
    })
      .addCase(getTodoAsync.rejected, (state) => {
        state.todos = undefined;
        state.error = "Auth is not correct.";
      })
      .addCase(createTeamTodoAsync.rejected, (state) => {
        state.todos = undefined;
        state.error = "Något gick fel med skapandet av konto.";
      })
      .addCase(EditTodoAsync.fulfilled, (state, action) => {
        if (state.todos) {
          const editedTodoIndex = state.todos.findIndex(
            (todo) => todo.id === action.payload.id
          );
          if (editedTodoIndex !== -1) {
            state.todos[editedTodoIndex] = action.payload;
          }
          state.error = null;
        }
      })
      
      .addCase(EditTodoAsync.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = null; 
        }
      })
      .addCase(DeleteTodoAsync.fulfilled, (state, action) => {
        if (state.todos) {
          const todoIndex = state.todos.findIndex((todo) => todo.id === action.payload);
          if (todoIndex !== -1) {
            state.todos.splice(todoIndex, 1); 
            state.error = null;
          }
        }
      })
      .addCase(DeleteTodoAsync.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = null; 
        }
      });
      
      
  },
});

export const todoReducer = todoSlice.reducer;
export const { setActiveTodo } = todoSlice.actions;
