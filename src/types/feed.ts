export interface Post {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    full_name: string;
    avatar: string | null;
    media: {
      id: string;
      url: string;
      position: number;
      aspect_ratio: number;
    }[] | null;
  }
  
  export interface FeedQueryParams {
    cursor?: string;
    limit?: number;
  }
  
  export interface FeedResponse {
    data: Post[];
    nextCursor: string | null;
  }

  export interface Media {
    id: string
    url: string
    position: number
    aspect_ratio: number
  }
  

  
  