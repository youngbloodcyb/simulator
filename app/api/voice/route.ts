// TODO: auth protect this route

const agents = [
  {
    id: "YMtZk32ebdPOqHgU1p7y",
    instructions:
      "You are an IRS agent talking to a taxpayer named Donald. Your objective is to get a verbal confirmation that he will pay his backtaxes.",
  },
  // {
  //   id: "0LmX1LVSuSIZO7IUIS9r",
  //   instructions:
  //     "You are a receptionist at a plastic surgery clinic talking to a customer named Rashad. Don't give him a refund.",
  // },
];

export async function GET() {
  const randomNumber = Math.floor(Math.random() * agents.length);
  const agentId = agents[randomNumber].id;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      method: "GET",
      headers: {
        "xi-api-key": process.env.XI_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    return Response.error();
  }

  const body = await response.json();
  const url = body.signed_url;
  return Response.json({
    url,
    instructions: agents[randomNumber].instructions,
  });
}
