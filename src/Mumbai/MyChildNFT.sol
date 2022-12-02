// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import { ContextMixin } from "../utils/ContextMixin.sol";
import { IChildToken } from "./interface/IChildToken.sol";
import { AccessControlMixin } from "../utils/AccessControlMixin.sol";
import { NativeMetaTransaction } from "../utils/NativeMetaTransaction.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract MyChildNFT is IChildToken, AccessControlMixin, NativeMetaTransaction, ContextMixin, ERC721URIStorage, Ownable {
    bytes32 public constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");

    // limit batching of tokens due to gas limit restrictions
    uint256 public constant BATCH_LIMIT = 20;
    event WithdrawnBatch(address indexed user, uint256[] tokenIds);

    constructor(string memory _name, string memory _symbol, address _childChainManager) ERC721(_name, _symbol) {
        _setupContractId("MyChildNFT");
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(DEPOSITOR_ROLE, _childChainManager);
        _initializeEIP712(_name);

        // Can't mint here, because minting in child chain smart contract's constructor not allowed
        //
        // In case of mintable tokens it can be done, there can be external mintable function too
        // which can be called by some trusted parties
        // _mint(msg.sender, 10 ** 27);
    }

    /**
     * returns the message sender
     */

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // This is to support Native meta transactions
    // never use msg.sender directly, use _msgSender() instead
    function _msgSender() internal view override returns (address sender) {
        return ContextMixin.msgSender();
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @notice called when token is deposited on root chain
     * @dev Should be callable only by ChildChainManager
     * Should handle deposit by minting the required tokenId for user
     * Make sure minting is done only by this function
     * @param user user address for whom deposit is being done
     * @param depositData abi encoded tokenId
     */
    function deposit(address user, bytes calldata depositData) external override only(DEPOSITOR_ROLE) {
        // deposit single
        if (depositData.length == 32) {
            uint256 tokenId;
            string memory uri;
            address user_address;
            (tokenId, user_address, uri) = abi.decode(depositData, (uint256, address, string));
            _mint(user, tokenId);
            _setTokenURI(tokenId, uri);
        }
        // deposit batch
        else {
            uint256[] memory tokenIds;
            string[] memory uris;
            address[] memory user_addresses;
            (tokenIds, user_addresses, uris) = abi.decode(depositData, (uint256[], address[], string[]));
            uint256 length = tokenIds.length;
            for (uint256 i; i < length; i++) {
                _mint(user_addresses[i], tokenIds[i]);
                _setTokenURI(tokenIds[i], uris[i]);
            }
        }
    }

    /**
     * @notice called when user wants to withdraw token back to root chain
     * @dev Should burn user's token. This transaction will be verified when exiting on root chain
     * @param tokenId tokenId to withdraw
     */
    function withdraw(uint256 tokenId) external {
        require(_msgSender() == ownerOf(tokenId), "ChildERC721: INVALID_TOKEN_OWNER");
        _burn(tokenId);
    }

    /**
     * @notice called when user wants to withdraw multiple tokens back to root chain
     * @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
     * @param tokenIds tokenId list to withdraw
     */
    function withdrawBatch(uint256[] calldata tokenIds) external {
        uint256 length = tokenIds.length;
        require(length <= BATCH_LIMIT, "ChildERC721: EXCEEDS_BATCH_LIMIT");
        for (uint256 i; i < length; i++) {
            uint256 tokenId = tokenIds[i];
            require(
                _msgSender() == ownerOf(tokenId),
                string(abi.encodePacked("ChildERC721: INVALID_TOKEN_OWNER ", tokenId))
            );
            _burn(tokenId);
        }
        emit WithdrawnBatch(_msgSender(), tokenIds);
    }
}
