import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "",
  platform: "com.markzwe.food_ordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: '68a4c35b00051ca1c318',
  bucketId: '68a7fe5a00280b2b4f38',
  userCollectionId: '68a528cb0022006b42c3',
  categoriesCollectionId: '68a7f8200033cc4de76a',
  menuCollectionId: '68a7f8c2001d263d0047',
  customizationsCollectionId: '68a7f9b8001d4dd82948', 
  menuCustomizationsCollectionId: '68a7fc3e0029d2724d11'
};

export const client = new Client();

client.setEndpoint(appwriteConfig.endpoint);
client.setProject(appwriteConfig.projectId);
client.setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({ name, email, password }: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) { throw Error("Failed to create user account") }

    //auto sign in the user after creation
    await signIn({ email, password });

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        name,
        email,
        avatar: avatarUrl
      }
    )

    return newUser;
  } catch (error) {
    throw new Error("Failed to create user: " + (error instanceof Error ? error.message : String(error)));
  }
}
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) { throw Error("No user found") }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )
    return currentUser.documents[0]
  } catch (error) {
    throw new Error(error as string)
  }
}