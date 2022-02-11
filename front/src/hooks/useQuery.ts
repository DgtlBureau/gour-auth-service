import { useMemo } from 'react';

export const useQuery = (): URLSearchParams => {
    return useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);
};
