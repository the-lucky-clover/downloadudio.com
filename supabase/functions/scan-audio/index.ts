import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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

    // Fetch the HTML content with browser-like headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const audioUrls: { url: string; filename: string; type?: string }[] = [];
    
    // Parse with DOMParser for better JavaScript content extraction
    const document = new DOMParser().parseFromString(html, 'text/html');

    // Strategy 1: Extract from <audio> and <video> tags (DOM parsing)
    const audioElements = document?.querySelectorAll('audio, video');
    if (audioElements) {
      for (const element of audioElements) {
        const src = (element as any).getAttribute?.('src');
        if (src) {
          try {
            const audioUrl = new URL(src, url).href;
            audioUrls.push({
              url: audioUrl,
              filename: audioUrl.split('/').pop()?.split('?')[0] || 'audio',
              type: 'media element',
            });
          } catch (e) {
            console.log("Invalid URL:", src);
          }
        }
        
        // Check source children
        const sources = (element as any).querySelectorAll?.('source');
        if (sources) {
          for (const source of sources) {
            const src = (source as any).getAttribute?.('src');
            if (src) {
              try {
                const audioUrl = new URL(src, url).href;
                audioUrls.push({
                  url: audioUrl,
                  filename: audioUrl.split('/').pop()?.split('?')[0] || 'audio',
                  type: 'source element',
                });
              } catch (e) {
                console.log("Invalid URL:", src);
              }
            }
          }
        }
      }
    }
    
    // Strategy 2: Look for JSON data in script tags (Next.js __NEXT_DATA__)
    const scriptTags = document?.querySelectorAll('script');
    if (scriptTags) {
      for (const script of scriptTags) {
        const scriptContent = (script as any).textContent || '';
        
        // Look for Next.js data
        if (scriptContent.includes('__NEXT_DATA__') || (script as any).getAttribute?.('id') === '__NEXT_DATA__') {
          try {
            const jsonMatch = scriptContent.match(/({.*})/s);
            if (jsonMatch) {
              const data = JSON.parse(jsonMatch[1]);
              // Search for audio URLs in the JSON structure
              const foundUrls = findAudioUrlsInObject(data, url);
              audioUrls.push(...foundUrls);
            }
          } catch (e) {
            console.log("Error parsing Next.js data:", e);
          }
        }
        
        // Look for direct URL patterns in any script
        const urlPatterns = [
          /https?:\/\/[^"'\s]+\.(mp3|wav|ogg|m4a|flac|aac|wma)(\?[^"'\s]*)?/gi,
          /https?:\/\/[^"'\s]*cdn[^"'\s]*\.(mp3|wav|ogg|m4a|flac|aac|wma)(\?[^"'\s]*)?/gi,
          /"(https?:\/\/[^"]+\.(mp3|wav|ogg|m4a|flac|aac|wma)[^"]*)"/gi,
        ];
        
        for (const pattern of urlPatterns) {
          let match;
          while ((match = pattern.exec(scriptContent)) !== null) {
            const foundUrl = match[1] || match[0];
            const cleanUrl = foundUrl.replace(/['"]/g, '');
            if (!audioUrls.some(a => a.url === cleanUrl)) {
              audioUrls.push({
                url: cleanUrl,
                filename: cleanUrl.split('/').pop()?.split('?')[0] || 'audio',
                type: 'extracted from script',
              });
            }
          }
        }
      }
    }

    // Strategy 3: Regex fallback on raw HTML for any audio file URLs
    const audioFileRegex = /(?:href|src|url)=["']([^"']*\.(mp3|wav|ogg|m4a|flac|aac|wma)(?:\?[^"']*)?)["']/gi;
    let fileMatch;
    while ((fileMatch = audioFileRegex.exec(html)) !== null) {
      try {
        const audioUrl = new URL(fileMatch[1], url).href;
        if (!audioUrls.some(a => a.url === audioUrl)) {
          audioUrls.push({
            url: audioUrl,
            filename: fileMatch[1].split('/').pop()?.split('?')[0] || 'audio',
            type: fileMatch[2].toUpperCase(),
          });
        }
      } catch (e) {
        console.log("Invalid URL in regex match:", fileMatch[1]);
      }
    }
    
    // Strategy 4: Look for CDN patterns and blob URLs in the HTML
    const cdnRegex = /https?:\/\/[^"'\s]*(?:cdn|cloudfront|storage|audio)[^"'\s]*\.(mp3|wav|ogg|m4a|flac|aac|wma|mp4)(?:\?[^"'\s]*)?/gi;
    let cdnMatch: RegExpExecArray | null;
    while ((cdnMatch = cdnRegex.exec(html)) !== null) {
      if (!audioUrls.some(a => a.url === cdnMatch![0])) {
        audioUrls.push({
          url: cdnMatch[0],
          filename: cdnMatch[0].split('/').pop()?.split('?')[0] || 'audio',
          type: 'CDN URL',
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

// Helper function to recursively search for audio URLs in JSON objects
function findAudioUrlsInObject(obj: any, baseUrl: string): { url: string; filename: string; type?: string }[] {
  const results: { url: string; filename: string; type?: string }[] = [];
  
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma', 'mp4'];
  
  function search(item: any, path: string = '') {
    if (!item) return;
    
    if (typeof item === 'string') {
      // Check if it's a URL with audio extension
      if (item.startsWith('http') && audioExtensions.some(ext => item.toLowerCase().includes(`.${ext}`))) {
        results.push({
          url: item,
          filename: item.split('/').pop()?.split('?')[0] || 'audio',
          type: 'JSON data',
        });
      }
    } else if (Array.isArray(item)) {
      item.forEach((val, idx) => search(val, `${path}[${idx}]`));
    } else if (typeof item === 'object') {
      for (const key in item) {
        // Look for common audio-related keys
        if (['audio', 'audioUrl', 'audio_url', 'src', 'source', 'url', 'file', 'song', 'track'].includes(key.toLowerCase())) {
          search(item[key], `${path}.${key}`);
        } else {
          search(item[key], `${path}.${key}`);
        }
      }
    }
  }
  
  search(obj);
  return results;
}
