import { supabase, supabaseUrl } from "../lib/supabase";
import { PostData } from "../types/post";

export async function createEditPost(postData : PostData) {
  // Helper function to get aspect ratio
  const getAspectRatio = async (file:any) => {
    return new Promise((resolve) => {
      if (file.type?.startsWith('video')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => resolve(video.videoWidth / video.videoHeight);
        video.src = URL.createObjectURL(file);
      } else {
        const img = new Image();
        img.onload = () => resolve(img.width / img.height);
        img.src = URL.createObjectURL(file);
      }
    });
  };

  try {
    console.log('Processing post data:', { content: postData.content, mediaCount: postData.media?.length });

    // 1. Process media files
    const mediaFiles = await Promise.all(
      (postData.media || []).map(async (media, index) => {
        // Check if media is already a URL (existing media)
        if ('url' in media && media.url && media.url.startsWith(supabaseUrl)) {
          return {
            url: media.url,
            position: index + 1,
            aspect_ratio: media.aspect_ratio
          };
        }

        // Handle new file upload
        const file = 'file' in media ? media.file : media;
        if (!file) {
          console.error('Invalid media item:', media);
          throw new Error('Invalid media format');
        }

        //@ts-expect-error this is fine
        const fileName = `${Date.now()}-${Math.random()}-${file.name}`.replaceAll("/", "");
        const filePath = `${supabaseUrl}/storage/v1/object/public/post-media/${fileName}`;
        const aspectRatio = await getAspectRatio(file);

        return {
          file,
          fileName,
          url: filePath,
          position: index + 1,
          aspect_ratio: aspectRatio
        };
      })
    );

    // 2. Create/edit post
    const postPayload = {
      content: postData.content,
      user_id: postData.userId
    };

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert([postPayload])
      .select()
      .single();

    if (postError) {
      console.error('Post creation error:', postError);
      throw new Error("Post could not be created");
    }

    // 3. Upload media files
    const mediaPromises = mediaFiles.map(async (media) => {
      // Skip upload for existing files
      if (media.url.startsWith(supabaseUrl) && !media.file) {
        return media;
      }

      // Upload new file
      const { error: storageError } = await supabase.storage
        .from("post-media")
        .upload(media.fileName, media.file as unknown as File);

      if (storageError) {
        console.error('Storage error:', storageError);
        throw new Error(`Failed to upload media: ${media.fileName}`);
      }

      return media;
    });

    const uploadedMedia = await Promise.all(mediaPromises);

    // 4. Handle media records
  
    // Create new media records
    const { error: mediaError } = await supabase.from("post_media").insert(
      uploadedMedia.map((media) => ({
        post_id: post.id,
        media_url: media.url,
        position: media.position,
        aspect_ratio: media.aspect_ratio
      }))
    );

    if (mediaError) {
      console.error('Media record error:', mediaError);
      // Rollback: delete post and uploaded files
      await supabase.from("posts").delete().eq("id", post.id);
      await Promise.all(
        uploadedMedia.map((media) =>
          supabase.storage.from("post-media").remove([media.fileName])
        )
      );
      throw new Error("Failed to create media records");
    }

    // 5. Fetch complete post
    const { data: completePost, error: fetchError } = await supabase
      .from("posts")
      .select(`
        *,
        post_media (*)
      `)
      .eq("id", post.id)
      .single();

    if (fetchError) {
      throw new Error("Failed to fetch complete post");
    }

    return completePost;

  } catch (error) {
    console.error("Error in createEditPost:", error);
    throw error;
  }
}