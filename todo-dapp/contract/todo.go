// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contract

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

// ContractMetaData contains all meta data concerning the Contract contract.
var ContractMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"deletedBy\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskDeleted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"modifiedBy\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"oldDescriptionHash\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"newDescriptionHash\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"oldDate\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"newDate\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskModified\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"updatedBy\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"TaskStatusUpdated\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"}],\"name\":\"createTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint32\",\"name\":\"\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"dateTaskIds\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"}],\"name\":\"deleteTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getActiveTaskCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getActiveTasks\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getAllTasksByUser\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"}],\"name\":\"getTasksByDate\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"_status\",\"type\":\"uint8\"}],\"name\":\"getTasksByStatus\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"_date\",\"type\":\"uint32\"}],\"name\":\"getUserTasksByDate\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"internalType\":\"structToDoContract.Task[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"newDescription\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"newDate\",\"type\":\"uint32\"}],\"name\":\"modifyTask\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"taskCount\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tasks\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"creator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"assignedTo\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"},{\"internalType\":\"uint32\",\"name\":\"date\",\"type\":\"uint32\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"status\",\"type\":\"uint8\"},{\"internalType\":\"bool\",\"name\":\"isDeleted\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isModified\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"taskId\",\"type\":\"uint256\"},{\"internalType\":\"enumToDoContract.TaskStatus\",\"name\":\"newStatus\",\"type\":\"uint8\"}],\"name\":\"updateTaskStatus\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"userTaskIds\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// ContractABI is the input ABI used to generate the binding from.
// Deprecated: Use ContractMetaData.ABI instead.
var ContractABI = ContractMetaData.ABI

// Contract is an auto generated Go binding around an Ethereum contract.
type Contract struct {
	ContractCaller     // Read-only binding to the contract
	ContractTransactor // Write-only binding to the contract
	ContractFilterer   // Log filterer for contract events
}

// ContractCaller is an auto generated read-only Go binding around an Ethereum contract.
type ContractCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ContractTransactor is an auto generated write-only Go binding around an Ethereum contract.
type ContractTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ContractFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type ContractFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ContractSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type ContractSession struct {
	Contract     *Contract         // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// ContractCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type ContractCallerSession struct {
	Contract *ContractCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts   // Call options to use throughout this session
}

// ContractTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type ContractTransactorSession struct {
	Contract     *ContractTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts   // Transaction auth options to use throughout this session
}

// ContractRaw is an auto generated low-level Go binding around an Ethereum contract.
type ContractRaw struct {
	Contract *Contract // Generic contract binding to access the raw methods on
}

// ContractCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type ContractCallerRaw struct {
	Contract *ContractCaller // Generic read-only contract binding to access the raw methods on
}

// ContractTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type ContractTransactorRaw struct {
	Contract *ContractTransactor // Generic write-only contract binding to access the raw methods on
}

// NewContract creates a new instance of Contract, bound to a specific deployed contract.
func NewContract(address common.Address, backend bind.ContractBackend) (*Contract, error) {
	contract, err := bindContract(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Contract{ContractCaller: ContractCaller{contract: contract}, ContractTransactor: ContractTransactor{contract: contract}, ContractFilterer: ContractFilterer{contract: contract}}, nil
}

// NewContractCaller creates a new read-only instance of Contract, bound to a specific deployed contract.
func NewContractCaller(address common.Address, caller bind.ContractCaller) (*ContractCaller, error) {
	contract, err := bindContract(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &ContractCaller{contract: contract}, nil
}

// NewContractTransactor creates a new write-only instance of Contract, bound to a specific deployed contract.
func NewContractTransactor(address common.Address, transactor bind.ContractTransactor) (*ContractTransactor, error) {
	contract, err := bindContract(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &ContractTransactor{contract: contract}, nil
}

// NewContractFilterer creates a new log filterer instance of Contract, bound to a specific deployed contract.
func NewContractFilterer(address common.Address, filterer bind.ContractFilterer) (*ContractFilterer, error) {
	contract, err := bindContract(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &ContractFilterer{contract: contract}, nil
}

// bindContract binds a generic wrapper to an already deployed contract.
func bindContract(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := ContractMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Contract *ContractRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Contract.Contract.ContractCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Contract *ContractRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Contract.Contract.ContractTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Contract *ContractRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Contract.Contract.ContractTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Contract *ContractCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Contract.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Contract *ContractTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Contract.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Contract *ContractTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Contract.Contract.contract.Transact(opts, method, params...)
}

// DateTaskIds is a free data retrieval call binding the contract method 0xbcbb43f2.
//
// Solidity: function dateTaskIds(uint32 , uint256 ) view returns(uint256)
func (_Contract *ContractCaller) DateTaskIds(opts *bind.CallOpts, arg0 uint32, arg1 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "dateTaskIds", arg0, arg1)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// DateTaskIds is a free data retrieval call binding the contract method 0xbcbb43f2.
//
// Solidity: function dateTaskIds(uint32 , uint256 ) view returns(uint256)
func (_Contract *ContractSession) DateTaskIds(arg0 uint32, arg1 *big.Int) (*big.Int, error) {
	return _Contract.Contract.DateTaskIds(&_Contract.CallOpts, arg0, arg1)
}

// DateTaskIds is a free data retrieval call binding the contract method 0xbcbb43f2.
//
// Solidity: function dateTaskIds(uint32 , uint256 ) view returns(uint256)
func (_Contract *ContractCallerSession) DateTaskIds(arg0 uint32, arg1 *big.Int) (*big.Int, error) {
	return _Contract.Contract.DateTaskIds(&_Contract.CallOpts, arg0, arg1)
}

// GetActiveTaskCount is a free data retrieval call binding the contract method 0x5c41a3af.
//
// Solidity: function getActiveTaskCount() view returns(uint256)
func (_Contract *ContractCaller) GetActiveTaskCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "getActiveTaskCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetActiveTaskCount is a free data retrieval call binding the contract method 0x5c41a3af.
//
// Solidity: function getActiveTaskCount() view returns(uint256)
func (_Contract *ContractSession) GetActiveTaskCount() (*big.Int, error) {
	return _Contract.Contract.GetActiveTaskCount(&_Contract.CallOpts)
}

// GetActiveTaskCount is a free data retrieval call binding the contract method 0x5c41a3af.
//
// Solidity: function getActiveTaskCount() view returns(uint256)
func (_Contract *ContractCallerSession) GetActiveTaskCount() (*big.Int, error) {
	return _Contract.Contract.GetActiveTaskCount(&_Contract.CallOpts)
}

// GetActiveTasks is a free data retrieval call binding the contract method 0x6127f246.
//
// Solidity: function getActiveTasks() view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCaller) GetActiveTasks(opts *bind.CallOpts) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "getActiveTasks")

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetActiveTasks is a free data retrieval call binding the contract method 0x6127f246.
//
// Solidity: function getActiveTasks() view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractSession) GetActiveTasks() ([]ToDoContractTask, error) {
	return _Contract.Contract.GetActiveTasks(&_Contract.CallOpts)
}

// GetActiveTasks is a free data retrieval call binding the contract method 0x6127f246.
//
// Solidity: function getActiveTasks() view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCallerSession) GetActiveTasks() ([]ToDoContractTask, error) {
	return _Contract.Contract.GetActiveTasks(&_Contract.CallOpts)
}

// GetAllTasksByUser is a free data retrieval call binding the contract method 0x1ed618c5.
//
// Solidity: function getAllTasksByUser(address user) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCaller) GetAllTasksByUser(opts *bind.CallOpts, user common.Address) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "getAllTasksByUser", user)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetAllTasksByUser is a free data retrieval call binding the contract method 0x1ed618c5.
//
// Solidity: function getAllTasksByUser(address user) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractSession) GetAllTasksByUser(user common.Address) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetAllTasksByUser(&_Contract.CallOpts, user)
}

// GetAllTasksByUser is a free data retrieval call binding the contract method 0x1ed618c5.
//
// Solidity: function getAllTasksByUser(address user) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCallerSession) GetAllTasksByUser(user common.Address) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetAllTasksByUser(&_Contract.CallOpts, user)
}

// GetTasksByDate is a free data retrieval call binding the contract method 0xaea97707.
//
// Solidity: function getTasksByDate(uint32 date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCaller) GetTasksByDate(opts *bind.CallOpts, date uint32) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "getTasksByDate", date)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetTasksByDate is a free data retrieval call binding the contract method 0xaea97707.
//
// Solidity: function getTasksByDate(uint32 date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractSession) GetTasksByDate(date uint32) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetTasksByDate(&_Contract.CallOpts, date)
}

// GetTasksByDate is a free data retrieval call binding the contract method 0xaea97707.
//
// Solidity: function getTasksByDate(uint32 date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCallerSession) GetTasksByDate(date uint32) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetTasksByDate(&_Contract.CallOpts, date)
}

// GetTasksByStatus is a free data retrieval call binding the contract method 0x3c0b0764.
//
// Solidity: function getTasksByStatus(address user, uint8 _status) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCaller) GetTasksByStatus(opts *bind.CallOpts, user common.Address, _status uint8) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "getTasksByStatus", user, _status)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetTasksByStatus is a free data retrieval call binding the contract method 0x3c0b0764.
//
// Solidity: function getTasksByStatus(address user, uint8 _status) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractSession) GetTasksByStatus(user common.Address, _status uint8) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetTasksByStatus(&_Contract.CallOpts, user, _status)
}

// GetTasksByStatus is a free data retrieval call binding the contract method 0x3c0b0764.
//
// Solidity: function getTasksByStatus(address user, uint8 _status) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCallerSession) GetTasksByStatus(user common.Address, _status uint8) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetTasksByStatus(&_Contract.CallOpts, user, _status)
}

// GetUserTasksByDate is a free data retrieval call binding the contract method 0x28f027b2.
//
// Solidity: function getUserTasksByDate(address user, uint32 _date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCaller) GetUserTasksByDate(opts *bind.CallOpts, user common.Address, _date uint32) ([]ToDoContractTask, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "getUserTasksByDate", user, _date)

	if err != nil {
		return *new([]ToDoContractTask), err
	}

	out0 := *abi.ConvertType(out[0], new([]ToDoContractTask)).(*[]ToDoContractTask)

	return out0, err

}

// GetUserTasksByDate is a free data retrieval call binding the contract method 0x28f027b2.
//
// Solidity: function getUserTasksByDate(address user, uint32 _date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractSession) GetUserTasksByDate(user common.Address, _date uint32) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetUserTasksByDate(&_Contract.CallOpts, user, _date)
}

// GetUserTasksByDate is a free data retrieval call binding the contract method 0x28f027b2.
//
// Solidity: function getUserTasksByDate(address user, uint32 _date) view returns((uint256,address,address,string,uint32,uint8,bool,bool)[])
func (_Contract *ContractCallerSession) GetUserTasksByDate(user common.Address, _date uint32) ([]ToDoContractTask, error) {
	return _Contract.Contract.GetUserTasksByDate(&_Contract.CallOpts, user, _date)
}

// TaskCount is a free data retrieval call binding the contract method 0xb6cb58a5.
//
// Solidity: function taskCount() view returns(uint256)
func (_Contract *ContractCaller) TaskCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "taskCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TaskCount is a free data retrieval call binding the contract method 0xb6cb58a5.
//
// Solidity: function taskCount() view returns(uint256)
func (_Contract *ContractSession) TaskCount() (*big.Int, error) {
	return _Contract.Contract.TaskCount(&_Contract.CallOpts)
}

// TaskCount is a free data retrieval call binding the contract method 0xb6cb58a5.
//
// Solidity: function taskCount() view returns(uint256)
func (_Contract *ContractCallerSession) TaskCount() (*big.Int, error) {
	return _Contract.Contract.TaskCount(&_Contract.CallOpts)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(uint256 id, address creator, address assignedTo, string description, uint32 date, uint8 status, bool isDeleted, bool isModified)
func (_Contract *ContractCaller) Tasks(opts *bind.CallOpts, arg0 *big.Int) (struct {
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
	err := _Contract.contract.Call(opts, &out, "tasks", arg0)

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
func (_Contract *ContractSession) Tasks(arg0 *big.Int) (struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}, error) {
	return _Contract.Contract.Tasks(&_Contract.CallOpts, arg0)
}

// Tasks is a free data retrieval call binding the contract method 0x8d977672.
//
// Solidity: function tasks(uint256 ) view returns(uint256 id, address creator, address assignedTo, string description, uint32 date, uint8 status, bool isDeleted, bool isModified)
func (_Contract *ContractCallerSession) Tasks(arg0 *big.Int) (struct {
	Id          *big.Int
	Creator     common.Address
	AssignedTo  common.Address
	Description string
	Date        uint32
	Status      uint8
	IsDeleted   bool
	IsModified  bool
}, error) {
	return _Contract.Contract.Tasks(&_Contract.CallOpts, arg0)
}

// UserTaskIds is a free data retrieval call binding the contract method 0x499d5627.
//
// Solidity: function userTaskIds(address , uint256 ) view returns(uint256)
func (_Contract *ContractCaller) UserTaskIds(opts *bind.CallOpts, arg0 common.Address, arg1 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Contract.contract.Call(opts, &out, "userTaskIds", arg0, arg1)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// UserTaskIds is a free data retrieval call binding the contract method 0x499d5627.
//
// Solidity: function userTaskIds(address , uint256 ) view returns(uint256)
func (_Contract *ContractSession) UserTaskIds(arg0 common.Address, arg1 *big.Int) (*big.Int, error) {
	return _Contract.Contract.UserTaskIds(&_Contract.CallOpts, arg0, arg1)
}

// UserTaskIds is a free data retrieval call binding the contract method 0x499d5627.
//
// Solidity: function userTaskIds(address , uint256 ) view returns(uint256)
func (_Contract *ContractCallerSession) UserTaskIds(arg0 common.Address, arg1 *big.Int) (*big.Int, error) {
	return _Contract.Contract.UserTaskIds(&_Contract.CallOpts, arg0, arg1)
}

// CreateTask is a paid mutator transaction binding the contract method 0x988361be.
//
// Solidity: function createTask(address assignedTo, string description, uint32 date) returns()
func (_Contract *ContractTransactor) CreateTask(opts *bind.TransactOpts, assignedTo common.Address, description string, date uint32) (*types.Transaction, error) {
	return _Contract.contract.Transact(opts, "createTask", assignedTo, description, date)
}

// CreateTask is a paid mutator transaction binding the contract method 0x988361be.
//
// Solidity: function createTask(address assignedTo, string description, uint32 date) returns()
func (_Contract *ContractSession) CreateTask(assignedTo common.Address, description string, date uint32) (*types.Transaction, error) {
	return _Contract.Contract.CreateTask(&_Contract.TransactOpts, assignedTo, description, date)
}

// CreateTask is a paid mutator transaction binding the contract method 0x988361be.
//
// Solidity: function createTask(address assignedTo, string description, uint32 date) returns()
func (_Contract *ContractTransactorSession) CreateTask(assignedTo common.Address, description string, date uint32) (*types.Transaction, error) {
	return _Contract.Contract.CreateTask(&_Contract.TransactOpts, assignedTo, description, date)
}

// DeleteTask is a paid mutator transaction binding the contract method 0x560f3192.
//
// Solidity: function deleteTask(uint256 taskId) returns()
func (_Contract *ContractTransactor) DeleteTask(opts *bind.TransactOpts, taskId *big.Int) (*types.Transaction, error) {
	return _Contract.contract.Transact(opts, "deleteTask", taskId)
}

// DeleteTask is a paid mutator transaction binding the contract method 0x560f3192.
//
// Solidity: function deleteTask(uint256 taskId) returns()
func (_Contract *ContractSession) DeleteTask(taskId *big.Int) (*types.Transaction, error) {
	return _Contract.Contract.DeleteTask(&_Contract.TransactOpts, taskId)
}

// DeleteTask is a paid mutator transaction binding the contract method 0x560f3192.
//
// Solidity: function deleteTask(uint256 taskId) returns()
func (_Contract *ContractTransactorSession) DeleteTask(taskId *big.Int) (*types.Transaction, error) {
	return _Contract.Contract.DeleteTask(&_Contract.TransactOpts, taskId)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x62f2ff8a.
//
// Solidity: function modifyTask(uint256 taskId, string newDescription, uint32 newDate) returns()
func (_Contract *ContractTransactor) ModifyTask(opts *bind.TransactOpts, taskId *big.Int, newDescription string, newDate uint32) (*types.Transaction, error) {
	return _Contract.contract.Transact(opts, "modifyTask", taskId, newDescription, newDate)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x62f2ff8a.
//
// Solidity: function modifyTask(uint256 taskId, string newDescription, uint32 newDate) returns()
func (_Contract *ContractSession) ModifyTask(taskId *big.Int, newDescription string, newDate uint32) (*types.Transaction, error) {
	return _Contract.Contract.ModifyTask(&_Contract.TransactOpts, taskId, newDescription, newDate)
}

// ModifyTask is a paid mutator transaction binding the contract method 0x62f2ff8a.
//
// Solidity: function modifyTask(uint256 taskId, string newDescription, uint32 newDate) returns()
func (_Contract *ContractTransactorSession) ModifyTask(taskId *big.Int, newDescription string, newDate uint32) (*types.Transaction, error) {
	return _Contract.Contract.ModifyTask(&_Contract.TransactOpts, taskId, newDescription, newDate)
}

// UpdateTaskStatus is a paid mutator transaction binding the contract method 0xab9b6811.
//
// Solidity: function updateTaskStatus(uint256 taskId, uint8 newStatus) returns()
func (_Contract *ContractTransactor) UpdateTaskStatus(opts *bind.TransactOpts, taskId *big.Int, newStatus uint8) (*types.Transaction, error) {
	return _Contract.contract.Transact(opts, "updateTaskStatus", taskId, newStatus)
}

// UpdateTaskStatus is a paid mutator transaction binding the contract method 0xab9b6811.
//
// Solidity: function updateTaskStatus(uint256 taskId, uint8 newStatus) returns()
func (_Contract *ContractSession) UpdateTaskStatus(taskId *big.Int, newStatus uint8) (*types.Transaction, error) {
	return _Contract.Contract.UpdateTaskStatus(&_Contract.TransactOpts, taskId, newStatus)
}

// UpdateTaskStatus is a paid mutator transaction binding the contract method 0xab9b6811.
//
// Solidity: function updateTaskStatus(uint256 taskId, uint8 newStatus) returns()
func (_Contract *ContractTransactorSession) UpdateTaskStatus(taskId *big.Int, newStatus uint8) (*types.Transaction, error) {
	return _Contract.Contract.UpdateTaskStatus(&_Contract.TransactOpts, taskId, newStatus)
}

// ContractTaskCreatedIterator is returned from FilterTaskCreated and is used to iterate over the raw logs and unpacked data for TaskCreated events raised by the Contract contract.
type ContractTaskCreatedIterator struct {
	Event *ContractTaskCreated // Event containing the contract specifics and raw log

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
func (it *ContractTaskCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ContractTaskCreated)
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
		it.Event = new(ContractTaskCreated)
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
func (it *ContractTaskCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractTaskCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ContractTaskCreated represents a TaskCreated event raised by the Contract contract.
type ContractTaskCreated struct {
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
func (_Contract *ContractFilterer) FilterTaskCreated(opts *bind.FilterOpts, taskId []*big.Int, creator []common.Address, assignedTo []common.Address) (*ContractTaskCreatedIterator, error) {

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

	logs, sub, err := _Contract.contract.FilterLogs(opts, "TaskCreated", taskIdRule, creatorRule, assignedToRule)
	if err != nil {
		return nil, err
	}
	return &ContractTaskCreatedIterator{contract: _Contract.contract, event: "TaskCreated", logs: logs, sub: sub}, nil
}

// WatchTaskCreated is a free log subscription operation binding the contract event 0xcaa531b147f5e32fae563951c9d50c9febedb2a677750e0f0314f94c2b50f5fa.
//
// Solidity: event TaskCreated(uint256 indexed taskId, address indexed creator, address indexed assignedTo, uint32 date, uint8 status, uint256 timestamp)
func (_Contract *ContractFilterer) WatchTaskCreated(opts *bind.WatchOpts, sink chan<- *ContractTaskCreated, taskId []*big.Int, creator []common.Address, assignedTo []common.Address) (event.Subscription, error) {

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

	logs, sub, err := _Contract.contract.WatchLogs(opts, "TaskCreated", taskIdRule, creatorRule, assignedToRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ContractTaskCreated)
				if err := _Contract.contract.UnpackLog(event, "TaskCreated", log); err != nil {
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
func (_Contract *ContractFilterer) ParseTaskCreated(log types.Log) (*ContractTaskCreated, error) {
	event := new(ContractTaskCreated)
	if err := _Contract.contract.UnpackLog(event, "TaskCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ContractTaskDeletedIterator is returned from FilterTaskDeleted and is used to iterate over the raw logs and unpacked data for TaskDeleted events raised by the Contract contract.
type ContractTaskDeletedIterator struct {
	Event *ContractTaskDeleted // Event containing the contract specifics and raw log

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
func (it *ContractTaskDeletedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ContractTaskDeleted)
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
		it.Event = new(ContractTaskDeleted)
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
func (it *ContractTaskDeletedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractTaskDeletedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ContractTaskDeleted represents a TaskDeleted event raised by the Contract contract.
type ContractTaskDeleted struct {
	TaskId    *big.Int
	DeletedBy common.Address
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTaskDeleted is a free log retrieval operation binding the contract event 0x0752dde00495a9fda916c836f0f9e13b19edac46a7eebef960aa0a5cdb7736ca.
//
// Solidity: event TaskDeleted(uint256 indexed taskId, address indexed deletedBy, uint256 timestamp)
func (_Contract *ContractFilterer) FilterTaskDeleted(opts *bind.FilterOpts, taskId []*big.Int, deletedBy []common.Address) (*ContractTaskDeletedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var deletedByRule []interface{}
	for _, deletedByItem := range deletedBy {
		deletedByRule = append(deletedByRule, deletedByItem)
	}

	logs, sub, err := _Contract.contract.FilterLogs(opts, "TaskDeleted", taskIdRule, deletedByRule)
	if err != nil {
		return nil, err
	}
	return &ContractTaskDeletedIterator{contract: _Contract.contract, event: "TaskDeleted", logs: logs, sub: sub}, nil
}

// WatchTaskDeleted is a free log subscription operation binding the contract event 0x0752dde00495a9fda916c836f0f9e13b19edac46a7eebef960aa0a5cdb7736ca.
//
// Solidity: event TaskDeleted(uint256 indexed taskId, address indexed deletedBy, uint256 timestamp)
func (_Contract *ContractFilterer) WatchTaskDeleted(opts *bind.WatchOpts, sink chan<- *ContractTaskDeleted, taskId []*big.Int, deletedBy []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var deletedByRule []interface{}
	for _, deletedByItem := range deletedBy {
		deletedByRule = append(deletedByRule, deletedByItem)
	}

	logs, sub, err := _Contract.contract.WatchLogs(opts, "TaskDeleted", taskIdRule, deletedByRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ContractTaskDeleted)
				if err := _Contract.contract.UnpackLog(event, "TaskDeleted", log); err != nil {
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
func (_Contract *ContractFilterer) ParseTaskDeleted(log types.Log) (*ContractTaskDeleted, error) {
	event := new(ContractTaskDeleted)
	if err := _Contract.contract.UnpackLog(event, "TaskDeleted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ContractTaskModifiedIterator is returned from FilterTaskModified and is used to iterate over the raw logs and unpacked data for TaskModified events raised by the Contract contract.
type ContractTaskModifiedIterator struct {
	Event *ContractTaskModified // Event containing the contract specifics and raw log

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
func (it *ContractTaskModifiedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ContractTaskModified)
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
		it.Event = new(ContractTaskModified)
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
func (it *ContractTaskModifiedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractTaskModifiedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ContractTaskModified represents a TaskModified event raised by the Contract contract.
type ContractTaskModified struct {
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
func (_Contract *ContractFilterer) FilterTaskModified(opts *bind.FilterOpts, taskId []*big.Int, modifiedBy []common.Address) (*ContractTaskModifiedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var modifiedByRule []interface{}
	for _, modifiedByItem := range modifiedBy {
		modifiedByRule = append(modifiedByRule, modifiedByItem)
	}

	logs, sub, err := _Contract.contract.FilterLogs(opts, "TaskModified", taskIdRule, modifiedByRule)
	if err != nil {
		return nil, err
	}
	return &ContractTaskModifiedIterator{contract: _Contract.contract, event: "TaskModified", logs: logs, sub: sub}, nil
}

// WatchTaskModified is a free log subscription operation binding the contract event 0xd6ec681ab576080c2d87a4b3d3e62b3d4e768efc8e17b814816a73b593d287cd.
//
// Solidity: event TaskModified(uint256 indexed taskId, address indexed modifiedBy, bytes32 oldDescriptionHash, bytes32 newDescriptionHash, uint32 oldDate, uint32 newDate, uint256 timestamp)
func (_Contract *ContractFilterer) WatchTaskModified(opts *bind.WatchOpts, sink chan<- *ContractTaskModified, taskId []*big.Int, modifiedBy []common.Address) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}
	var modifiedByRule []interface{}
	for _, modifiedByItem := range modifiedBy {
		modifiedByRule = append(modifiedByRule, modifiedByItem)
	}

	logs, sub, err := _Contract.contract.WatchLogs(opts, "TaskModified", taskIdRule, modifiedByRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ContractTaskModified)
				if err := _Contract.contract.UnpackLog(event, "TaskModified", log); err != nil {
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
func (_Contract *ContractFilterer) ParseTaskModified(log types.Log) (*ContractTaskModified, error) {
	event := new(ContractTaskModified)
	if err := _Contract.contract.UnpackLog(event, "TaskModified", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ContractTaskStatusUpdatedIterator is returned from FilterTaskStatusUpdated and is used to iterate over the raw logs and unpacked data for TaskStatusUpdated events raised by the Contract contract.
type ContractTaskStatusUpdatedIterator struct {
	Event *ContractTaskStatusUpdated // Event containing the contract specifics and raw log

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
func (it *ContractTaskStatusUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ContractTaskStatusUpdated)
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
		it.Event = new(ContractTaskStatusUpdated)
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
func (it *ContractTaskStatusUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractTaskStatusUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ContractTaskStatusUpdated represents a TaskStatusUpdated event raised by the Contract contract.
type ContractTaskStatusUpdated struct {
	TaskId    *big.Int
	UpdatedBy common.Address
	Status    uint8
	Timestamp *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterTaskStatusUpdated is a free log retrieval operation binding the contract event 0xc8aa340b5c35d853bf5df4f527973f3b7817dea792441f810a6a10fce64fc56d.
//
// Solidity: event TaskStatusUpdated(uint256 indexed taskId, address updatedBy, uint8 status, uint256 timestamp)
func (_Contract *ContractFilterer) FilterTaskStatusUpdated(opts *bind.FilterOpts, taskId []*big.Int) (*ContractTaskStatusUpdatedIterator, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Contract.contract.FilterLogs(opts, "TaskStatusUpdated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return &ContractTaskStatusUpdatedIterator{contract: _Contract.contract, event: "TaskStatusUpdated", logs: logs, sub: sub}, nil
}

// WatchTaskStatusUpdated is a free log subscription operation binding the contract event 0xc8aa340b5c35d853bf5df4f527973f3b7817dea792441f810a6a10fce64fc56d.
//
// Solidity: event TaskStatusUpdated(uint256 indexed taskId, address updatedBy, uint8 status, uint256 timestamp)
func (_Contract *ContractFilterer) WatchTaskStatusUpdated(opts *bind.WatchOpts, sink chan<- *ContractTaskStatusUpdated, taskId []*big.Int) (event.Subscription, error) {

	var taskIdRule []interface{}
	for _, taskIdItem := range taskId {
		taskIdRule = append(taskIdRule, taskIdItem)
	}

	logs, sub, err := _Contract.contract.WatchLogs(opts, "TaskStatusUpdated", taskIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ContractTaskStatusUpdated)
				if err := _Contract.contract.UnpackLog(event, "TaskStatusUpdated", log); err != nil {
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
func (_Contract *ContractFilterer) ParseTaskStatusUpdated(log types.Log) (*ContractTaskStatusUpdated, error) {
	event := new(ContractTaskStatusUpdated)
	if err := _Contract.contract.UnpackLog(event, "TaskStatusUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
