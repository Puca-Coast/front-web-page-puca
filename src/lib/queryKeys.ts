/**
 * Centralized Query Keys Factory
 * 
 * This module provides a systematic way to generate and manage React Query keys
 * across the entire application, ensuring consistency and preventing cache conflicts.
 */

// Base query key types for type safety
type QueryKeyBase = readonly unknown[];

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface FilterParams {
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProductFilters extends FilterParams, PaginationParams {
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface LookbookFilters extends PaginationParams {
  season?: string;
  collection?: string;
  all?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

/**
 * Query Keys Factory
 * Provides a centralized way to generate consistent query keys
 */
export const queryKeys = {
  // Auth related queries
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Product related queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (term: string) => [...queryKeys.products.all, 'search', term] as const,
    related: (id: string) => [...queryKeys.products.all, 'related', id] as const,
    trending: () => [...queryKeys.products.all, 'trending'] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
  },

  // Lookbook related queries
  lookbook: {
    all: ['lookbook'] as const,
    photos: (filters: LookbookFilters) => [...queryKeys.lookbook.all, 'photos', filters] as const,
    collections: () => [...queryKeys.lookbook.all, 'collections'] as const,
    seasons: () => [...queryKeys.lookbook.all, 'seasons'] as const,
  },

  // Order related queries
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    userOrders: (userId: string) => [...queryKeys.orders.lists(), 'user', userId] as const,
    adminOrders: (filters: PaginationParams) => [...queryKeys.orders.lists(), 'admin', filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
    tracking: (id: string) => [...queryKeys.orders.all, 'tracking', id] as const,
  },

  // Cart related queries (if you want to cache cart state)
  cart: {
    all: ['cart'] as const,
    items: () => [...queryKeys.cart.all, 'items'] as const,
    shipping: (items: CartItem[], zipCode: string) => [...queryKeys.cart.all, 'shipping', items.length, zipCode] as const,
  },

  // Admin related queries
  admin: {
    all: ['admin'] as const,
    dashboard: () => [...queryKeys.admin.all, 'dashboard'] as const,
    analytics: (dateRange: { from: string; to: string }) => [...queryKeys.admin.all, 'analytics', dateRange] as const,
    users: (filters: PaginationParams) => [...queryKeys.admin.all, 'users', filters] as const,
  },

  // App data (for prefetching)
  app: {
    all: ['app'] as const,
    config: () => [...queryKeys.app.all, 'config'] as const,
    navigation: () => [...queryKeys.app.all, 'navigation'] as const,
    footer: () => [...queryKeys.app.all, 'footer'] as const,
  },
} as const;

/**
 * Cache Invalidation Helpers
 * Provides semantic methods to invalidate related caches
 */
export const cacheInvalidation = {
  // When a product is updated, invalidate related caches
  onProductUpdate: (productId: string) => [
    queryKeys.products.detail(productId),
    queryKeys.products.lists(),
    queryKeys.products.trending(),
    queryKeys.products.featured(),
  ],

  // When an order is created/updated, invalidate related caches
  onOrderUpdate: (orderId: string, userId?: string) => [
    queryKeys.orders.detail(orderId),
    queryKeys.orders.lists(),
    ...(userId ? [queryKeys.orders.userOrders(userId)] : []),
    queryKeys.admin.dashboard(),
  ],

  // When user profile is updated
  onProfileUpdate: () => [
    queryKeys.auth.profile(),
    queryKeys.auth.session(),
  ],

  // When lookbook is updated
  onLookbookUpdate: () => [
    queryKeys.lookbook.all,
  ],

  // Complete cache clear (for logout)
  onLogout: () => [
    queryKeys.auth.all,
    queryKeys.orders.all,
    queryKeys.cart.all,
    queryKeys.admin.all,
  ],
} as const;

/**
 * Cache Time Constants
 * Standardized cache durations for different types of data
 */
export const cacheTime = {
  // Static/rarely changing data
  LONG: 60 * 60 * 1000, // 1 hour
  
  // Semi-dynamic data  
  MEDIUM: 10 * 60 * 1000, // 10 minutes
  
  // Dynamic data
  SHORT: 2 * 60 * 1000, // 2 minutes
  
  // Real-time data
  REALTIME: 30 * 1000, // 30 seconds
  
  // Garbage collection time (how long to keep unused data)
  GC_TIME: 2 * 60 * 60 * 1000, // 2 hours
} as const;

/**
 * Stale Time Constants
 * How long data is considered fresh
 */
export const staleTime = {
  // Product catalog (changes infrequently)
  PRODUCTS: cacheTime.MEDIUM,
  
  // User profile (changes rarely)
  PROFILE: cacheTime.LONG,
  
  // Orders (static once created)
  ORDERS: cacheTime.LONG,
  
  // Lookbook (changes rarely)
  LOOKBOOK: cacheTime.LONG,
  
  // Search results (can change frequently)
  SEARCH: cacheTime.SHORT,
  
  // Dashboard data (changes frequently)
  DASHBOARD: cacheTime.SHORT,
  
  // Real-time data (always fresh)
  REALTIME: 0,
} as const;