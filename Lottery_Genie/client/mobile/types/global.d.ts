declare global {
    type RequestError = {
       error?: {
          message: string,
          stack: string
       }
    }
    type Nullable<T> = T | null | undefined
 }

 export {}