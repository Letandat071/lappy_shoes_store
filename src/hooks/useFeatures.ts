import { useState, useEffect } from 'react';

interface Feature {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      const fetchFeatures = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/admin/features');
          const data = await response.json();
          
          if (response.ok) {
            // Lọc chỉ lấy các feature đang active
            const activeFeatures = data.features.filter((feature: Feature) => feature.isActive);
            setFeatures(activeFeatures);
          } else {
            setError(data.error || 'Failed to fetch features');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch features');
        } finally {
          setLoading(false);
          setHasFetched(true);
        }
      };
      fetchFeatures();
    }
  }, [hasFetched]);

  return { features, loading, error };
}; 