import { useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Dashboard() {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {

      const res = await api.get("/tasks");

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const createTask = async (e) => {

    e.preventDefault();

    try {

      await api.post("/tasks", {
        title,
        description,
        status: "Todo",
      });

      setTitle("");
      setDescription("");

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  const deleteTask = async (id) => {

    try {

      await api.delete(`/tasks/${id}`);

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  const updateTask = async (id, status) => {

    try {

      await api.put(`/tasks/${id}`, {
        status,
      });

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  const handleDragEnd = async (result) => {

    if (!result.destination) return;

    const taskId = result.draggableId;

    const newStatus = result.destination.droppableId;

    try {

      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "Done"
  );

  const renderTaskCard = (task, index) => (

    <Draggable
      key={task._id}
      draggableId={task._id}
      index={index}
    >

      {(provided) => (

        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-slate-700/80 p-4 rounded-2xl shadow-lg hover:scale-[1.02] hover:bg-slate-600 transition duration-300 border border-slate-600"
        >

          <h3 className="text-xl font-bold mb-2">
            {task.title}
          </h3>

          <p className="text-gray-300">
            {task.description}
          </p>

          <div className="mt-4">

            <select
              value={task.status}
              onChange={(e) =>
                updateTask(task._id, e.target.value)
              }
              className="bg-blue-600 px-3 py-2 rounded-lg"
            >

              <option value="Todo">
                Todo
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Done">
                Done
              </option>

            </select>

          </div>

          <button
            onClick={() => deleteTask(task._id)}
            className="mt-4 w-full bg-gradient-to-r from-red-700 to-red-500 py-2 rounded-xl hover:opacity-90 transition duration-300"
          >
            Delete Task
          </button>

        </div>

      )}

    </Draggable>
  );

  return (

    <DragDropContext onDragEnd={handleDragEnd}>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex">

        {/* SIDEBAR */}

        <div className="w-[250px] bg-slate-950 border-r border-slate-800 shadow-2xl p-6 flex flex-col justify-between">

          <div>

            <h1 className="text-4xl font-extrabold mb-10 tracking-wide">
              Jira Clone
            </h1>

            <div className="space-y-4">

              <button className="w-full bg-slate-800 py-3 rounded-xl hover:bg-slate-700 hover:translate-x-1 transition duration-300">
                Dashboard
              </button>

              <button className="w-full bg-slate-800 py-3 rounded-xl hover:bg-slate-700 hover:translate-x-1 transition duration-300">
                My Tasks
              </button>

            </div>

          </div>

          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-700 to-red-500 py-3 rounded-xl hover:opacity-90 transition duration-300"
          >
            Logout
          </button>

        </div>

        {/* MAIN CONTENT */}

        <div className="flex-1 p-10">

          <h1 className="text-5xl font-extrabold mb-8">
            Dashboard
          </h1>

          {/* ANALYTICS */}

          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300 border border-slate-700">
              <h2 className="text-3xl font-bold">
                {tasks.length}
              </h2>
              <p className="text-gray-400 mt-2">
                Total Tasks
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300 border border-slate-700">
              <h2 className="text-3xl font-bold">
                {todoTasks.length}
              </h2>
              <p className="text-gray-400 mt-2">
                Todo
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300 border border-slate-700">
              <h2 className="text-3xl font-bold">
                {inProgressTasks.length}
              </h2>
              <p className="text-gray-400 mt-2">
                In Progress
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300 border border-slate-700">
              <h2 className="text-3xl font-bold">
                {doneTasks.length}
              </h2>
              <p className="text-gray-400 mt-2">
                Done
              </p>
            </div>

          </div>

          {/* CREATE TASK */}

          <form
            onSubmit={createTask}
            className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700 mb-8"
          >

            <h2 className="text-2xl font-bold mb-4">
              Create Task
            </h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-700/80 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-700/80 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 rounded-xl hover:opacity-90 transition duration-300"
            >
              Create Task
            </button>

          </form>

          {/* KANBAN */}

          <div className="grid md:grid-cols-3 gap-6">

            {/* TODO */}

            <Droppable droppableId="Todo">

              {(provided) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl min-h-[500px] border border-slate-700 shadow-xl"
                >

                  <h2 className="text-3xl font-bold mb-5">
                    Todo
                  </h2>

                  <div className="space-y-4">

                    {todoTasks.map((task, index) =>
                      renderTaskCard(task, index)
                    )}

                    {provided.placeholder}

                  </div>

                </div>

              )}

            </Droppable>

            {/* IN PROGRESS */}

            <Droppable droppableId="In Progress">

              {(provided) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl min-h-[500px] border border-slate-700 shadow-xl"
                >

                  <h2 className="text-3xl font-bold mb-5">
                    In Progress
                  </h2>

                  <div className="space-y-4">

                    {inProgressTasks.map((task, index) =>
                      renderTaskCard(task, index)
                    )}

                    {provided.placeholder}

                  </div>

                </div>

              )}

            </Droppable>

            {/* DONE */}

            <Droppable droppableId="Done">

              {(provided) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl min-h-[500px] border border-slate-700 shadow-xl"
                >

                  <h2 className="text-3xl font-bold mb-5">
                    Done
                  </h2>

                  <div className="space-y-4">

                    {doneTasks.map((task, index) =>
                      renderTaskCard(task, index)
                    )}

                    {provided.placeholder}

                  </div>

                </div>

              )}

            </Droppable>

          </div>

        </div>

      </div>

    </DragDropContext>
  );
}