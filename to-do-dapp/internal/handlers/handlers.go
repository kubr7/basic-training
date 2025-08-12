// internal/handlers/handlers.go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourname/todo-dapp/internal/services"
)

type TaskHandler struct {
	blockchainService *services.BlockchainService
}

func NewTaskHandler(blockchainService *services.BlockchainService) *TaskHandler {
	return &TaskHandler{
		blockchainService: blockchainService,
	}
}

type CreateTaskRequest struct {
	AssignedTo  string `json:"assignedTo" binding:"required"`
	Description string `json:"description" binding:"required"`
	Date        uint32 `json:"date" binding:"required"`
}

func (h *TaskHandler) CreateTask(c *gin.Context) {
	var req CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	txHash, err := h.blockchainService.CreateTask(c.Request.Context(), req.AssignedTo, req.Description, req.Date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"txHash": txHash})
}

type DeleteTaskRequest struct {
	TaskId string `json:"taskId" binding:"required"`
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {
	var req DeleteTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	txHash, err := h.blockchainService.DeleteTask(c.Request.Context(), req.TaskId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"txHash": txHash})
}

type ModifyTaskRequest struct {
	TaskId         string `json:"taskId" binding:"required"`
	NewDescription string `json:"newDescription" binding:"required"`
	NewDate        uint32 `json:"newDate" binding:"required"`
}

func (h *TaskHandler) ModifyTask(c *gin.Context) {
	var req ModifyTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	txHash, err := h.blockchainService.ModifyTask(c.Request.Context(), req.TaskId, req.NewDescription, req.NewDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"txHash": txHash})
}

type UpdateTaskStatusRequest struct {
	TaskId    string `json:"taskId" binding:"required"`
	NewStatus uint8  `json:"newStatus" binding:"required"`
}

func (h *TaskHandler) UpdateTaskStatus(c *gin.Context) {
	var req UpdateTaskStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	txHash, err := h.blockchainService.UpdateTaskStatus(c.Request.Context(), req.TaskId, req.NewStatus)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"txHash": txHash})
}

func (h *TaskHandler) GetActiveTasks(c *gin.Context) {
	tasks, err := h.blockchainService.GetActiveTasks(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "todo-dapp",
	})
}
