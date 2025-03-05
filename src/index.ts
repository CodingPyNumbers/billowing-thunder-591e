export default {
  async fetch(request, env) {
    try {
      // Ensure we are handling a POST request
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Only POST method is allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Read the request body safely
      const bodyText = await request.text(); // Read as raw text
      let requestData;

      try {
        requestData = JSON.parse(bodyText); // Try parsing JSON
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Extract and validate the prompt
      const prompt = requestData?.prompt;
      if (!prompt || typeof prompt !== "string") {
        return new Response(JSON.stringify({ error: "Missing or invalid prompt" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Call Cloudflare AI Model
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      // Return the generated image
      return new Response(response, {
        headers: { "Content-Type": "image/png" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
} satisfies ExportedHandler<Env>;
