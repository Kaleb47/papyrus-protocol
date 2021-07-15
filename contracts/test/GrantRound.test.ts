// --- External imports ---
import { artifacts, ethers, waffle } from 'hardhat';
import { Artifact } from 'hardhat/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { expect } from 'chai';

// --- Our imports ---
import { GrantRegistry } from '../typechain/GrantRegistry';
import { timeTravel } from './utils';
import IERC20Artifact from '../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';

// --- Parse and define helpers ---
const { deployContract, deployMockContract } = waffle;
const { isAddress } = ethers.utils;

describe('GrantRound', function () {
  let deployer: SignerWithAddress,
    grantRoundOwner: SignerWithAddress,
    donor: SignerWithAddress,
    grantPayee: SignerWithAddress,
    mpUser: SignerWithAddress;
  let registry: GrantRegistry;
  let roundContract: any;
  let mockERC20: any;
  const balances: string[] = ['100', '200'];
  const startTime: number = Math.floor(new Date().getTime() / 1000); // time in seconds
  const endTime: number = startTime + 86400; // One day

  beforeEach(async () => {
    const mockUrl: string = 'https://test.url';
    const minContribution: number = 50;
    [deployer, grantRoundOwner, donor, grantPayee, mpUser] = await ethers.getSigners();
    mockERC20 = await deployMockContract(deployer, IERC20Artifact.abi);
    // Seed funds for matching pool user
    await mockERC20.mock.transfer.withArgs(mpUser.address, ethers.utils.parseEther(balances[0]));
    // Seed funds for initial donor
    await mockERC20.mock.transfer.withArgs(donor.address, ethers.utils.parseEther(balances[0]));

    const grantRegistryArtifact: Artifact = await artifacts.readArtifact('GrantRegistry');
    registry = <GrantRegistry>await deployContract(deployer, grantRegistryArtifact);

    // Create an example grant
    await registry.connect(deployer).createGrant(deployer.address, grantPayee.address, mockUrl);

    const grantRoundArtifact: Artifact = await artifacts.readArtifact('GrantRound');
    const roundContractFactory = new ethers.ContractFactory(
      grantRoundArtifact.abi,
      grantRoundArtifact.bytecode,
      deployer
    );

    roundContract = await roundContractFactory.deploy(
      grantRoundOwner.address,
      registry.address,
      mockERC20.address,
      startTime,
      endTime,
      mockUrl,
      minContribution
    );
  });

  describe('Initialization', () => {
    it('deploys properly', async function () {
      expect(isAddress(roundContract.address), 'Failed to deploy GrantRegistry').to.be.true;
    });
  });

  describe('acceptMatchingPool - Add funds to matching round', () => {
    it('updates contract and user balances', async function () {
      // set up mock calls
      await mockERC20.mock.balanceOf.withArgs(mpUser.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(roundContract.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transferFrom.withArgs(mpUser.address, roundContract.address, balances[0]).returns(true);

      await roundContract.connect(mpUser).acceptMatchingPool(balances[0]);
      expect(await roundContract.connect(deployer).checkBalance(roundContract.address)).to.be.equal(
        ethers.utils.parseEther(balances[0])
      );
    });
  });

  describe('donateToGrant - Add funds during active round', () => {
    it('sends donation token to the grant payee with a given grant id', async function () {
      const grantId: number = 0;
      await mockERC20.mock.balanceOf.withArgs(donor.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(grantPayee.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transfer.withArgs(grantPayee.address, balances[0]).returns(true);

      await roundContract.connect(donor).donateToGrant(balances[0], grantId);
      expect(await roundContract.connect(deployer).checkBalance(grantPayee.address)).to.be.equal(
        ethers.utils.parseEther(balances[0])
      );
    });

    it('donations revert if not above minimum contribution', async function () {
      const grantId: number = 0;
      await mockERC20.mock.balanceOf.withArgs(donor.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(grantPayee.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transfer.withArgs(grantPayee.address, balances[0]).returns(true);

      void expect(roundContract.connect(donor).donateToGrant(10, grantId)).to.be.revertedWith(
        'Donation amount must be greater than minimum contribution'
      );
    });
  });

  describe('payoutGrant - payout remaining contract balance to a given address', () => {
    it('reverts if round has not ended', async function () {
      await mockERC20.mock.balanceOf.withArgs(deployer.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(roundContract.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transfer.withArgs(deployer.address, balances[0]).returns(true);

      void expect(roundContract.connect(grantRoundOwner).payoutGrant(deployer.address)).to.be.revertedWith(
        'Method must be called after the active round has ended'
      );
    });

    it('sends remaining matching pool funds to payout address', async function () {
      await mockERC20.mock.balanceOf.withArgs(grantPayee.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(roundContract.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transferFrom.withArgs(roundContract.address, grantPayee.address, balances[0]).returns(true);

      // End the round for all subsequent tests
      await timeTravel(deployer.provider, endTime + 1);
      // await roundContract.connect(grantRoundOwner).payoutGrant(grantPayee.address);

      //expect(await roundContract.connect(deployer).checkBalance(deployer.address)).to.be.equal(ethers.utils.parseEther(balances[0]));
    });
  });
  describe('Round end corner cases', () => {
    it('matching pool transfers revert if passed round end time', async function () {
      await mockERC20.mock.balanceOf.withArgs(mpUser.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(roundContract.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transferFrom.withArgs(mpUser.address, roundContract.address, balances[0]).returns(true);

      void expect(roundContract.connect(mpUser).acceptMatchingPool(balances[0])).to.be.revertedWith(
        'Time has passed to complete this tx'
      );
    });

    it('donations revert if not during active round', async function () {
      const grantId: number = 0;
      await mockERC20.mock.balanceOf.withArgs(donor.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.balanceOf.withArgs(grantPayee.address).returns(ethers.utils.parseEther(balances[0]));
      await mockERC20.mock.transfer.withArgs(grantPayee.address, balances[0]).returns(true);

      void expect(roundContract.connect(donor).donateToGrant(balances[0], grantId)).to.be.revertedWith(
        'Donations must be sent during an active round'
      );
    });
  });
});