// internal/routes/routes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kubr7/to-do-dapp/internal/handlers"
)

func SetupRoutes(taskHandler *handlers.TaskHandler) *gin.Engine {
	r := gin.Default()

	// Health check
	r.GET("/health", taskHandler.HealthCheck)

	// API routes
	api := r.Group("/api/v1")
	{
		// Task operations
		api.POST("/tasks", taskHandler.CreateTask)
		api.GET("/tasks", taskHandler.GetActiveTasks)
		api.PUT("/tasks", taskHandler.ModifyTask)
		api.DELETE("/tasks", taskHandler.DeleteTask)
		api.PATCH("/tasks/status", taskHandler.UpdateTaskStatus)
	}

	return r
}
