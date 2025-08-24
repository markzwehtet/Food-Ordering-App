import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

/**
 * This file contains the seeding functionality for your food delivery app.
 * Seeding means populating your database with initial/sample data.
 * 
 * The seed function will:
 * 1. Clear all existing data
 * 2. Create food categories
 * 3. Create food customizations (toppings, sizes, etc.)
 * 4. Create menu items with images
 * 5. Link menu items to their customizations
 */

/**
 * TypeScript interfaces that define the structure of our data.
 * These help ensure our data is properly formatted.
 */

// Represents a food category (e.g., "Pizza", "Burgers", "Drinks")
interface Category {
    name: string;        // Category name
    description: string; // Category description
}

// Represents food customizations (e.g., toppings, sizes, crust types)
interface Customization {
    name: string;        // Customization name (e.g., "Extra Cheese")
    price: number;       // Additional cost for this customization
    type: "topping" | "side" | "size" | "crust" | string; // Type of customization
}

// Represents a menu item (food item)
interface MenuItem {
    name: string;        // Food item name
    description: string; // Food item description
    image_url: string;   // URL to the food image
    price: number;       // Base price of the food item
    rating: number;      // Average rating (1-5 stars)
    calories: number;    // Calorie count
    protein: number;     // Protein content
    category_name: string; // Which category this item belongs to
    customizations: string[]; // List of customization names that can be applied
}

// Main data structure that contains all the sample data
interface DummyData {
    categories: Category[];      // Array of food categories
    customizations: Customization[]; // Array of food customizations
    menu: MenuItem[];           // Array of menu items
}

// Ensure the imported data matches our expected structure
const data = dummyData as DummyData;

/**
 * Helper function to clear all documents from a specific collection.
 * This is useful when you want to start fresh with new data.
 * 
 * @param collectionId - The ID of the collection to clear
 */
async function clearAll(collectionId: string): Promise<void> {
    // Get all documents from the collection
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,  // Database ID
        collectionId                 // Collection ID to clear
    );

    // Delete all documents in parallel for better performance
    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

/**
 * Helper function to clear all files from the storage bucket.
 * This removes all uploaded images and files.
 */
async function clearStorage(): Promise<void> {
    // Get all files from the storage bucket
    const list = await storage.listFiles(appwriteConfig.bucketId);

    // Delete all files in parallel for better performance
    await Promise.all(
        list.files.map((file: { $id: any; }) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

/**
 * Helper function to upload an image from a URL to Appwrite storage.
 * This function:
 * 1. Downloads the image from the provided URL
 * 2. Uploads it to Appwrite storage
 * 3. Returns a URL that can be used to view the image
 * 
 * @param imageUrl - The URL of the image to upload
 * @returns A URL that can be used to display the uploaded image
 */
async function uploadImageToStorage(imageUrl: string) {
    // Download the image from the URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Prepare the file object for upload
    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`, // Extract filename or generate one
        type: blob.type,    // MIME type (e.g., "image/jpeg")
        size: blob.size,    // File size in bytes
        uri: imageUrl,      // Original URL
    };

    // Upload the file to Appwrite storage
    const file = await storage.createFile(
        appwriteConfig.bucketId,  // Storage bucket ID
        ID.unique(),              // Generate unique file ID
        fileObj                   // File object to upload
    );

    // Return a URL that can be used to view the uploaded image
    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
}

/**
 * Main seeding function that populates the database with sample data.
 * This function runs in a specific order to maintain data relationships.
 */
async function seed(): Promise<void> {
    // Step 1: Clear all existing data to start fresh
    console.log("🧹 Clearing existing data...");
    await clearAll(appwriteConfig.categoriesCollectionId);      // Clear categories
    await clearAll(appwriteConfig.customizationsCollectionId);  // Clear customizations
    await clearAll(appwriteConfig.menuCollectionId);            // Clear menu items
    await clearAll(appwriteConfig.menuCustomizationsCollectionId); // Clear menu-customization links
    await clearStorage();                                       // Clear uploaded images

    // Step 2: Create Categories
    console.log("📂 Creating categories...");
    const categoryMap: Record<string, string> = {};  // Map category names to their IDs
    for (const cat of data.categories) {
        try {
            // Create a category document in the database
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,               // Database ID
                appwriteConfig.categoriesCollectionId,   // Categories collection ID
                ID.unique(),                             // Generate unique document ID
                cat                                      // Category data (name, description)
            );
            // Store the mapping of category name to document ID for later use
            categoryMap[cat.name] = doc.$id;
        } catch (error) {
            console.log("Error creating document in collection: categoriesCollectionId");
            console.log("Error:", error);
            throw error;
        }
    }

    // Step 3: Create Customizations
    console.log("🔧 Creating customizations...");
    const customizationMap: Record<string, string> = {};  // Map customization names to their IDs
    for (const cus of data.customizations) {
        try {
            // Create a customization document in the database
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,                   // Database ID
                appwriteConfig.customizationsCollectionId,   // Customizations collection ID
                ID.unique(),                                 // Generate unique document ID
                {
                    name: cus.name,    // Customization name (e.g., "Extra Cheese")
                    price: cus.price,  // Additional cost
                    type: cus.type,    // Type (e.g., "topping", "size")
                }
            );
            // Store the mapping of customization name to document ID for later use
            customizationMap[cus.name] = doc.$id;
        } catch (error) {
            console.log("Error creating document in collection: customizationsCollectionId");
            console.log("Error:", error);
            throw error;
        }
    }

    // Step 4: Create Menu Items
    console.log("🍕 Creating menu items...");
    const menuMap: Record<string, string> = {};  // Map menu item names to their IDs
    for (const item of data.menu) {
        // Upload the menu item's image to Appwrite storage
        const uploadedImage = await uploadImageToStorage(item.image_url);

        let doc;
        try {
            // Create a menu item document in the database
            doc = await databases.createDocument(
                appwriteConfig.databaseId,           // Database ID
                appwriteConfig.menuCollectionId,     // Menu items collection ID
                ID.unique(),                         // Generate unique document ID
                {
                    name: item.name,                 // Food item name
                    description: item.description,   // Food item description
                    image_url: uploadedImage,        // URL of uploaded image
                    price: item.price,               // Base price
                    rating: item.rating,             // Average rating
                    calories: item.calories,         // Calorie count
                    protein: item.protein,           // Protein content
                    categories: categoryMap[item.category_name], // Link to category
                    integer: 1,                      // Required field for the collection
                }
            );
        } catch (error) {
            console.log("Error creating document in collection: menuCollectionId");
            console.log("Error:", error);
            throw error;
        }

        // Store the mapping of menu item name to document ID for later use
        menuMap[item.name] = doc.$id;

        // Step 5: Create menu-customization relationships
        // This links each menu item to its available customizations
        for (const cusName of item.customizations) {
            try {
                // Create a relationship document that links menu item to customization
                await databases.createDocument(
                    appwriteConfig.databaseId,                       // Database ID
                    appwriteConfig.menuCustomizationsCollectionId,   // Relationship collection ID
                    ID.unique(),                                     // Generate unique document ID
                    {
                        menu: doc.$id,                               // Link to the menu item
                        customizations: customizationMap[cusName],   // Link to the customization
                    }
                );
            } catch (error) {
                console.log("Error creating document in collection: menuCustomizationsCollectionId");
                console.log("Error:", error);
                throw error;
            }
        }
    }

    console.log("✅ Seeding complete! Your database is now populated with sample data.");
}

export default seed;