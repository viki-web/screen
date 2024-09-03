import express from 'express';
import { Client } from "@gradio/client";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate-screenshot', async (req, res) => {
  try {
    const { html, css, bodyWidth, bodyHeight } = req.body;

    // Connect to the Gradio API
    const client = await Client.connect("https://victorfdes-spaces.hf.space");
    const result = await client.predict("/run_script", { 		
      html: html,
      css: css,
      body_width: bodyWidth,
      body_height: bodyHeight,
    });

    console.log('Gradio API response:', result);

    const status = result.data[1];
    const imageUrl = result.data[2];

    res.json({ status, imageUrl });
    
  } catch (error) {
    console.error('Error calling Gradio API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});