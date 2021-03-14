import { VoiceState } from "discord.js";
import { client } from "..";
import Command from "../Command";
import { dislike, like } from "../constants";

const moveall: Command = {
    name: "moveall",
    description:
        "Move todos os utilizadores no teu canal para o próximo canal que entrares",
    admin: true,
    call: async (message, ...args) => {
        const channel = message.member?.voice.channel;

        if (!channel) {
            message.channel.send("Precisas de estar num canal de voz :imp:");
            return;
        }

        const onVoiceStateUpdate = (_: VoiceState, nvs: VoiceState) => {
            const newChannel = nvs.channel;
            if (
                nvs.member != message.member ||
                !newChannel ||
                newChannel == channel
            )
                return;

            const members = channel.members;

            members.forEach((m) => m.voice.setChannel(newChannel));
            message.react(like);
            client.off("voiceStateUpdate", onVoiceStateUpdate);
        };
        client.on("voiceStateUpdate", onVoiceStateUpdate);

        await new Promise((resolve) => setTimeout(resolve, 60000));
        message.react(dislike);
        client.off("voiceStateUpdate", onVoiceStateUpdate);
    },
};

export default moveall;
