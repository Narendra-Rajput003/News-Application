import redis from "../config/redis_config.js";


export const getCache=async(key)=>{

    const cacheData=await redis.get(key);
    // if data in cache then return response

    return cacheData? JSON.parse(cacheData) : null;



}

export const setCache=async(key,data,ttl=30)=>{

    // set data in cache with key and ttl
    await redis.set(key,JSON.stringify(data), "EX", ttl);


}

export const deleteCache=async(key)=>{
  // delete data from cache
    await redis.del(key);
}


  export default {getCache,setCache,deleteCache};