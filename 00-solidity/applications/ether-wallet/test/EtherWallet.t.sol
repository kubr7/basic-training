// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/EtherWallet.sol";

contract EtherWalletTest is Test {
    EtherWallet wallet;
    address owner;
    address user1;

    function setUp() public {
        owner = address(0xABCD);
        user1 = address(0x1234);
        vm.prank(owner); // make `msg.sender = owner` for constructor
        wallet = new EtherWallet();
    }

    function testOwnerIsSet() public {
        assertEq(wallet.owner(), owner);
    }

    function testDeposit() public {
        vm.deal(user1, 10 ether); // give user1 10 ETH
        vm.prank(user1);
        (bool sent, ) = address(wallet).call{value: 5 ether}("");
        assertTrue(sent);
        assertEq(wallet.getBalance(), 5 ether);
    }

    function testWithdrawAsOwner() public {
        // Fund wallet
        vm.deal(owner, 10 ether);
        vm.prank(owner);
        (bool sent, ) = address(wallet).call{value: 5 ether}("");
        assertTrue(sent);

        // Withdraw
        vm.prank(owner);
        wallet.withdraw(3 ether);
        assertEq(wallet.getBalance(), 2 ether);
    }

    function test_RevertWhen_WithdrawAsNonOwner() public {
        vm.deal(user1, 5 ether);
        vm.prank(user1);
        (bool sent, ) = address(wallet).call{value: 5 ether}("");
        assertTrue(sent);

        // Try withdrawing as non-owner (should fail)
        vm.prank(user1);
        vm.expectRevert("Caller is not owner");
        wallet.withdraw(1 ether);
    }
}
