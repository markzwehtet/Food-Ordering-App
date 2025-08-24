import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * This is a custom React hook that makes it easier to work with Appwrite API calls.
 * It handles loading states, errors, and data management automatically.
 * 
 * Think of it like a "smart wrapper" around your API calls that:
 * - Shows loading spinner while fetching data
 * - Handles errors automatically
 * - Stores the data for you
 * - Lets you refresh the data when needed
 */

// This interface defines what options you can pass to the hook
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;  // The API function you want to call
    params?: P;                     // Parameters to pass to the API function
    skip?: boolean;                 // Whether to skip the API call initially
}

// This interface defines what the hook returns to you
interface UseAppwriteReturn<T, P> {
    data: T | null;                 // The data from your API call
    loading: boolean;               // Whether the API call is in progress
    error: string | null;           // Any error message if the call failed
    refetch: (newParams?: P) => Promise<void>;  // Function to call the API again
}

/**
 * Custom hook that wraps Appwrite API calls with loading, error, and data management
 * 
 * @param fn - The API function to call (like getRestaurants, getUser, etc.)
 * @param params - Parameters to pass to the API function
 * @param skip - Whether to skip the initial API call (useful for conditional calls)
 * @returns Object containing data, loading state, error, and refetch function
 */
const useAppwrite = <T, P extends Record<string, string | number>>({
    fn,
    params = {} as P,
    skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    // State to store the data returned from the API
    const [data, setData] = useState<T | null>(null);

    // State to track if the API call is currently loading
    // If skip is true, we start with loading = false, otherwise loading = true
    const [loading, setLoading] = useState(!skip);

    // State to store any error messages if the API call fails
    const [error, setError] = useState<string | null>(null);

    /**
     * This function handles the actual API call
     * It's wrapped in useCallback to prevent unnecessary re-renders
     * 
     * @param fetchParams - Parameters to pass to the API function
     */
    const fetchData = useCallback(
        async (fetchParams: P) => {
            // Start loading state
            setLoading(true);
            // Clear any previous errors
            setError(null);

            try {
                // Call the API function with the provided parameters
                const result = await fn({ ...fetchParams });
                // Store the successful result
                setData(result);
            } catch (err: unknown) {
                // Handle any errors that occur during the API call
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                // Store the error message
                setError(errorMessage);
                // Show an alert to the user
                Alert.alert("Error", errorMessage);
            } finally {
                // Always stop loading, whether the call succeeded or failed
                setLoading(false);
            }
        },
        [fn] // Only recreate this function if 'fn' changes
    );

    /**
     * This effect runs when the component first mounts
     * It automatically calls the API function unless skip is true
     */
    useEffect(() => {
        if (!skip) {
            fetchData(params);
        }
    }, []); // Empty dependency array means this only runs once when component mounts

    /**
     * Function to manually call the API again
     * Useful for refreshing data or calling with new parameters
     * 
     * @param newParams - Optional new parameters to use for the API call
     */
    const refetch = async (newParams?: P) => await fetchData(newParams!);

    // Return all the state and functions that components can use
    return { data, loading, error, refetch };
};

export default useAppwrite;