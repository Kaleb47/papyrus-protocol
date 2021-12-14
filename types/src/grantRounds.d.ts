import { BigNumberish } from 'ethers';
import { TokenInfo } from '@uniswap/token-lists';
import { Contribution, GrantPrediction, MetaPtr } from './grants';

/**
 * Data types for GrantRound entity being pulled from the subgraph
 *
 * @type GrantRoundSubgraph
 * @field {address} grant round address
 * @field {lastUpdatedBlockNumber} the blockNumber on which this entity was lastUpdated
 */
export type GrantRoundSubgraph = {
  id: string;
  address: string;
  lastUpdatedBlockNumber: number;
};

/**
 * Data types for GrantRoundDonations entity being pulled from the subgraph
 *
 * @type GrantRoundDonationSubgraph
 * @field {contributor} the contributors address
 * @field {amount} the amount being contributed
 * @field {hash} the txHash associated with the transaction
 * @field {createdAtTimestamp} the ts related to this contribution
 * @field {lastUpdatedBlockNumber} the blockNumber on which this entity was created
 */
export type GrantRoundDonationSubgraph = {
  id: string;
  contributor: string;
  amount: BigNumberish;
  hash: string;
  createdAtTimestamp: BigNumberish;
  lastUpdatedBlockNumber: number;
};

/**
 * Data types for GrantRoundDonations entity being pulled from storage
 *
 * @type GrantRoundDonations
 * @field {contributor} the contributors address
 * @field {amount} the amount being contributed
 * @field {txHash} the txHash associated with the transaction
 * @field {createdAt} the ts related to this contribution
 * @field {blockNumber} the blockNumber on which this entity was created
 */
export type GrantRoundDonation = {
  contributor: string;
  amount: BigNumberish;
  txHash: string;
  createdAt: BigNumberish;
  blockNumber: number;
};

/**
 * GrantRound object from GrantRoundManager
 *
 * @type GrantRound
 * @field {address} grant rounds address
 * @field {metadataAdmin} Address which can control the metadata
 * @field {payoutAdmin} Address which will make the payout
 * @field {registry} Associated grantRegistry address
 * @field {donationToken} The donation token (contributions will swapped into this currency) as a TokenInfo instance
 * @field {matchingToken} The matching token (matching payouts will be made in this currency) as a TokenInfo instance
 * @field {funds} The total funds available in the matching pool (human readable number)
 * @field {status} The current status of the round (Active|Upcoming|Complete)
 * @field {startTime} The start time of the round (unix)
 * @field {endTime} The end time of the round (unix)
 * @field {metaPtr} The metaPtr associated with the round
 * @field {hasPaidOut} Marked when the round matching has been paid out
 * @field {error} Optional error string
 */
export type GrantRound = {
  address: string;
  metadataAdmin: string;
  payoutAdmin: string;
  registry: string;
  donationToken: TokenInfo;
  matchingToken: TokenInfo;
  funds: number;
  status: string;
  startTime: BigNumberish;
  endTime: BigNumberish;
  metaPtr: MetaPtr;
  hasPaidOut: boolean;
  error: string | undefined;
};
export type GrantRounds = Array<GrantRound>;

/**
 * Metadata resolve from a grant round's metadata pointer URL
 *
 * @type GrantRoundMetadata
 * @field {name} The grantRounds name
 * @field {description} The grantRounds description
 * @field {grants} An array of grants in this grantRound
 * @field {matchingAlgorithm} The matching algo to use for calculations (linear)
 * @field {logoPtr} Pointer to the grant round's image
 * --- optional ---
 * @field {properties.websiteURI} The grantRounds website
 * @field {properties.governanceURI} The grantRounds governanceURI
 * @field {properties.twitterURI} The grantRounds twitterURI
 * @field {properties.sponsorsURI} The grantRounds sponsorsURI
 */

export type GrantRoundMetadata = {
  name: string;
  description: string;
  grants: BigNumberish[];
  matchingAlgorithm: string;
  logoPtr: MetaPtr;
  properties?: {
    websiteURI?: string;
    governanceURI?: string;
    twitterURI?: string;
    sponsorsURI?: string[];
  };
};
export type GrantRoundMetadataStatus = 'resolved' | 'pending' | 'error';
export type GrantRoundMetadataResolution = Partial<GrantRoundMetadata> & { status: GrantRoundMetadataStatus };

/**
 * Grant rounds contributions and pot details
 *
 * @type GrantRoundContributions
 * @field {grantRound} grant round address
 * @field {totalPot} total pot amount in the round
 * @field {matchingTokenDecimals} the number of decimals used by the rounds matching currency
 * @field {[contributions]} contributions in that round
 */
export type GrantRoundContributions = {
  grantRound: string;
  totalPot: number;
  matchingTokenDecimals: number;
  contributions: Contribution[];
};

/**
 * All CLR results/data for a given GrantRound
 *
 * @type GrantRoundContributions
 * @field {grantRound} grant round address
 * @field {totalPot} total pot amount in the round
 * @field {matchingTokenDecimals} the number of decimals used by the rounds matching currency
 * @field {[contributions]} contributions in that round
 * @field {[predictions]} predictions for the round
 */
export type GrantRoundCLR = GrantRoundContributions & {
  predictions: GrantPrediction[];
};
