const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();

const projectClient = new AIProjectClient(
  process.env.FOUNDRY_PROJECT_ENDPOINT,
  credential
);

// ======================================================
// GET SALES ANALYTICS AGENT
// ======================================================

async function getSalesAnalyticsAgent() {
  const agent = await projectClient.agents.get(
    process.env.FOUNDRY_AGENT_NAME
  );

  console.log(`Connected to agent: ${agent.name}`);
  console.log(`Agent ID: ${agent.id}`);

  return agent;
}

// ======================================================
// EXISTING MONGODB ANALYTICS FLOW
// ======================================================

async function askSalesAnalyticsAgent(message, analyticsData = null) {
  const agent = await getSalesAnalyticsAgent();

  const openAIClient = projectClient.getOpenAIClient();

  const conversation = await openAIClient.conversations.create();

  console.log(`Conversation created: ${conversation.id}`);

  let finalMessage = message;

  if (analyticsData) {
    finalMessage = `
You are analyzing a real Sales Analytics application.

Use ONLY the business data provided below.
Do not invent or assume numbers.

BUSINESS ANALYTICS DATA:
${JSON.stringify(analyticsData, null, 2)}

USER QUESTION:
${message}

Instructions:
- Answer the user's question using the provided business data.
- If the required data is unavailable, clearly say that it is unavailable.
- Do not fabricate values.
- Give concise, business-friendly insights.
- Include relevant numbers where available.
- For comparisons, calculate the difference and percentage when possible.
- End with actionable recommendations when appropriate.
`;
  }

  const response = await openAIClient.responses.create({
    conversation: conversation.id,
    input: finalMessage,
    agent_reference: {
      name: agent.name,
      type: "agent_reference",
    },
  });

  return response.output_text;
}

// ======================================================
// NEW CSV + CODE INTERPRETER FLOW
// ======================================================

async function askSalesAnalyticsCSV(
  fileBuffer,
  fileName,
  question = `
Analyze the uploaded sales CSV.

Calculate:
1. Total revenue
2. Total orders
3. Average order value
4. Top 5 products by revenue
5. Top 3 business insights

Use Code Interpreter to read and calculate directly from the CSV.

Do NOT use MongoDB data.
Do NOT use previous conversation data.
Do NOT invent values.

First inspect the CSV structure and then perform the calculations.
`
) {
  try {
    const agent = await getSalesAnalyticsAgent();

    const openAIClient = projectClient.getOpenAIClient();

    console.log(`Uploading CSV: ${fileName}`);

    // --------------------------------------------------
    // Upload CSV to OpenAI/Foundry file storage
    // --------------------------------------------------

    const file = await openAIClient.files.create({
      file: new File([fileBuffer], fileName, {
        type: "text/csv",
      }),
      purpose: "assistants",
    });

    console.log(`CSV uploaded successfully: ${file.id}`);

    // --------------------------------------------------
    // Create conversation
    // --------------------------------------------------

    const conversation = await openAIClient.conversations.create();

    console.log(`Conversation created: ${conversation.id}`);

    // --------------------------------------------------
    // Ask Foundry Agent with CSV attached
    // --------------------------------------------------

    const response = await openAIClient.responses.create({
      conversation: conversation.id,

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are the Sales Analytics AI Business Analyst.

The attached CSV file is the PRIMARY and ONLY source
for this analysis.

File name:
${fileName}

${question}

Important rules:
- Use the Code Interpreter tool.
- Read the CSV file.
- Inspect its columns and rows.
- Calculate the requested metrics directly from the CSV.
- Do NOT use MongoDB data.
- Do NOT use dashboard data.
- Do NOT use previous conversation data.
- Do NOT assume or fabricate values.
- If a metric cannot be calculated from the CSV, clearly explain why.
- Give concise business insights after the calculations.
`,
            },
            {
              type: "input_file",
              file_id: file.id,
            },
          ],
        },
      ],

      agent_reference: {
        name: agent.name,
        type: "agent_reference",
      },
    });

    console.log("CSV analysis completed.");

    return response.output_text;
  } catch (error) {
    console.error("CSV Agent Error:", error);

    throw error;
  }
}

// ======================================================
// SIMPLE AGENT TEST
// ======================================================

async function testAgent(
  message = "Hello, introduce yourself as the Sales Analytics AI Business Analyst."
) {
  try {
    const response = await askSalesAnalyticsAgent(message);

    console.log("\n==============================");
    console.log("SALES ANALYTICS AI RESPONSE");
    console.log("==============================");
    console.log(response);
    console.log("==============================\n");

    return response;
  } catch (error) {
    console.error("\nAgent test failed:");
    console.error(error);

    throw error;
  }
}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  projectClient,
  getSalesAnalyticsAgent,
  askSalesAnalyticsAgent,
  askSalesAnalyticsCSV,
  testAgent,
};