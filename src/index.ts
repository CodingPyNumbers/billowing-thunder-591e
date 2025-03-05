export default {
  async fetch(request, env) {
    try {
      const requestBody = await request.json();
      
      // Validate that a prompt exists
      if (!requestBody.prompt || typeof requestBody.prompt !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid prompt" }), { status: 400 });
      }

      // Validate .image_b64 - must be either a valid string or null
      //if (requestBody.image_b64 && typeof requestBody.image_b64 !== "string") {
      //  return new Response(JSON.stringify({ error: "Invalid image_b64 format" }), { status: 400 });
      //}

      // Construct inputs object dynamically
      const inputs = {
        prompt: requestBody.prompt,
        negative_prompt: requestBody.negative_prompt || "",
        height: requestBody.height || 512,
        width: requestBody.width || 512,
        num_steps: requestBody.num_steps || 20,
        guidance: requestBody.guidance || 7.5,
        strength: requestBody.strength || 1.0,
        seed: requestBody.seed || undefined,
        //image_b64: requestBody.image_b64 || null,  // ✅ Ensure it's null if not provided
      };

      // Call Stable Diffusion
      const response = await env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);

      return new Response(response, {
        headers: { "content-type": "image/png" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request format", details: error.message }), { status: 400 });
    }
  },
} satisfies ExportedHandler<Env>;
