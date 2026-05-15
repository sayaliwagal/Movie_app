import { Client, Account, Databases, ID, Query, Storage, Functions,Permission,Role } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
// console.log("Loaded Appwrite Project ID:", PROJECT_ID);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const COLLECTION_USER_PROFILE_ID = import.meta.env.VITE_APPWRITE_USER_PROFILES_COLLECTION_ID;
// console.log("Loaded Appwrite Project ID:", COLLECTION_USER_PROFILE_ID );

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID);
console.log(client);
const account = new Account(client);
const database = new Databases(client);
const storage  = new Storage(client);
const functions = new Functions(client);

// ----User Authentication Function 
/**
    * @param {string} email - The user's email address. 
 * @param {string} password - The user's password.
 * @param {string} [name=''] - The user's display name (optional).
 * @returns {Promise<object>} A promise that resolves with the user object on success.
 * @throws {Error} Throws an error if registration fails.
 */

export const registerUser = async (email, password, name = '') => {
    try { 
        const user = await account.create(
            ID.unique(),  //Generate a unique user ID
            email,       // User's email
            password,   // User's password
            name       // User's name (optional)
        );
        console.log("User created successfully:", user);
//Create a session for the user(login automatically after registration)
// await account.createEmailPasswordSession(email, password)
//Create a user profile document in the user profiles collection
        // New : create a user profile document in the new collection ------
 try {
      const profileDoc = await database.createDocument(
            DATABASE_ID,
            COLLECTION_USER_PROFILE_ID,
            ID.unique(),
            
            
            {
                //Map you profile attributes here
                userId: user.$id,
                name: user.name || "",
                email: user.email,
                createdAt: new Date().toISOString()
            },
            // [
            //     Permission.read(Role.user(user.$id)), //Read permission for this specific user
            //     Permission.write(Role.user(user.$id)), //Write permission for this specific user
            //     Permission.update(Role.user(user.$id)), //Update permission for this specific user
            //     Permission.delete(Role.user(user.$id)), //Delete permission for this specific user 
            // ]
        )
        console.log("User profile created successfully: ", profileDoc)
 }  catch(profileError){
    console.error("Error creating user profile:", profileError);
 }    
        
        return user 
    } catch (error) {
        console.error("Appwrite Registration Error :", error);
        //Re- throw the error so the calling component can handle it 
        throw new Error(error.response?.meassage || 'Failed to register user.');
    }
};

/**
 * Logs in a user with email and password.
 * @param {string} email - The user's email address. 
 * @param {string} password - The user's password.
 * @returns {Promise<object>} A promise that resolves with the session object on success.
 * @throws {Error} Throws an error if login fails. 
 */

export const loginUser = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    }catch (error) {
        console.error("Appwrite Login Error:", error);
        throw new Error(error.response?.meassage || 'Failed to log in. ');
    }
};

/**
 * Logs out the current user.
 * @returns {Promise<void>} A promis that resolves when the session is deleted. 
 * @throws {Error} Throws an error if logout fails. 
 */

export const logoutUser = async () => {
    try {
        await account.deleteSession('current'); //Deletes the current active session
    } catch (error) {
        console.error("Appwrite Logot Error:", error);
        throw new Error(error.response?.meassage || 'Failed to log out.');
    }
};

/**
 * Gets the currently logged-in user's account details.
 * @returns {Promise<object || null>} A promise that resolves with the user object if logged in, otherwise null. 
 */

export const getCrrentUser = async () => {
    try {
        const user = await account.get();
        return useScratch;
    }catch (error){
        if(error.code === 401)
            return null;

        console.error("Error getting current user:", error); 
    }
};
export const updateSearchCount = async (search, movie) => {
// 1. Use Appwrite sdk to cehck if the search term exists in the database
try {
    const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID, [Query.equal('search', search),])
// 2. If it does, update the count
    if(result.documents.length > 0){
        const doc = result.documents[0];

        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
           count: doc.count + 1, })
 // 3. If it doesn't create a new document with the serach term and count as 1.
    }else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),  {
                search,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
           
            })
    }
} catch (error) {
    console.error(error);
   }
}

export const getTrendingmovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents;
    } catch(error){
        console.log(error);
    }
};

