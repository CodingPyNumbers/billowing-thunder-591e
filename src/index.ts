export default {
  async fetch(request, env) {
    try {
      // Ensure the request is a POST request
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Only POST requests are allowed" }), { status: 405 });
      }

      // Parse the JSON body
      const requestBody = await request.json();

      // Ensure "prompt" is present and valid
      if (!requestBody.prompt || typeof requestBody.prompt !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid 'prompt'" }), { status: 400 });
      }

      // Construct the input object with all parameters
      const inputs = {
        prompt: requestBody.prompt,
        negative_prompt: requestBody.negative_prompt || "",
        height: requestBody.height || 512,
        width: requestBody.width || 512,
        num_steps: requestBody.num_steps || 20,
        strength: requestBody.strength ?? 1.0,  // Use "??" to allow 0 values
        guidance: requestBody.guidance ?? 7.5,
        seed: requestBody.seed ?? Math.floor(Math.random() * 1000000), // Default to random seed
        image: requestBody.image || null,
        image_b64: requestBody.image_b64 || null,
        mask: requestBody.mask || null
      };

      // Call the AI model
      const response = await env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);

      // Return the AI-generated image as a response
      return new Response(response, {
        headers: { "Content-Type": "image/png" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid request format", details: error.message }), {
        status: 400
      });
    }
  },
} satisfies ExportedHandler<Env>;
