import { config } from "../config";

/**
 * Sends a formatted message to a Discord channel.
 * @param projectName - The name of the project.
 * @param functionName - The name of the function.
 * @param status - The status message to send.
 */
const sendMessage = async (projectName: string, functionName: string, status: string) => {
    if (config.environment != "local") {

        const formattedMessage = `[${projectName}:${functionName}]\n\n${status}`;

        try {
            const response = await fetch(config.discordHook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: formattedMessage })
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            console.log('Message sent successfully');
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    }

};

export { sendMessage };
