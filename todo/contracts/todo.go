// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contracts

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// ToDoContractTask is an auto generated low-level Go binding around an user-defined struct.
type ToDoContractTask struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}

// TodoMetaData contains all meta data concerning the Todo contract.
var TodoMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"deletedBy\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskDeleted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"modifiedBy\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"oldDescriptionHash\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"newDescriptionHash\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"oldDate\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"newDate\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskModified\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"updatedBy\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskStatusUpdated\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"}],\"name\":\"createTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint32\",\"name\":\"\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"dateTaskIds\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"}],\"name\":\"deleteTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getActiveTaskCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getActiveTasks\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getAllTasksByUser\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"}],\"name\":\"getTasksByDate\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"_status\",\"type\":\"uint8\"}],\"name\":\"getTasksByStatus\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"_date\",\"type\":\"uint32\"}],\"name\":\"getUserTasksByDate\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"newDescription\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"newDate\",\"type\":\"uint32\"}],\"name\":\"modifyTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"taskCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tasks\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"newStatus\",\"type\":\"uint8\"}],\"name\":\"updateTaskStatus\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"userTaskIds\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// TodoABI is the input ABI used to generate the binding from.
// Deprecated: Use TodoMetaData.ABI instead.
var TodoABI = TodoMetaData.ABI

// Todo is an auto generated Go binding around an Ethereum contract.
type Todo struct {
	TodoCaller     // Read-only binding to the contract
	TodoTransactor // Write-only binding to the contract
	TodoFilterer   // Log filterer for contract events
}

// TodoCaller is an auto generated read-only Go binding around an Ethereum contract.
type TodoCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TodoTransactor is an auto generated write-only Go binding around an Ethereum contract.
type TodoTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TodoFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type TodoFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TodoSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type TodoSession struct {
	Contract     *Todo             // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// TodoCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type TodoCallerSession struct {
	Contract *TodoCaller   // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// TodoTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type TodoTransactorSession struct {
	Contract     *TodoTransactor   // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// TodoRaw is an auto generated low-level Go binding around an Ethereum contract.
type TodoRaw struct {
	Contract *Todo // Generic contract binding to access the raw methods on
}

// TodoCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type TodoCallerRaw struct {
	Contract *TodoCaller // Generic read-only contract binding to access the raw methods on
}

// TodoTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type TodoTransactorRaw struct {
	Contract *TodoTransactor // Generic write-only contract binding to access the raw methods on
}

// NewTodo creates a new instance of Todo, bound to a specific deployed contract.
func NewTodo(address common.Address, backend bind.ContractBackend) (*Todo, error) {
	contract, err := bindTodo(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Todo{TodoCaller: TodoCaller{contract: contract}, TodoTransactor: TodoTransactor{contract: contract}, TodoFilterer: TodoFilterer{contract: contract}}, nil
}

// NewTodoCaller creates a new read-only instance of Todo, bound to a specific deployed contract.
func NewTodoCaller(address common.Address, caller bind.ContractCaller) (*TodoCaller, error) {
	contract, err := bindTodo(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &TodoCaller{contract: contract}, nil
}

// NewTodoTransactor creates a new write-only instance of Todo, bound to a specific deployed contract.
func NewTodoTransactor(address common.Address, transactor bind.ContractTransactor) (*TodoTransactor, error) {
	contract, err := bindTodo(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &TodoTransactor{contract: contract}, nil
}

// NewTodoFilterer creates a new log filterer instance of Todo, bound to a specific deployed contract.
func NewTodoFilterer(address common.Address, filterer bind.ContractFilterer) (*TodoFilterer, error) {
	contract, err := bindTodo(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &TodoFilterer{contract: contract}, nil
}

// bindTodo binds a generic wrapper to an already deployed contract.
func bindTodo(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := TodoMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Todo *TodoRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Todo.Contract.TodoCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Todo *TodoRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Todo.Contract.TodoTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Todo *TodoRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Todo.Contract.TodoTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Todo *TodoCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Todo.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Todo *TodoTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Todo.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Todo *TodoTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Todo.Contract.contract.Transact(opts, method, params...)
}

// DateTaskIds is a free data retrieval call binding the contract method 0xbcbb43f2.
//
// Solidity: function dateTaskIds(uint32 , uint256 ) view returns(uint256)
func (_Todo *TodoCaller) DateTaskIds(opts *bind.CallOpts, arg0 uint32, arg1 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "dateTaskIds", arg0, arg1)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// DateTaskIds is a free data retrieval call binding the contract method 0xbcbb43f2.
//
// Solidity: function dateTaskIds(uint32 , uint256 ) view returns(uint256)
func (_Todo *TodoSession) DateTaskIds(arg0 uint32, arg1 *big.Int) (*big.Int, error) {
	return _Todo.Contract.DateTaskIds(&_Todo.CallOpts, arg0, arg1)
}

// DateTaskIds is a free data retrieval call binding the contract method 0xbcbb43f2.
//
// Solidity: function dateTaskIds(uint32 , uint256 ) view returns(uint256)
func (_Todo *TodoCallerSession) DateTaskIds(arg0 uint32, arg1 *big.Int) (*big.Int, error) {
	return _Todo.Contract.DateTaskIds(&_Todo.CallOpts, arg0, arg1)
}

// GetActiveTaskCount is a free data retrieval call binding the contract method 0x5c41a3af.
//
// Solidity: function getActiveTaskCount() view returns(uint256)
func (_Todo *TodoCaller) GetActiveTaskCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "getActiveTaskCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetActiveTaskCount is a free data retrieval call binding the contract method 0x5c41a3af.
//
// Solidity: function getActiveTaskCount() view returns(uint256)
func (_Todo *TodoSession) GetActiveTaskCount() (*big.Int, error) {
	return _Todo.Contract.GetActiveTaskCount(&_Todo.CallOpts)
}

// GetActiveTaskCount is a free data retrieval call binding the contract method 0x5c41a3af.
//
// Solidity: function getActiveTaskCount() view returns(uint256)
func (_Todo *TodoCallerSession) GetActiveTaskCount() (*big.Int, error) {
	return _Todo.Contract.GetActiveTaskCount(&_Todo.CallOpts)
}

// GetActiveTasks is a free data retrieval call binding the contract method 0x6127f246.
//
// Solidity: function getActiveTasks() view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCaller) GetActiveTasks(opts *bind.CallOpts) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "getActiveTasks")

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetActiveTasks is a free data retrieval call binding the contract method 0x6127f246.
//
// Solidity: function getActiveTasks() view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoSession) GetActiveTasks() ([]ToDoContractTask, error) {
	return _Todo.Contract.GetActiveTasks(&_Todo.CallOpts)
}

// GetActiveTasks is a free data retrieval call binding the contract method 0x6127f246.
//
// Solidity: function getActiveTasks() view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCallerSession) GetActiveTasks() ([]ToDoContractTask, error) {
	return _Todo.Contract.GetActiveTasks(&_Todo.CallOpts)
}

// GetAllTasksByUser is a free data retrieval call binding the contract method 0x1ed618c5.
//
// Solidity: function getAllTasksByUser(address user) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCaller) GetAllTasksByUser(opts *bind.CallOpts, user common.Address) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "getAllTasksByUser", user)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetAllTasksByUser is a free data retrieval call binding the contract method 0x1ed618c5.
//
// Solidity: function getAllTasksByUser(address user) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoSession) GetAllTasksByUser(user common.Address) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetAllTasksByUser(&_Todo.CallOpts, user)
}

// GetAllTasksByUser is a free data retrieval call binding the contract method 0x1ed618c5.
//
// Solidity: function getAllTasksByUser(address user) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCallerSession) GetAllTasksByUser(user common.Address) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetAllTasksByUser(&_Todo.CallOpts, user)
}

// GetTasksByDate is a free data retrieval call binding the contract method 0xaea97707.
//
// Solidity: function getTasksByDate(uint32 date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCaller) GetTasksByDate(opts *bind.CallOpts, date uint32) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "getTasksByDate", date)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetTasksByDate is a free data retrieval call binding the contract method 0xaea97707.
//
// Solidity: function getTasksByDate(uint32 date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoSession) GetTasksByDate(date uint32) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetTasksByDate(&_Todo.CallOpts, date)
}

// GetTasksByDate is a free data retrieval call binding the contract method 0xaea97707.
//
// Solidity: function getTasksByDate(uint32 date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCallerSession) GetTasksByDate(date uint32) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetTasksByDate(&_Todo.CallOpts, date)
}

// GetTasksByStatus is a free data retrieval call binding the contract method 0x3c0b0764.
//
// Solidity: function getTasksByStatus(address user, uint8 _status) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCaller) GetTasksByStatus(opts *bind.CallOpts, user common.Address, _status uint8) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "getTasksByStatus", user, _status)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetTasksByStatus is a free data retrieval call binding the contract method 0x3c0b0764.
//
// Solidity: function getTasksByStatus(address user, uint8 _status) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoSession) GetTasksByStatus(user common.Address, _status uint8) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetTasksByStatus(&_Todo.CallOpts, user, _status)
}

// GetTasksByStatus is a free data retrieval call binding the contract method 0x3c0b0764.
//
// Solidity: function getTasksByStatus(address user, uint8 _status) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCallerSession) GetTasksByStatus(user common.Address, _status uint8) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetTasksByStatus(&_Todo.CallOpts, user, _status)
}

// GetUserTasksByDate is a free data retrieval call binding the contract method 0x28f027b2.
//
// Solidity: function getUserTasksByDate(address user, uint32 _date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCaller) GetUserTasksByDate(opts *bind.CallOpts, user common.Address, _date uint32) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "getUserTasksByDate", user, _date)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetUserTasksByDate is a free data retrieval call binding the contract method 0x28f027b2.
//
// Solidity: function getUserTasksByDate(address user, uint32 _date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoSession) GetUserTasksByDate(user common.Address, _date uint32) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetUserTasksByDate(&_Todo.CallOpts, user, _date)
}

// GetUserTasksByDate is a free data retrieval call binding the contract method 0x28f027b2.
//
// Solidity: function getUserTasksByDate(address user, uint32 _date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Todo *TodoCallerSession) GetUserTasksByDate(user common.Address, _date uint32) ([]ToDoContractTask, error) {
	return _Todo.Contract.GetUserTasksByDate(&_Todo.CallOpts, user, _date)
}

// TaskCount is a free data retrieval call binding the contract method 0xb6cb58a5.
//
// Solidity: function taskCount() view returns(uint256)
func (_Todo *TodoCaller) TaskCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "taskCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TaskCount is a free data retrieval call binding the contract method 0xb6cb58a5.
//
// Solidity: function taskCount() view returns(uint256)
func (_Todo *TodoSession) TaskCount() (*big.Int, error) {
	return _Todo.Contract.TaskCount(&_Todo.CallOpts)
}

// TaskCount is a free data retrieval call binding the contract method 0xb6cb58a5.
//
// Solidity: function taskCount() view returns(uint256)
func (_Todo *TodoCallerSession) TaskCount() (*big.Int, error) {
	return _Todo.Contract.TaskCount(&_Todo.CallOpts)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(uint256 id, address creator, address assignedTo, string description, uint32 date, uint8 status, bool isDeleted, bool isModified)
func (_Todo *TodoCaller) Tasks(opts *bind.CallOpts, arg0 *big.Int) (struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "tasks", arg0)

	outstruct := new(struct {
		Id          *big.Int
		Creator     common.Address
		AssignedTo  common.Address
		Description string
		Date        uint32
		Status      uint8
		IsDeleted   bool
		IsModified  bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Id = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.Creator = *abi.ConvertType(out[1], new(common.Address)).(*common.Address)
	outstruct.AssignedTo = *abi.ConvertType(out[2], new(common.Address)).(*common.Address)
	outstruct.Description = *abi.ConvertType(out[3], new(string)).(*string)
	outstruct.Date = *abi.ConvertType(out[4], new(uint32)).(*uint32)
	outstruct.Status = *abi.ConvertType(out[5], new(uint8)).(*uint8)
	outstruct.IsDeleted = *abi.ConvertType(out[6], new(bool)).(*bool)
	outstruct.IsModified = *abi.ConvertType(out[7], new(bool)).(*bool)

	return *outstruct, err

}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(uint256 id, address creator, address assignedTo, string description, uint32 date, uint8 status, bool isDeleted, bool isModified)
func (_Todo *TodoSession) Tasks(arg0 *big.Int) (struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}, error) {
	return _Todo.Contract.Tasks(&_Todo.CallOpts, arg0)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(uint256 id, address creator, address assignedTo, string description, uint32 date, uint8 status, bool isDeleted, bool isModified)
func (_Todo *TodoCallerSession) Tasks(arg0 *big.Int) (struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}, error) {
	return _Todo.Contract.Tasks(&_Todo.CallOpts, arg0)
}

// UserTaskIds is a free data retrieval call binding the contract method 0x499d5627.
//
// Solidity: function userTaskIds(address , uint256 ) view returns(uint256)
func (_Todo *TodoCaller) UserTaskIds(opts *bind.CallOpts, arg0 common.Address, arg1 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Todo.contract.Call(opts, &out, "userTaskIds", arg0, arg1)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserTaskIds is a free data retrieval call binding the contract method 0x499d5627.
//
// Solidity: function userTaskIds(address , uint256 ) view returns(uint256)
func (_Todo *TodoSession) UserTaskIds(arg0 common.Address, arg1 *big.Int) (*big.Int, error) {
	return _Todo.Contract.UserTaskIds(&_Todo.CallOpts, arg0, arg1)
}

// UserTaskIds is a free data retrieval call binding the contract method 0x499d5627.
//
// Solidity: function userTaskIds(address , uint256 ) view returns(uint256)
func (_Todo *TodoCallerSession) UserTaskIds(arg0 common.Address, arg1 *big.Int) (*big.Int, error) {
	return _Todo.Contract.UserTaskIds(&_Todo.CallOpts, arg0, arg1)
}

// CreateTask is a paid mutator transaction binding the contract method 0x988361be.
//
// Solidity: function createTask(address assignedTo, string description, uint32 date) returns()
func (_Todo *TodoTransactor) CreateTask(opts *bind.TransactOpts, assignedTo common.Address, description string, date uint32) (*types.Transaction, error) {
	return _Todo.contract.Transact(opts, "createTask", assignedTo, description, date)
}

// CreateTask is a paid mutator transaction binding the contract method 0x988361be.
//
// Solidity: function createTask(address assignedTo, string description, uint32 date) returns()
func (_Todo *TodoSession) CreateTask(assignedTo common.Address, description string, date uint32) (*types.Transaction, error) {
	return _Todo.Contract.CreateTask(&_Todo.TransactOpts, assignedTo, description, date)
}

// CreateTask is a paid mutator transaction binding the contract method 0x988361be.
//
// Solidity: function createTask(address assignedTo, string description, uint32 date) returns()
func (_Todo *TodoTransactorSession) CreateTask(assignedTo common.Address, description string, date uint32) (*types.Transaction, error) {
	return _Todo.Contract.CreateTask(&_Todo.TransactOpts, assignedTo, description, date)
}

// DeleteTask is a paid mutator transaction binding the contract method 0x560f3192.
//
// Solidity: function deleteTask(uint256 taskId) returns()
func (_Todo *TodoTransactor) DeleteTask(opts *bind.TransactOpts, taskId *big.Int) (*types.Transaction, error) {
	return _Todo.contract.Transact(opts, "deleteTask", taskId)
}

// DeleteTask is a paid mutator transaction binding the contract method 0x560f3192.
//
// Solidity: function deleteTask(uint256 taskId) returns()
func (_Todo *TodoSession) DeleteTask(taskId *big.Int) (*types.Transaction, error) {
	return _Todo.Contract.DeleteTask(&_Todo.TransactOpts, taskId)
}

// DeleteTask is a paid mutator transaction binding the contract method 0x560f3192.
//
// Solidity: function deleteTask(uint256 taskId) returns()
func (_Todo *TodoTransactorSession) DeleteTask(taskId *big.Int) (*types.Transaction, error) {
	return _Todo.Contract.DeleteTask(&_Todo.TransactOpts, taskId)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x62f2ff8a.
//
// Solidity: function modifyTask(uint256 taskId, string newDescription, uint32 newDate) returns()
func (_Todo *TodoTransactor) ModifyTask(opts *bind.TransactOpts, taskId *big.Int, newDescription string, newDate uint32) (*types.Transaction, error) {
	return _Todo.contract.Transact(opts, "modifyTask", taskId, newDescription, newDate)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x62f2ff8a.
//
// Solidity: function modifyTask(uint256 taskId, string newDescription, uint32 newDate) returns()
func (_Todo *TodoSession) ModifyTask(taskId *big.Int, newDescription string, newDate uint32) (*types.Transaction, error) {
	return _Todo.Contract.ModifyTask(&_Todo.TransactOpts, taskId, newDescription, newDate)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x62f2ff8a.
//
// Solidity: function modifyTask(uint256 taskId, string newDescription, uint32 newDate) returns()
func (_Todo *TodoTransactorSession) ModifyTask(taskId *big.Int, newDescription string, newDate uint32) (*types.Transaction, error) {
	return _Todo.Contract.ModifyTask(&_Todo.TransactOpts, taskId, newDescription, newDate)
}

// UpdateTaskStatus is a paid mutator transaction binding the contract method 0xab9b6811.
//
// Solidity: function updateTaskStatus(uint256 taskId, uint8 newStatus) returns()
func (_Todo *TodoTransactor) UpdateTaskStatus(opts *bind.TransactOpts, taskId *big.Int, newStatus uint8) (*types.Transaction, error) {
	return _Todo.contract.Transact(opts, "updateTaskStatus", taskId, newStatus)
}

// UpdateTaskStatus is a paid mutator transaction binding the contract method 0xab9b6811.
//
// Solidity: function updateTaskStatus(uint256 taskId, uint8 newStatus) returns()
func (_Todo *TodoSession) UpdateTaskStatus(taskId *big.Int, newStatus uint8) (*types.Transaction, error) {
	return _Todo.Contract.UpdateTaskStatus(&_Todo.TransactOpts, taskId, newStatus)
}

// UpdateTaskStatus is a paid mutator transaction binding the contract method 0xab9b6811.
//
// Solidity: function updateTaskStatus(uint256 taskId, uint8 newStatus) returns()
func (_Todo *TodoTransactorSession) UpdateTaskStatus(taskId *big.Int, newStatus uint8) (*types.Transaction, error) {
	return _Todo.Contract.UpdateTaskStatus(&_Todo.TransactOpts, taskId, newStatus)
}

// TodoTaskCreatedIterator is returned from FilterTaskCreated and is used to iterate over the raw logs and unpacked data for TaskCreated events raised by the Todo contract.
type TodoTaskCreatedIterator struct {
	Event *TodoTaskCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *TodoTaskCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TodoTaskCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(TodoTaskCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *TodoTaskCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TodoTaskCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TodoTaskCreated represents a TaskCreated event raised by the Todo contract.
type TodoTaskCreated struct {
	TaskId     *big.Int
	Creator    common.Address
	AssignedTo common.Address
	Date       uint32
	Status     uint8
	Timestamp  *big.Int
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterTaskCreated is a free log retrieval operation binding the contract event 0xcaa531b147f5e32fae563951c9d50c9febedb2a677750e0f0314f94c2b50f5fa.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address indexed creator, address indexed assignedTo, uint32 date, uint8 status, uint256 timestamp)
func (_Todo *TodoFilterer) FilterTaskCreated(opts *bind.FilterOpts, taskId []*big.Int, creator []common.Address, assignedTo []common.Address) (*TodoTaskCreatedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var creatorRule []interface{}
	for _, creatorItem := range creator {
		creatorRule = append(creatorRule, creatorItem)
	}
	var assignedToRule []interface{}
	for _, assignedToItem := range assignedTo {
		assignedToRule = append(assignedToRule, assignedToItem)
	}

	logs, sub, err := _Todo.contract.FilterLogs(opts, "TaskCreated", taskIdRule, creatorRule, assignedToRule)
	if err != nil {
		return nil, err
	}
	return &TodoTaskCreatedIterator{contract: _Todo.contract, event: "TaskCreated", logs: logs, sub: sub}, nil
}

// WatchTaskCreated is a free log subscription operation binding the contract event 0xcaa531b147f5e32fae563951c9d50c9febedb2a677750e0f0314f94c2b50f5fa.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address indexed creator, address indexed assignedTo, uint32 date, uint8 status, uint256 timestamp)
func (_Todo *TodoFilterer) WatchTaskCreated(opts *bind.WatchOpts, sink chan<- *TodoTaskCreated, taskId []*big.Int, creator []common.Address, assignedTo []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var creatorRule []interface{}
	for _, creatorItem := range creator {
		creatorRule = append(creatorRule, creatorItem)
	}
	var assignedToRule []interface{}
	for _, assignedToItem := range assignedTo {
		assignedToRule = append(assignedToRule, assignedToItem)
	}

	logs, sub, err := _Todo.contract.WatchLogs(opts, "TaskCreated", taskIdRule, creatorRule, assignedToRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TodoTaskCreated)
				if err := _Todo.contract.UnpackLog(event, "TaskCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskCreated is a log parse operation binding the contract event 0xcaa531b147f5e32fae563951c9d50c9febedb2a677750e0f0314f94c2b50f5fa.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address indexed creator, address indexed assignedTo, uint32 date, uint8 status, uint256 timestamp)
func (_Todo *TodoFilterer) ParseTaskCreated(log types.Log) (*TodoTaskCreated, error) {
	event := new(TodoTaskCreated)
	if err := _Todo.contract.UnpackLog(event, "TaskCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TodoTaskDeletedIterator is returned from FilterTaskDeleted and is used to iterate over the raw logs and unpacked data for TaskDeleted events raised by the Todo contract.
type TodoTaskDeletedIterator struct {
	Event *TodoTaskDeleted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *TodoTaskDeletedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TodoTaskDeleted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(TodoTaskDeleted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *TodoTaskDeletedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TodoTaskDeletedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TodoTaskDeleted represents a TaskDeleted event raised by the Todo contract.
type TodoTaskDeleted struct {
	TaskId    *big.Int
	DeletedBy common.Address
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTaskDeleted is a free log retrieval operation binding the contract event 0x0752dde00495a9fda916c836f0f9e13b19edac46a7eebef960aa0a5cdb7736ca.
//
// Solidity: event TaskDeleted(uint256 indexed taskId, address indexed deletedBy, uint256 timestamp)
func (_Todo *TodoFilterer) FilterTaskDeleted(opts *bind.FilterOpts, taskId []*big.Int, deletedBy []common.Address) (*TodoTaskDeletedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var deletedByRule []interface{}
	for _, deletedByItem := range deletedBy {
		deletedByRule = append(deletedByRule, deletedByItem)
	}

	logs, sub, err := _Todo.contract.FilterLogs(opts, "TaskDeleted", taskIdRule, deletedByRule)
	if err != nil {
		return nil, err
	}
	return &TodoTaskDeletedIterator{contract: _Todo.contract, event: "TaskDeleted", logs: logs, sub: sub}, nil
}

// WatchTaskDeleted is a free log subscription operation binding the contract event 0x0752dde00495a9fda916c836f0f9e13b19edac46a7eebef960aa0a5cdb7736ca.
//
// Solidity: event TaskDeleted(uint256 indexed taskId, address indexed deletedBy, uint256 timestamp)
func (_Todo *TodoFilterer) WatchTaskDeleted(opts *bind.WatchOpts, sink chan<- *TodoTaskDeleted, taskId []*big.Int, deletedBy []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var deletedByRule []interface{}
	for _, deletedByItem := range deletedBy {
		deletedByRule = append(deletedByRule, deletedByItem)
	}

	logs, sub, err := _Todo.contract.WatchLogs(opts, "TaskDeleted", taskIdRule, deletedByRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TodoTaskDeleted)
				if err := _Todo.contract.UnpackLog(event, "TaskDeleted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskDeleted is a log parse operation binding the contract event 0x0752dde00495a9fda916c836f0f9e13b19edac46a7eebef960aa0a5cdb7736ca.
//
// Solidity: event TaskDeleted(uint256 indexed taskId, address indexed deletedBy, uint256 timestamp)
func (_Todo *TodoFilterer) ParseTaskDeleted(log types.Log) (*TodoTaskDeleted, error) {
	event := new(TodoTaskDeleted)
	if err := _Todo.contract.UnpackLog(event, "TaskDeleted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TodoTaskModifiedIterator is returned from FilterTaskModified and is used to iterate over the raw logs and unpacked data for TaskModified events raised by the Todo contract.
type TodoTaskModifiedIterator struct {
	Event *TodoTaskModified // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *TodoTaskModifiedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TodoTaskModified)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(TodoTaskModified)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *TodoTaskModifiedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TodoTaskModifiedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TodoTaskModified represents a TaskModified event raised by the Todo contract.
type TodoTaskModified struct {
	TaskId             *big.Int
	ModifiedBy         common.Address
	OldDescriptionHash [32]byte
	NewDescriptionHash [32]byte
	OldDate            uint32
	NewDate            uint32
	Timestamp          *big.Int
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterTaskModified is a free log retrieval operation binding the contract event 0xd6ec681ab576080c2d87a4b3d3e62b3d4e768efc8e17b814816a73b593d287cd.
//
// Solidity: event TaskModified(uint256 indexed taskId, address indexed modifiedBy, bytes32 oldDescriptionHash, bytes32 newDescriptionHash, uint32 oldDate, uint32 newDate, uint256 timestamp)
func (_Todo *TodoFilterer) FilterTaskModified(opts *bind.FilterOpts, taskId []*big.Int, modifiedBy []common.Address) (*TodoTaskModifiedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var modifiedByRule []interface{}
	for _, modifiedByItem := range modifiedBy {
		modifiedByRule = append(modifiedByRule, modifiedByItem)
	}

	logs, sub, err := _Todo.contract.FilterLogs(opts, "TaskModified", taskIdRule, modifiedByRule)
	if err != nil {
		return nil, err
	}
	return &TodoTaskModifiedIterator{contract: _Todo.contract, event: "TaskModified", logs: logs, sub: sub}, nil
}

// WatchTaskModified is a free log subscription operation binding the contract event 0xd6ec681ab576080c2d87a4b3d3e62b3d4e768efc8e17b814816a73b593d287cd.
//
// Solidity: event TaskModified(uint256 indexed taskId, address indexed modifiedBy, bytes32 oldDescriptionHash, bytes32 newDescriptionHash, uint32 oldDate, uint32 newDate, uint256 timestamp)
func (_Todo *TodoFilterer) WatchTaskModified(opts *bind.WatchOpts, sink chan<- *TodoTaskModified, taskId []*big.Int, modifiedBy []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var modifiedByRule []interface{}
	for _, modifiedByItem := range modifiedBy {
		modifiedByRule = append(modifiedByRule, modifiedByItem)
	}

	logs, sub, err := _Todo.contract.WatchLogs(opts, "TaskModified", taskIdRule, modifiedByRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TodoTaskModified)
				if err := _Todo.contract.UnpackLog(event, "TaskModified", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskModified is a log parse operation binding the contract event 0xd6ec681ab576080c2d87a4b3d3e62b3d4e768efc8e17b814816a73b593d287cd.
//
// Solidity: event TaskModified(uint256 indexed taskId, address indexed modifiedBy, bytes32 oldDescriptionHash, bytes32 newDescriptionHash, uint32 oldDate, uint32 newDate, uint256 timestamp)
func (_Todo *TodoFilterer) ParseTaskModified(log types.Log) (*TodoTaskModified, error) {
	event := new(TodoTaskModified)
	if err := _Todo.contract.UnpackLog(event, "TaskModified", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// TodoTaskStatusUpdatedIterator is returned from FilterTaskStatusUpdated and is used to iterate over the raw logs and unpacked data for TaskStatusUpdated events raised by the Todo contract.
type TodoTaskStatusUpdatedIterator struct {
	Event *TodoTaskStatusUpdated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *TodoTaskStatusUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(TodoTaskStatusUpdated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(TodoTaskStatusUpdated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *TodoTaskStatusUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *TodoTaskStatusUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// TodoTaskStatusUpdated represents a TaskStatusUpdated event raised by the Todo contract.
type TodoTaskStatusUpdated struct {
	TaskId    *big.Int
	UpdatedBy common.Address
	Status    uint8
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTaskStatusUpdated is a free log retrieval operation binding the contract event 0xc8aa340b5c35d853bf5df4f527973f3b7817dea792441f810a6a10fce64fc56d.
//
// Solidity: event TaskStatusUpdated(uint256 indexed taskId, address updatedBy, uint8 status, uint256 timestamp)
func (_Todo *TodoFilterer) FilterTaskStatusUpdated(opts *bind.FilterOpts, taskId []*big.Int) (*TodoTaskStatusUpdatedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Todo.contract.FilterLogs(opts, "TaskStatusUpdated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &TodoTaskStatusUpdatedIterator{contract: _Todo.contract, event: "TaskStatusUpdated", logs: logs, sub: sub}, nil
}

// WatchTaskStatusUpdated is a free log subscription operation binding the contract event 0xc8aa340b5c35d853bf5df4f527973f3b7817dea792441f810a6a10fce64fc56d.
//
// Solidity: event TaskStatusUpdated(uint256 indexed taskId, address updatedBy, uint8 status, uint256 timestamp)
func (_Todo *TodoFilterer) WatchTaskStatusUpdated(opts *bind.WatchOpts, sink chan<- *TodoTaskStatusUpdated, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Todo.contract.WatchLogs(opts, "TaskStatusUpdated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(TodoTaskStatusUpdated)
				if err := _Todo.contract.UnpackLog(event, "TaskStatusUpdated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTaskStatusUpdated is a log parse operation binding the contract event 0xc8aa340b5c35d853bf5df4f527973f3b7817dea792441f810a6a10fce64fc56d.
//
// Solidity: event TaskStatusUpdated(uint256 indexed taskId, address updatedBy, uint8 status, uint256 timestamp)
func (_Todo *TodoFilterer) ParseTaskStatusUpdated(log types.Log) (*TodoTaskStatusUpdated, error) {
	event := new(TodoTaskStatusUpdated)
	if err := _Todo.contract.UnpackLog(event, "TaskStatusUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
