 interface Media {
    file?: File;
    url?: string;
    aspect_ratio?: number;
  }
  
   export type PostData ={
    content: string;
    media: Media[];
    userId: string;
  }


  