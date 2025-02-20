const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const BASE_URL = process.env.GEMINI_BASE_URL || '';

// Cache cho suggestions
const CACHE_DURATION = 60 * 1000; // Giảm xuống 1 phút
const suggestionsCache = new Map<string, { data: any; timestamp: number }>();

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface Suggestion {
  type: 'viewed' | 'purchased' | 'category' | 'search';
  reason: string;
  keywords: string[];
}

const DEFAULT_SUGGESTIONS = [
  {
    type: 'category' as const,
    reason: 'Giày thể thao phổ biến',
    keywords: ['giày thể thao', 'sneaker', 'running shoes']
  },
  {
    type: 'category' as const,
    reason: 'Giày thời trang',
    keywords: ['giày casual', 'giày lười', 'slip on']
  },
  {
    type: 'category' as const,
    reason: 'Giày chạy bộ',
    keywords: ['giày chạy', 'running', 'marathon']
  }
];

// Cache theo user behavior
const getCacheKey = (behavior: any) => {
  const { viewedProducts, purchasedProducts, searchHistory, categoryPreferences } = behavior;
  
  // Chỉ lấy các term từ searchHistory
  const searchTerms = searchHistory
    .map((item: any) => typeof item === 'string' ? item : item.term)
    .filter(Boolean);

  // Chỉ lấy các category từ categoryPreferences  
  const categories = categoryPreferences
    .map((item: any) => typeof item === 'string' ? item : item.category)
    .filter(Boolean);

  return JSON.stringify({
    viewedProducts,
    purchasedProducts, 
    searchTerms,
    categories
  });
};

export async function getProductSuggestions(userBehavior: {
  viewedProducts: string[];
  purchasedProducts: string[];
  searchHistory: any[];
  categoryPreferences: any[];
}) {
  try {
    // Format lại dữ liệu
    const searchTerms = userBehavior.searchHistory
      .map(item => typeof item === 'string' ? item : item.term)
      .filter(Boolean);
      
    const categories = userBehavior.categoryPreferences
      .map(item => typeof item === 'string' ? item : item.category)
      .filter(Boolean);

    // Kiểm tra có hành vi người dùng không
    const hasUserBehavior = 
      userBehavior.viewedProducts.length > 0 ||
      userBehavior.purchasedProducts.length > 0 ||
      searchTerms.length > 0 ||
      categories.length > 0;

    if (!hasUserBehavior) {
      return { suggestions: DEFAULT_SUGGESTIONS };
    }

    // Tạo cache key
    const cacheKey = getCacheKey(userBehavior);
    
    // Kiểm tra cache
    const cached = suggestionsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const prompt = `Bạn là một AI assistant giúp gợi ý sản phẩm giày. Dựa trên hành vi người dùng sau:
      - Sản phẩm đã xem: ${userBehavior.viewedProducts.join(', ') || 'Chưa có'}
      - Sản phẩm đã mua: ${userBehavior.purchasedProducts.join(', ') || 'Chưa có'}
      - Lịch sử tìm kiếm: ${searchTerms.join(', ') || 'Chưa có'}
      - Danh mục ưa thích: ${categories.join(', ') || 'Chưa có'}

      Hãy phân tích và đưa ra 5 gợi ý sản phẩm phù hợp nhất. Chỉ trả về dữ liệu dưới dạng JSON với format sau:
      {
        "suggestions": [
          {
            "type": "category",
            "reason": "Phù hợp với sở thích của bạn",
            "keywords": ["giày thể thao", "sneaker"]
          }
        ]
      }

      Lưu ý:
      - type chỉ được là một trong các giá trị: "viewed", "purchased", "category", "search"
      - keywords phải là mảng các từ khóa liên quan đến giày
      - Trả về chính xác format JSON như trên, không thêm text hay giải thích
      `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    try {
      const response = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get suggestions from Gemini AI');
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text;

      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }

      try {
        // Thử parse trực tiếp
        const parsedData = JSON.parse(text.trim());
        
        // Validate cấu trúc dữ liệu
        if (!parsedData.suggestions || !Array.isArray(parsedData.suggestions)) {
          return { suggestions: DEFAULT_SUGGESTIONS };
        }

        // Validate và format từng suggestion
        const validatedSuggestions = parsedData.suggestions.map((suggestion: any) => ({
          type: ['viewed', 'purchased', 'category', 'search'].includes(suggestion.type) 
            ? suggestion.type 
            : 'category',
          reason: suggestion.reason || 'Gợi ý dựa trên sở thích của bạn',
          keywords: Array.isArray(suggestion.keywords) ? suggestion.keywords : ['giày thể thao']
        }));

        const result = { suggestions: validatedSuggestions };
        
        // Lưu vào cache
        suggestionsCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });

        return result;
      } catch (parseError) {
        return { suggestions: DEFAULT_SUGGESTIONS };
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Gemini API request timed out');
      }
      return { suggestions: DEFAULT_SUGGESTIONS };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    return { suggestions: DEFAULT_SUGGESTIONS };
  }
} 