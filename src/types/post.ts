//  interface Media {
//     file?: File;
//     url?: string;
//     aspect_ratio?: number;
//   }
  
  //  export type PostData ={
  //   content: string;
  //   media: Media[];
  //   userId: string;
  // }


  export type PostData= {
    content: string;
    userId: string;
    media: (File | { url: string; aspect_ratio?: number })[];
  }
  
  // interface Media {
  //   file?: File;
  //   url?: string;
  //   aspect_ratio?: number;
  // }
  
  // interface PostData {
  //   content: string;
  //   userId: string;
  //   media: (File | { url: string; aspect_ratio?: number })[];
  // }