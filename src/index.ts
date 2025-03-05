export default {
  async fetch(request, env) {
    try {
      // Parse the incoming JSON request
      const { prompt } = await request.json();

      // Validate prompt input
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Missing prompt in request body" }), { status: 400 });
      }

      // Define inputs with the received prompt
      const inputs = { prompt };

      // Call Cloudflare AI Model
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      // Return the generated image
      return new Response(response, {
        headers: { "content-type": "image/png" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
