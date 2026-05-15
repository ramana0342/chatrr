import { customAlphabet } from "nanoid";

const nanoidLower = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);

export const userId = () => "user_" + nanoidLower();
export const messageId = () => "message_" + nanoidLower();
