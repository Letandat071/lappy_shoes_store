import { useEffect } from 'react';

const MAX_HISTORY_ITEMS = 20;

const dispatchStorageEvent = (key: string) => {
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('userBehaviorChange', { detail: { key } }));
};

export function useUserBehavior() {
  const addViewedProduct = (productId: string) => {
    try {
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
      if (!viewedProducts.includes(productId)) {
        viewedProducts.unshift(productId);
        if (viewedProducts.length > MAX_HISTORY_ITEMS) {
          viewedProducts.pop();
        }
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
        dispatchStorageEvent('viewedProducts');
        console.log('Updated viewed products:', viewedProducts);
      }
    } catch (error) {
      console.error('Error updating viewed products:', error);
    }
  };

  const addPurchasedProduct = (productId: string) => {
    try {
      const purchasedProducts = JSON.parse(localStorage.getItem('purchasedProducts') || '[]');
      if (!purchasedProducts.includes(productId)) {
        purchasedProducts.unshift(productId);
        localStorage.setItem('purchasedProducts', JSON.stringify(purchasedProducts));
        dispatchStorageEvent('purchasedProducts');
      }
    } catch (error) {
      console.error('Error updating purchased products:', error);
    }
  };

  const addSearchTerm = (term: string) => {
    try {
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const timestamp = Date.now();

      const newSearch = {
        term,
        timestamp,
        count: 1
      };

      const existingIndex = searchHistory.findIndex((s: any) => s.term === term);

      if (existingIndex !== -1) {
        searchHistory[existingIndex].count += 1;
        searchHistory[existingIndex].timestamp = timestamp;
      } else {
        searchHistory.unshift(newSearch);
      }

      if (searchHistory.length > MAX_HISTORY_ITEMS) {
        searchHistory.pop();
      }

      searchHistory.sort((a: any, b: any) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.timestamp - a.timestamp;
      });

      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      dispatchStorageEvent('searchHistory');
      console.log('Updated search history:', searchHistory);
    } catch (error) {
      console.error('Error updating search history:', error);
    }
  };

  const addCategoryPreference = (category: string) => {
    try {
      const categoryPreferences = JSON.parse(localStorage.getItem('categoryPreferences') || '[]');
      const timestamp = Date.now();
      
      const newPreference = {
        category,
        timestamp,
        count: 1
      };

      const existingIndex = categoryPreferences.findIndex((p: any) => p.category === category);
      
      if (existingIndex !== -1) {
        categoryPreferences[existingIndex].count += 1;
        categoryPreferences[existingIndex].timestamp = timestamp;
      } else {
        categoryPreferences.unshift(newPreference);
      }

      if (categoryPreferences.length > MAX_HISTORY_ITEMS) {
        categoryPreferences.pop();
      }

      categoryPreferences.sort((a: any, b: any) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.timestamp - a.timestamp;
      });

      localStorage.setItem('categoryPreferences', JSON.stringify(categoryPreferences));
      dispatchStorageEvent('categoryPreferences');
      console.log('Updated category preferences:', categoryPreferences);
    } catch (error) {
      console.error('Error updating category preferences:', error);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('viewedProducts');
    localStorage.removeItem('purchasedProducts');
    localStorage.removeItem('searchHistory');
    localStorage.removeItem('categoryPreferences');
    dispatchStorageEvent('clearAll');
  };

  return {
    addViewedProduct,
    addPurchasedProduct,
    addSearchTerm,
    addCategoryPreference,
    clearHistory
  };
} 