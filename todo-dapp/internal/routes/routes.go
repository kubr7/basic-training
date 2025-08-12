package routes

import (
	"net/http"

	"github.com/kubr7/todo-dapp/internal/handlers"
)

// SetupRoutes configures all HTTP routes for the application
func SetupRoutes(taskHandler *handlers.TaskHandler) {
	http.HandleFunc("/createTask", taskHandler.CreateTask)
	http.HandleFunc("/getActiveTasks", taskHandler.GetActiveTasks)
	http.HandleFunc("/events", taskHandler.GetEvents)
	http.HandleFunc("/deleteTask", taskHandler.DeleteTask)
	http.HandleFunc("/modifyTask", taskHandler.ModifyTask)
	http.HandleFunc("/updateTaskStatus", taskHandler.UpdateTaskStatus)
}
