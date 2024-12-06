export default function Page() {
  return (
    <iframe
      src={`https://aichatbot.sendbird.com/playground/index.html?app_id=${process.env.NEXT_PUBLIC_AI_AGENT_APP_ID}&bot_id=${process.env.NEXT_PUBLIC_AI_AGENT_BOT_ID}&region=us-1`}
      className="flex-grow w-full h-full"
    />
  );
}
