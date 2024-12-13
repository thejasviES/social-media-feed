// api/feed.ts

import { supabase } from '../lib/supabase';
import { FeedQueryParams, FeedResponse, Post } from '../types/feed';

export const fetchFeedPosts = async ({
  cursor,
  limit = 20
}: FeedQueryParams): Promise<FeedResponse> => {
  let query = supabase
    .from('feed_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit + 1); // Fetch one extra to determine if there's more

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching feed: ${error.message}`);
  }

  const hasMore = data && data.length > limit;
  const posts = hasMore ? data.slice(0, -1) : data || [];
  const nextCursor = hasMore ? posts[posts.length - 1].created_at : null;

  return {
    data: posts as Post[],
    nextCursor
  };
}