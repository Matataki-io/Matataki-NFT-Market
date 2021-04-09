import { getAddress } from '@ethersproject/address';
import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import {
  Ask,
  Bid,
  BidShares,
  DecimalValue,
  MediaData,
} from '../types/ContractTypes';
import { Decimal } from './Decimal';
import {
  BigNumber,
  BigNumberish,
  BytesLike,
  ContractTransaction,
  ethers,
  Wallet,
} from 'ethers';
import {
  arrayify,
  hexDataLength,
  hexlify,
  isHexString,
} from '@ethersproject/bytes';
import axios from 'axios';

/********************
 * Type Constructors
 ********************
 */

/**
 * Constructs a MediaData type.
 *
 * @param tokenURI
 * @param metadataURI
 * @param contentHash
 * @param metadataHash
 */
export function constructMediaData(
  tokenURI: string,
  metadataURI: string,
  contentHash: BytesLike,
  metadataHash: BytesLike
): MediaData {
  // validate the hash to ensure it fits in bytes32
  validateBytes32(contentHash);
  validateBytes32(metadataHash);
  validateURI(tokenURI);
  validateURI(metadataURI);

  return {
    tokenURI: tokenURI,
    metadataURI: metadataURI,
    contentHash: contentHash,
    metadataHash: metadataHash,
  };
}

/**
 * Constructs a BidShares type.
 * Throws an error if the BidShares do not sum to 100 with 18 trailing decimals.
 *
 * @param creator
 * @param owner
 * @param prevOwner
 */
export function constructBidShares(
  creator: number,
  owner: number,
  prevOwner: number
): BidShares {
  const decimalCreator = Decimal.new(parseFloat(creator.toFixed(4)));
  const decimalOwner = Decimal.new(parseFloat(owner.toFixed(4)));
  const decimalPrevOwner = Decimal.new(parseFloat(prevOwner.toFixed(4)));

  validateBidShares(decimalCreator, decimalOwner, decimalPrevOwner);

  return {
    creator: decimalCreator,
    owner: decimalOwner,
    prevOwner: decimalPrevOwner,
  };
}

/**
 * Validates that BidShares sum to 100
 *
 * @param creator
 * @param owner
 * @param prevOwner
 */
export function validateBidShares(
  creator: DecimalValue,
  owner: DecimalValue,
  prevOwner: DecimalValue
): void {
  const decimal100 = Decimal.new(100);

  const sum = creator.value.add(owner.value).add(prevOwner.value);

  if (sum.toString() != decimal100.value.toString()) {
    invariant(
      false,
      `The BidShares sum to ${sum.toString()}, but they must sum to ${decimal100.value.toString()}`
    );
  }
}

/**
 * Constructs an Ask.
 *
 * @param currency
 * @param amount
 */
export function constructAsk(currency: string, amount: BigNumberish): Ask {
  const parsedCurrency = validateAndParseAddress(currency);
  return {
    currency: parsedCurrency,
    amount: amount,
  };
}

/**
 * Constructs a Bid.
 *
 * @param currency
 * @param amount
 * @param bidder
 * @param recipient
 * @param sellOnShare
 */
export function constructBid(
  currency: string,
  amount: BigNumberish,
  bidder: string,
  recipient: string,
  sellOnShare: number
): Bid {
  let parsedCurrency: string;
  let parsedBidder: string;
  let parsedRecipient: string;

  try {
    parsedCurrency = validateAndParseAddress(currency);
  } catch (err) {
    throw new Error(`Currency address is invalid: ${err.message}`);
  }

  try {
    parsedBidder = validateAndParseAddress(bidder);
  } catch (err) {
    throw new Error(`Bidder address is invalid: ${err.message}`);
  }

  try {
    parsedRecipient = validateAndParseAddress(recipient);
  } catch (err) {
    throw new Error(`Recipient address is invalid: ${err.message}`);
  }

  const decimalSellOnShare = Decimal.new(parseFloat(sellOnShare.toFixed(4)));

  return {
    currency: parsedCurrency,
    amount: amount,
    bidder: parsedBidder,
    recipient: parsedRecipient,
    sellOnShare: decimalSellOnShare,
  };
}

/**
 * Validates if the input is exactly 32 bytes
 * Expects a hex string with a 0x prefix or a Bytes type
 *
 * @param value
 */
export function validateBytes32(value: BytesLike) {
  if (typeof value == 'string') {
    if (isHexString(value) && hexDataLength(value) == 32) {
      return;
    }

    invariant(false, `${value} is not a 0x prefixed 32 bytes hex string`);
  } else {
    if (hexDataLength(hexlify(value)) == 32) {
      return;
    }

    invariant(false, `value is not a length 32 byte array`);
  }
}

/**
 * Validates the URI is prefixed with `https://`
 *
 * @param uri
 */
export function validateURI(uri: string) {
  if (!uri.match(/^https:\/\/(.*)/)) {
    invariant(false, `${uri} must begin with \`https://\``);
  }
}

/**
 * Validates and returns the checksummed address
 *
 * @param address
 */
export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address);
    warning(address === checksummedAddress, `${address} is not checksummed.`);
    return checksummedAddress;
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}

/**
 * Returns the proper network name for the specified chainId
 *
 * @param chainId
 */
export function chainIdToNetworkName(chainId: number): string {
  switch (chainId) {
    case 4: {
      return 'rinkeby';
    }
    case 1: {
      return 'mainnet';
    }
  }

  invariant(
    false,
    `chainId ${chainId} not officially supported by the Zora Protocol`
  );
}

/********************
 * Hashing Utilities
 ********************
 */

/**
 * Removes the hex prefix of the passed string if it exists
 *
 * @param hex
 */
export function stripHexPrefix(hex: string) {
  return hex.slice(0, 2) == '0x' ? hex.slice(2) : hex;
}

/**
 * Deposits `amount` of ETH into WETH contract and receives `amount` in WETH
 * an ERC-20 representation of ETH
 * @param wallet
 * @param wethAddress
 * @param amount
 */
export async function wrapETH(
  wallet: Wallet,
  wethAddress: string,
  amount: BigNumber
): Promise<ContractTransaction> {
  const abi = ['function deposit() public payable'];
  const weth = new ethers.Contract(wethAddress, abi, wallet);
  return weth.deposit({ value: amount });
}

/**
 * Withdraws `amount` of ETH from WETH contract for the specified wallet
 * @param wallet
 * @param wethAddress
 * @param amount
 */
export async function unwrapWETH(
  wallet: Wallet,
  wethAddress: string,
  amount: BigNumber
): Promise<ContractTransaction> {
  const abi = ['function withdraw(uint256) public'];
  const weth = new ethers.Contract(wethAddress, abi, wallet);
  return weth.withdraw(amount);
}
