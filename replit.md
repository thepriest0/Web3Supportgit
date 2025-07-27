# AllDappNet - Decentralized Web3 Support Protocol

## Overview

AllDappNet is a decentralized Web3 support platform that helps users resolve blockchain-related issues through automated smart contract interactions. The application provides a comprehensive suite of support categories, from wallet validation to DeFi operations, all accessible through a modern React-based interface with integrated Web3 functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and bundling
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for production bundling

### Web3 Integration
- **Wallet Connection**: RainbowKit + Wagmi for wallet management
- **Blockchain Interaction**: Viem for low-level blockchain operations
- **Supported Networks**: Ethereum (mainnet/Sepolia), Polygon (mainnet/Mumbai), Base (mainnet/Goerli)
- **Provider**: Alchemy for RPC connections

## Key Components

### Frontend Components
1. **Navigation System**
   - Responsive navbar with wallet connection
   - Network status indicators
   - Mobile-optimized navigation

2. **Support Categories**
   - Grid-based category display
   - Real-time search and filtering
   - Tag-based organization
   - Individual issue resolution pages

3. **Web3 Integration**
   - Wallet connection management
   - Smart contract interaction interface
   - Transaction status tracking
   - Multi-network support

4. **UI Framework**
   - Complete shadcn/ui component suite
   - Toast notifications for user feedback
   - Responsive design patterns
   - Accessibility-compliant components

### Backend Structure
1. **Express Server**
   - RESTful API endpoints (prefixed with `/api`)
   - Request logging and error handling
   - Development and production configurations

2. **Storage Layer**
   - In-memory storage implementation
   - User management interface
   - Extensible CRUD operations

3. **Development Tools**
   - Vite integration for hot reloading
   - TypeScript compilation
   - Development middleware setup

## Data Flow

### User Journey
1. **Landing Page**: Users browse support categories with search/filter capabilities
2. **Category Selection**: Click-through to specific issue resolution pages
3. **Wallet Connection**: Connect Web3 wallet using RainbowKit
4. **Issue Resolution**: Execute smart contract functions or sign messages
5. **Transaction Tracking**: Real-time feedback on blockchain operations

### State Management
- **React Query**: Server state management and caching
- **Wagmi Hooks**: Web3 state management
- **React Context**: Web3 provider state
- **Local State**: Component-level state for UI interactions

## External Dependencies

### Web3 Infrastructure
- **Alchemy**: Primary RPC provider for all supported networks
- **WalletConnect**: Wallet connection protocol
- **RainbowKit**: Wallet UI components and connection management

### Database
- **Drizzle ORM**: Database abstraction layer
- **PostgreSQL**: Production database (Neon serverless)
- **Schema Management**: Type-safe database operations

### UI/UX
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Google Fonts**: Inter font family

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite bundles React app to `dist/public`
2. **Backend Build**: ESBuild bundles server to `dist/index.js`
3. **Database**: Drizzle migrations applied to PostgreSQL

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Express serves static files + API
- **Environment Variables**: Database URL, Alchemy API key, WalletConnect project ID

### Hosting Requirements
- **Node.js**: Runtime environment
- **PostgreSQL**: Database instance
- **Static Assets**: Served by Express in production
- **HTTPS**: Required for Web3 wallet connections

### Key Features Implementation
- **Multi-chain Support**: Configured for 6+ blockchain networks
- **Responsive Design**: Mobile-first approach with Tailwind
- **Smart Contract Integration**: Ready for deployment with mock contracts
- **Search & Filter**: Real-time category filtering
- **Wallet Integration**: Production-ready Web3 connectivity
- **Type Safety**: Full TypeScript coverage
- **Component Library**: Complete UI system with shadcn/ui

The architecture supports the core vision of a decentralized Web3 support protocol with extensible smart contract integrations, modern UI/UX, and production-ready infrastructure.