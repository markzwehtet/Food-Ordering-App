import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

/**
 * This file contains all the Appwrite configuration and API functions.
 * Appwrite is our backend-as-a-service that handles:
 * - User authentication
 * - Database operations
 * - File storage
 * - Real-time updates
 */

/**
 * Configuration object that contains all the IDs and settings for our Appwrite project.
 * These IDs are specific to your Appwrite project and should be kept secure.
 */
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "",        // Your Appwrite server URL
  platform: "com.markzwe.food_ordering",                           // Your app's platform identifier
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",     // Your Appwrite project ID
  databaseId: '68a4c35b00051ca1c318',                              // Your main database ID
  bucketId: '68a7fe5a00280b2b4f38',                                // File storage bucket ID
  userCollectionId: '68a528cb0022006b42c3',                        // Collection for user profiles
  categoriesCollectionId: '68a7f8200033cc4de76a',                  // Collection for food categories
  menuCollectionId: '68a7f8c2001d263d0047',                        // Collection for menu items
  customizationsCollectionId: '68a7f9b8001d4dd82948',              // Collection for food customizations
  menuCustomizationsCollectionId: '68a7fc3e0029d2724d11'           // Collection linking menus to customizations
};

/**
 * Create and configure the main Appwrite client.
 * This client is used to connect to your Appwrite backend.
 */
export const client = new Client();

// Configure the client with your project settings
client.setEndpoint(appwriteConfig.endpoint);    // Set the server URL
client.setProject(appwriteConfig.projectId);    // Set your project ID
client.setPlatform(appwriteConfig.platform);    // Set your platform identifier

/**
 * Create service instances for different Appwrite features:
 * - account: Handles user authentication (sign up, sign in, etc.)
 * - databases: Handles database operations (create, read, update, delete documents)
 * - storage: Handles file uploads and downloads
 * - avatars: Generates user avatar images
 */
export const account = new Account(client);      // For user authentication
export const databases = new Databases(client);  // For database operations
export const storage = new Storage(client);      // For file storage
const avatars = new Avatars(client);             // For generating avatars

/**
 * Creates a new user account and profile in the system.
 * This function does several things:
 * 1. Creates an Appwrite account (for authentication)
 * 2. Automatically signs in the user
 * 3. Creates a user profile document in the database
 * 4. Generates an avatar for the user
 * 
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password
 * @returns The created user profile document
 */
export const createUser = async ({ name, email, password }: CreateUserParams) => {
  try {
    // Step 1: Create the Appwrite account (this handles authentication)
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) { throw Error("Failed to create user account") }

    // Step 2: Automatically sign in the user after account creation
    await signIn({ email, password });

    // Step 3: Generate an avatar URL for the user
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;

    // Step 4: Create a user profile document in our database
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,           // Database ID
      appwriteConfig.userCollectionId,     // Collection ID for users
      ID.unique(),                         // Generate a unique document ID
      {
        accountId: newAccount.$id,         // Link to the Appwrite account
        name,                              // User's name
        email,                             // User's email
        avatar: avatarUrl                  // User's avatar URL
      }
    )

    return newUser;
  } catch (error) {
    throw new Error("Failed to create user: " + (error instanceof Error ? error.message : String(error)));
  }
}
/**
 * Signs in a user with their email and password.
 * This creates a session that keeps the user logged in.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns A session object (though we don't use it directly)
 */
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // Create a new session using email and password
    const session = await account.createEmailPasswordSession(email, password);
    // The session is automatically stored by Appwrite
  } catch (error) {
    throw new Error(error as string)
  }
}

/**
 * Gets the currently logged-in user's profile information.
 * This function:
 * 1. Gets the current Appwrite account
 * 2. Finds the corresponding user profile in our database
 * 
 * @returns The current user's profile document, or null if not found
 */
export const getCurrentUser = async () => {
  try {
    // Step 1: Get the current Appwrite account (this checks if user is logged in)
    const currentAccount = await account.get();
    if (!currentAccount) { throw Error("No user found") }

    // Step 2: Find the user profile in our database using the account ID
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,                    // Database ID
      appwriteConfig.userCollectionId,              // Collection ID for users
      [Query.equal("accountId", currentAccount.$id)] // Find user with matching account ID
    )
    return currentUser.documents[0]  // Return the first (and should be only) user found
  } catch (error) {
    throw new Error(error as string)
  }
}

/**
 * Gets menu items from the database with optional filtering.
 * This function can filter by category and/or search by name.
 * 
 * @param category - Optional category ID to filter by
 * @param query - Optional search term to search in menu item names
 * @returns Array of menu items that match the filters
 */
export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    // Build an array of query filters
    const queries: string[] = [];

    // Add category filter if provided
    if (category) queries.push(Query.equal('categories', category));

    // Add search filter if provided (searches in the 'name' field)
    if (query) queries.push(Query.search('name', query));

    // Get menu items from the database with the specified filters
    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,           // Database ID
      appwriteConfig.menuCollectionId,     // Collection ID for menu items
      queries                              // Array of filters to apply
    )
    return menus.documents;  // Return the array of menu items

  } catch (error) {
    console.log(error)
  }
}
/**
 * Gets all food categories from the database.
 * Categories are used to organize menu items (e.g., "Pizza", "Burgers", "Drinks").
 * 
 * @returns Array of all category documents
 */
export const getCategories = async () => {
  try {
    // Get all documents from the categories collection
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,               // Database ID
      appwriteConfig.categoriesCollectionId    // Collection ID for categories
    )
    return categories.documents;  // Return the array of categories
  } catch (error) {
    console.log(error)
  }
}
