// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CrowdfundingContract
 * @dev A contract for creating funding pools and proposals on World Chain.
 * Allows users to deposit funds into pools, create proposals linked to pools,
 * vote on proposals, and release pool funds to successful proposal creators.
 */
contract CrowdfundingContract {
    // --- Structs ---

    struct Pool {
        uint256 id; // Unique identifier for the pool
        address creator; // Address that created the pool
        uint256 balance; // Current ETH balance of the pool
        bool exists; // Flag to check if pool ID is valid
    }

    struct Proposal {
        uint256 id; // Unique identifier for the proposal
        uint256 poolId; // ID of the pool this proposal targets
        address payable proposer; // Address that created the proposal (receives funds if passed)
        string title; // Title of the proposal
        string description; // Detailed description
        string imageLink; // Link to an image (stored off-chain)
        uint256 fundingGoal; // The stated funding goal (informational)
        uint256 votesFor; // Count of 'For' votes
        uint256 votesAgainst; // Count of 'Against' votes
        uint256 deadline; // Unix timestamp when voting ends
        bool executed; // Flag indicating if the proposal outcome has been processed
        bool passed; // Flag indicating if the proposal successfully passed the vote
        bool exists; // Flag to check if proposal ID is valid
    }

    // --- State Variables ---

    uint256 private poolCounter; // Counter to generate unique Pool IDs
    uint256 private proposalCounter; // Counter to generate unique Proposal IDs

    mapping(uint256 => Pool) public pools; // Mapping from pool ID to Pool struct
    mapping(uint256 => Proposal) public proposals; // Mapping from proposal ID to Proposal struct

    // Tracks if an address has voted on a specific proposal
    // proposalId => voterAddress => hasVoted (true/false)
    mapping(uint256 => mapping(address => bool)) private hasVoted;

    // --- Events ---

    event PoolCreated(uint256 indexed poolId, address indexed creator);
    event FundsDeposited(
        uint256 indexed poolId,
        address indexed depositor,
        uint256 amount
    );
    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed poolId,
        address indexed proposer,
        string title,
        uint256 fundingGoal,
        uint256 deadline
    );
    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool voteType
    ); // true = For, false = Against
    event ProposalExecuted(
        uint256 indexed proposalId,
        bool passed,
        bool fundsReleased
    );

    // --- Errors ---
    // Custom errors save gas compared to require strings
    error PoolNotFound(uint256 poolId);
    error ProposalNotFound(uint256 proposalId);
    error DeadlineNotPassed(uint256 proposalId, uint256 deadline);
    error DeadlinePassed(uint256 proposalId);
    error AlreadyVoted(uint256 proposalId, address voter);
    error ProposalAlreadyExecuted(uint256 proposalId);
    error TransferFailed(address recipient, uint256 amount);
    error InvalidDuration();
    error ZeroAddress();

    // --- Functions ---

    /**
     * @notice Creates a new funding pool.
     * @dev Assigns a unique ID and sets the creator.
     */
    function createPool() external {
        poolCounter++;
        uint256 newPoolId = poolCounter;
        pools[newPoolId] = Pool({
            id: newPoolId,
            creator: msg.sender,
            balance: 0,
            exists: true
        });
        emit PoolCreated(newPoolId, msg.sender);
    }

    /**
     * @notice Deposits ETH into a specific pool.
     * @dev Requires the pool to exist. Increases the pool's balance.
     * @param _poolId The ID of the pool to deposit into.
     */
    function deposit(uint256 _poolId) external payable {
        Pool storage pool = pools[_poolId];
        if (!pool.exists) revert PoolNotFound(_poolId);

        // Increase balance - safe math due to Solidity >=0.8.0
        pool.balance += msg.value;

        emit FundsDeposited(_poolId, msg.sender, msg.value);
    }

    /**
     * @notice Creates a new proposal associated with an existing pool.
     * @param _poolId The ID of the pool this proposal is linked to.
     * @param _title The title of the proposal.
     * @param _description A description of the proposal.
     * @param _imageLink A URL link to an image for the proposal.
     * @param _fundingGoal The amount of funding requested (informational).
     * @param _durationSeconds The duration of the voting period in seconds from now.
     */
    function createProposal(
        uint256 _poolId,
        string calldata _title,
        string calldata _description,
        string calldata _imageLink,
        uint256 _fundingGoal,
        uint256 _durationSeconds
    ) external {
        // Check if pool exists
        if (!pools[_poolId].exists) revert PoolNotFound(_poolId);
        // Ensure duration is positive
        if (_durationSeconds == 0) revert InvalidDuration();
        // Ensure proposer is not zero address (though msg.sender can't be zero)
        if (msg.sender == address(0)) revert ZeroAddress();

        proposalCounter++;
        uint256 newProposalId = proposalCounter;
        uint256 deadline = block.timestamp + _durationSeconds;

        proposals[newProposalId] = Proposal({
            id: newProposalId,
            poolId: _poolId,
            proposer: payable(msg.sender), // Store creator as payable
            title: _title,
            description: _description,
            imageLink: _imageLink,
            fundingGoal: _fundingGoal,
            votesFor: 0,
            votesAgainst: 0,
            deadline: deadline,
            executed: false,
            passed: false,
            exists: true
        });

        emit ProposalCreated(
            newProposalId,
            _poolId,
            msg.sender,
            _title,
            _fundingGoal,
            deadline
        );
    }

    /**
     * @notice Cast a vote on a specific proposal.
     * @dev Checks for proposal existence, deadline, and prevents double voting.
     * @param _proposalId The ID of the proposal to vote on.
     * @param _voteType True for 'For', False for 'Against'.
     */
    function vote(uint256 _proposalId, bool _voteType) external {
        Proposal storage proposal = proposals[_proposalId];

        // Check if proposal exists
        if (!proposal.exists) revert ProposalNotFound(_proposalId);
        // Check if voting period is active
        if (block.timestamp >= proposal.deadline)
            revert DeadlinePassed(_proposalId);
        // Check if sender has already voted
        if (hasVoted[_proposalId][msg.sender])
            revert AlreadyVoted(_proposalId, msg.sender);

        // Record the vote
        if (_voteType) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        // Mark sender as having voted
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender, _voteType);
    }

    /**
     * @notice Executes a proposal after its deadline has passed.
     * @dev Checks results, marks as executed, and transfers pool funds if passed.
     * Can be called by anyone after the deadline.
     * @param _proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        Pool storage pool = pools[proposal.poolId]; // Get associated pool

        // --- Checks ---
        // Check if proposal exists
        if (!proposal.exists) revert ProposalNotFound(_proposalId);
        // Check if associated pool exists (should always be true if proposal exists, but good practice)
        if (!pool.exists) revert PoolNotFound(proposal.poolId);
        // Check if the deadline has passed
        if (block.timestamp < proposal.deadline)
            revert DeadlineNotPassed(_proposalId, proposal.deadline);
        // Check if the proposal has already been executed
        if (proposal.executed) revert ProposalAlreadyExecuted(_proposalId);

        // --- Effects ---
        bool proposalPassed = proposal.votesFor > proposal.votesAgainst;
        proposal.passed = proposalPassed;
        proposal.executed = true; // Mark as executed regardless of outcome

        uint256 amountToTransfer = 0;
        bool fundsReleased = false;

        if (proposalPassed) {
            amountToTransfer = proposal.fundingGoal; // Transfer the *entire* pool balance
            if (amountToTransfer > 0) {
                // Reset pool balance BEFORE transfer (part of Checks-Effects-Interactions)
                pool.balance = pool.balance - amountToTransfer;
                fundsReleased = true;
            }
        }

        // --- Interaction ---
        if (fundsReleased) {
            // Use .call{value: ...}("") for safer transfers
            (bool success, ) = proposal.proposer.call{value: amountToTransfer}(
                ""
            );
            // If transfer fails, revert the entire transaction (including state changes like pool.balance = 0)
            // This ensures funds aren't lost in the contract if the recipient can't receive them.
            if (!success)
                revert TransferFailed(proposal.proposer, amountToTransfer);
            // NOTE: If the transfer fails, the pool balance remains 0, and the proposal is marked executed.
            // This prevents retrying the execution and potentially double-spending if the pool somehow got funds again.
            // The funds intended for transfer effectively get stuck if the proposer cannot receive them.
        }

        emit ProposalExecuted(_proposalId, proposalPassed, fundsReleased);
    }

    // --- View Functions ---

    /**
     * @notice Gets the details of a specific pool.
     * @param _poolId The ID of the pool.
     * @return Pool struct data.
     */
    function getPool(uint256 _poolId) external view returns (Pool memory) {
        if (!pools[_poolId].exists) revert PoolNotFound(_poolId);
        return pools[_poolId];
    }

    /**
     * @notice Gets the details of a specific proposal.
     * @param _proposalId The ID of the proposal.
     * @return Proposal struct data.
     */
    function getProposal(
        uint256 _proposalId
    ) external view returns (Proposal memory) {
        if (!proposals[_proposalId].exists)
            revert ProposalNotFound(_proposalId);
        return proposals[_proposalId];
    }

    /**
     * @notice Checks if a specific address has voted on a specific proposal.
     * @param _proposalId The ID of the proposal.
     * @param _voter The address of the voter.
     * @return bool True if the address has voted, false otherwise.
     */
    function getHasVoted(
        uint256 _proposalId,
        address _voter
    ) external view returns (bool) {
        // No need to check proposal existence here, will just return false if proposalId is invalid
        return hasVoted[_proposalId][_voter];
    }

    // Allow contract to receive ETH directly (e.g., if someone sends without calling deposit)
    // But this doesn't assign it to a pool. Use deposit() for tracked funding.
    // Could be removed if direct sends are unwanted.
    receive() external payable {}
    fallback() external payable {}
}
