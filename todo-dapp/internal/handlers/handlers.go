package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"

	"github.com/kubr7/todo-dapp/internal/services"
)

// TaskHandler handles task-related HTTP requests
type TaskHandler struct {
	blockchainService *services.BlockchainService
	db                *sql.DB
}

// NewTaskHandler creates a new task handler
func NewTaskHandler(blockchainService *services.BlockchainService, db *sql.DB) *TaskHandler {
	return &TaskHandler{
		blockchainService: blockchainService,
		db:                db,
	}
}

// CreateTask handles task creation requests
func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "POST only", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		AssignedTo  string `json:"assignedTo"`
		Description string `json:"description"`
		Date        uint32 `json:"date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
		return
	}

	txHash, err := h.blockchainService.CreateTaskTx(r.Context(), body.AssignedTo, body.Description, body.Date)
	if err != nil {
		http.Error(w, "createTask error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
}

// GetActiveTasks handles active tasks retrieval requests
func (h *TaskHandler) GetActiveTasks(w http.ResponseWriter, r *http.Request) {
	// Call typed method
	callOpts := &bind.CallOpts{Context: r.Context()}
	tasks, err := h.blockchainService.GetContract().GetActiveTasks(callOpts)
	if err != nil {
		http.Error(w, "call error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert to JSON-friendly format
	out := make([]map[string]interface{}, 0, len(tasks))
	for _, t := range tasks {
		out = append(out, h.blockchainService.TaskToMap(t))
	}
	json.NewEncoder(w).Encode(out)
}

// GetEvents handles events retrieval requests
func (h *TaskHandler) GetEvents(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.QueryContext(r.Context(), `SELECT id, event_name, event_data, block_number, tx_hash, created_at FROM todo_events ORDER BY id DESC LIMIT 100`)
	if err != nil {
		http.Error(w, "db query: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type rowOut struct {
		ID          int             `json:"id"`
		EventName   string          `json:"event_name"`
		EventData   json.RawMessage `json:"event_data"`
		BlockNumber int64           `json:"block_number"`
		TxHash      string          `json:"tx_hash"`
		CreatedAt   time.Time       `json:"created_at"`
	}

	var out []rowOut
	for rows.Next() {
		var rrow rowOut
		var ev json.RawMessage
		if err := rows.Scan(&rrow.ID, &rrow.EventName, &ev, &rrow.BlockNumber, &rrow.TxHash, &rrow.CreatedAt); err != nil {
			http.Error(w, "scan: "+err.Error(), http.StatusInternalServerError)
			return
		}
		rrow.EventData = ev
		out = append(out, rrow)
	}
	json.NewEncoder(w).Encode(out)
}

// DeleteTask handles task deletion requests
func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "DELETE only", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		TaskId string `json:"taskId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if body.TaskId == "" {
		http.Error(w, "taskId is required", http.StatusBadRequest)
		return
	}

	txHash, err := h.blockchainService.DeleteTaskTx(r.Context(), body.TaskId)
	if err != nil {
		http.Error(w, "deleteTask error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
}

// ModifyTask handles task modification requests
func (h *TaskHandler) ModifyTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "PUT only", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		TaskId         string `json:"taskId"`
		NewDescription string `json:"newDescription"`
		NewDate        uint32 `json:"newDate"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if body.TaskId == "" {
		http.Error(w, "taskId is required", http.StatusBadRequest)
		return
	}

	if body.NewDescription == "" {
		http.Error(w, "newDescription is required", http.StatusBadRequest)
		return
	}

	txHash, err := h.blockchainService.ModifyTaskTx(r.Context(), body.TaskId, body.NewDescription, body.NewDate)
	if err != nil {
		http.Error(w, "modifyTask error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
}

// UpdateTaskStatus handles task status update requests
func (h *TaskHandler) UpdateTaskStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "PATCH only", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		TaskId    string `json:"taskId"`
		NewStatus uint8  `json:"newStatus"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if body.TaskId == "" {
		http.Error(w, "taskId is required", http.StatusBadRequest)
		return
	}

	txHash, err := h.blockchainService.UpdateTaskStatusTx(r.Context(), body.TaskId, body.NewStatus)
	if err != nil {
		http.Error(w, "updateTaskStatus error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"txHash": txHash})
}
