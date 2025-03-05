export default {
  async fetch(request, env) {
    try {
      // Parse the request body as JSON
      const requestBody = await request.json();

      // Validate that "prompt" exists
      if (!requestBody.prompt || typeof requestBody.prompt !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid prompt" }), { status: 400 });
      }

      // Construct the input object, passing all available parameters
      const inputs = {
        prompt: requestBody.prompt,
        negative_prompt: requestBody.negative_prompt || "",
        height: requestBody.height || 512, // Default height
        width: requestBody.width || 512, // Default width
        image: requestBody.image || null,
        image_b64: requestBody.image_b64 || null,
        mask: requestBody.mask || null,
        num_steps: requestBody.num_steps || 20, // Default steps
        strength: requestBody.strength || 1.0,
        guidance: requestBody.guidance || 7.5,
        seed: requestBody.seed || Math.floor(Math.random() * 1000000), // Random seed if none provided
      };

      // Call the Stable Diffusion model
      const response = await env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);

      return new Response(response, {
        headers: { "content-type": "image/png" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request format" }), { status: 400 });
    }
  },
} satisfies ExportedHandler<Env>;
