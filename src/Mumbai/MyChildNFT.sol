// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import { ContextMixin } from "../utils/ContextMixin.sol";
import { IChildToken } from "./interface/IChildToken.sol";
import { AccessControlMixin } from "../utils/AccessControlMixin.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { NativeMetaTransaction } from "../utils/NativeMetaTransaction.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyChildNFT is ERC721, ERC721URIStorage, Ownable {
    address deployer;
    address childChainManagerProxy;

    constructor(address _childChainManagerProxy) ERC721("MyChildNFT", "McN") {
        childChainManagerProxy = _childChainManagerProxy;
        deployer = msg.sender;

        // Can't mint here, because minting in child chain smart contract's constructor not allowed
        //
        // In case of mintable tokens it can be done, there can be external mintable function too
        // which can be called by some trusted parties
        // _mint(msg.sender, 10 ** 27);
    }

    function safeMint(address to, uint256 tokenId, string memory uri) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function deposit(address user, bytes calldata depositData) external {
        require(msg.sender == childChainManagerProxy, "You're not allowed to deposit");
        uint256 tokenId;
        address user_address;
        string memory uri;
        (tokenId, user_address, uri) = abi.decode(depositData, (uint256, address, string));
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function withdraw(uint256 tokenId) external {
        require(_msgSender() == ownerOf(tokenId), "ChildERC721: INVALID_TOKEN_OWNER");
        _burn(tokenId);
    }
}
