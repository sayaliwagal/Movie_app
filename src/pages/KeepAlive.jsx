import React, { useEffect } from 'react'
 import { getTrendingmovies } from '../appwrite'
const KeepAlive = () => {

    useEffect(() => {
        const pingAppwrite = async () => {
            try {
                await getTrendingmovies();
                console.log("Appwrite ping successfull!");
            }catch(e){
                console.error("Appwrite ping failed:", e);
            };
        };
        pingAppwrite();
    },[]);
  return (
    <div>
      Server is alive!
    </div>
  )
}

export default KeepAlive
