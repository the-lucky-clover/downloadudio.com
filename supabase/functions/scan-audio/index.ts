import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Scanning URL for audio:", url);

    // Fetch the HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const audioUrls: { url: string; filename: string; type?: string }[] = [];

    // Extract audio from <audio> tags
    const audioTagRegex = /<audio[^>]*>[\s\S]*?<\/audio>/gi;
    const audioMatches = html.match(audioTagRegex) || [];
    
    for (const audioTag of audioMatches) {
      // Extract src attribute
      const srcMatch = audioTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const audioUrl = new URL(srcMatch[1], url).href;
        audioUrls.push({
          url: audioUrl,
          filename: audioUrl.split('/').pop() || 'audio',
          type: 'audio tag',
        });
      }

      // Extract source elements inside audio tag
      const sourceRegex = /<source[^>]*src=["']([^"']+)["'][^>]*>/gi;
      let sourceMatch;
      while ((sourceMatch = sourceRegex.exec(audioTag)) !== null) {
        const audioUrl = new URL(sourceMatch[1], url).href;
        audioUrls.push({
          url: audioUrl,
          filename: audioUrl.split('/').pop() || 'audio',
          type: 'audio source',
        });
      }
    }

    // Extract standalone audio file links (mp3, wav, ogg, etc.)
    const audioFileRegex = /(?:href|src)=["']([^"']*\.(mp3|wav|ogg|m4a|flac|aac|wma)(?:\?[^"']*)?)["']/gi;
    let fileMatch;
    while ((fileMatch = audioFileRegex.exec(html)) !== null) {
      const audioUrl = new URL(fileMatch[1], url).href;
      if (!audioUrls.some(a => a.url === audioUrl)) {
        audioUrls.push({
          url: audioUrl,
          filename: fileMatch[1].split('/').pop()?.split('?')[0] || 'audio',
          type: fileMatch[2].toUpperCase(),
        });
      }
    }

    console.log(`Found ${audioUrls.length} audio sources`);

    return new Response(
      JSON.stringify({ 
        success: true,
        audioUrls,
        count: audioUrls.length 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error scanning URL:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
