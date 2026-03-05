import LiquidBridgePoolABI from "../abis/LiquidBridgePool.json";
import MockUSDCABI from "../abis/MockUSDC.json";
import MockRWATokenABI from "../abis/MockRWAToken.json";
import NAVOracleABI from "../abis/NAVOracle.json";
import ComplianceVerifierABI from "../abis/ComplianceVerifier.json";
import LiquidBridgeRouterABI from "../abis/LiquidBridgeRouter.json";
import LiquidBridgeFactoryABI from "../abis/LiquidBridgeFactory.json";

// Base Sepolia deployed addresses
export const CONTRACTS = {
  mockUSDC: "0x8e86caEC04AEa9bf0CE3fB9C04F1cae7720619E1" as `0x${string}`,
  mockRWAToken: "0x7034a77b38731B9A86a7107572e2a6362ee3b85f" as `0x${string}`,
  complianceVerifier: "0x21FcdFb3dB6f2Dd97B7bAcB68A355ce3288BD095" as `0x${string}`,
  navOracle: "0xA3A7Fe2eeA6EAa448a7445864f644912A3179a46" as `0x${string}`,
  factory: "0x18b70a873cA71682122c6CC58BC401185fefE47f" as `0x${string}`,
  pool: "0xa3Bb7547b13A3712fDB35A8cFFe283Db4526ef7C" as `0x${string}`,
  router: "0xe6e1F74442c14305E54f503EaFBbA5eB4c92F84A" as `0x${string}`,
  creReceiver: "0x5a618f0317d4c5514af7775e17795Abd7525F7C7" as `0x${string}`,
} as const;

export const ABIS = {
  pool: LiquidBridgePoolABI,
  usdc: MockUSDCABI,
  rwaToken: MockRWATokenABI,
  navOracle: NAVOracleABI,
  compliance: ComplianceVerifierABI,
  router: LiquidBridgeRouterABI,
  factory: LiquidBridgeFactoryABI,
} as const;

export const TOKENS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: CONTRACTS.mockUSDC,
  },
  mBUILD: {
    symbol: "mBUILD",
    name: "Mock BUIDL Token",
    decimals: 18,
    address: CONTRACTS.mockRWAToken,
  },
} as const;
